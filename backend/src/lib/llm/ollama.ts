import type {
    StreamChatParams,
    StreamChatResult,
    NormalizedToolCall,
    NormalizedToolResult,
} from "./types";

const DEFAULT_OLLAMA_HOST = "http://localhost:11434";
const MAX_TOKENS = 8192;

type OllamaMessage = {
    role: "user" | "assistant" | "system";
    content: string;
    tool_calls?: unknown[];
};

function getOllamaModel(modelId: string): string {
    // Strip the "ollama-" prefix to get the actual Ollama model name
    return modelId.replace(/^ollama-/, "").replace(/-/g, ":");
}

export function getOllamaHost(apiKeys?: { ollama?: string | null }): string {
    const raw = apiKeys?.ollama?.trim() || process.env.OLLAMA_HOST || "";
    if (!raw) return DEFAULT_OLLAMA_HOST;
    return raw.replace(/\/$/, "");
}

// Backward compat alias used internally
const getHost = getOllamaHost;

export async function listOllamaModels(apiKeys?: { ollama?: string | null }): Promise<{ id: string; name: string }[]> {
    const host = getOllamaHost(apiKeys);
    try {
        const res = await fetch(`${host}/api/tags`, { signal: AbortSignal.timeout(8000) });
        if (!res.ok) return [];
        const data = (await res.json()) as { models?: Array<{ name: string }> };
        return (data.models || []).map((m) => {
            const name = m.name;
            // Convert "llama3.2:latest" → "ollama-llama3.2-latest"
            const id = "ollama-" + name.replace(/:/g, "-");
            return { id, name };
        });
    } catch {
        return [];
    }
}

function toOllamaMessages(
    systemPrompt: string | undefined,
    messages: StreamChatParams["messages"],
): OllamaMessage[] {
    const out: OllamaMessage[] = [];
    if (systemPrompt) {
        out.push({ role: "system", content: systemPrompt });
    }
    for (const m of messages) {
        out.push({
            role: m.role === "assistant" ? "assistant" : "user",
            content: m.content,
        });
    }
    return out;
}

function toOllamaTools(tools: StreamChatParams["tools"]) {
    if (!tools || tools.length === 0) return undefined;
    return tools.map((t) => ({
        type: "function",
        function: {
            name: t.function.name,
            description: t.function.description,
            parameters: t.function.parameters,
        },
    }));
}

export async function streamOllama(
    params: StreamChatParams,
): Promise<StreamChatResult> {
    const {
        model,
        systemPrompt,
        messages,
        tools = [],
        callbacks = {},
        runTools,
        apiKeys,
    } = params;
    const maxIter = params.maxIterations ?? 10;
    const host = getHost(apiKeys);
    const ollamaModel = getOllamaModel(model);
    const ollamaTools = toOllamaTools(tools);

    const ollamaMessages = toOllamaMessages(systemPrompt, messages);
    let fullText = "";

    for (let iter = 0; iter < maxIter; iter++) {
        const body: Record<string, unknown> = {
            model: ollamaModel,
            messages: ollamaMessages,
            stream: true,
            options: { num_predict: MAX_TOKENS },
        };
        if (ollamaTools && ollamaTools.length > 0) {
            body.tools = ollamaTools;
        }

        const res = await fetch(`${host}/api/chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            const errText = await res.text().catch(() => "");
            throw new Error(
                `Ollama HTTP ${res.status}: ${errText.slice(0, 200)}`,
            );
        }

        if (!res.body) {
            throw new Error("Ollama response has no body");
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let iterText = "";
        let toolCalls: NormalizedToolCall[] = [];

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            for (const line of chunk.split("\n")) {
                const trimmed = line.trim();
                if (!trimmed) continue;
                try {
                    const parsed = JSON.parse(trimmed) as {
                        message?: {
                            role?: string;
                            content?: string;
                            tool_calls?: Array<{
                                function?: {
                                    name?: string;
                                    arguments?: Record<string, unknown>;
                                };
                            }>;
                        };
                        done?: boolean;
                        error?: string;
                    };
                    if (parsed.error) {
                        throw new Error(`Ollama error: ${parsed.error}`);
                    }
                    const msg = parsed.message;
                    if (!msg) continue;
                    if (msg.content) {
                        iterText += msg.content;
                        callbacks.onContentDelta?.(msg.content);
                    }
                    if (msg.tool_calls && msg.tool_calls.length > 0) {
                        for (const tc of msg.tool_calls) {
                            const fn = tc.function;
                            if (fn?.name) {
                                toolCalls.push({
                                    id: `ollama-tool-${iter}-${toolCalls.length}`,
                                    name: fn.name,
                                    input: fn.arguments ?? {},
                                });
                            }
                        }
                    }
                } catch {
                    // Ignore parse errors for non-JSON lines
                }
            }
        }

        fullText += iterText;

        if (toolCalls.length === 0 || !runTools) {
            break;
        }

        // Record assistant turn with tool calls
        ollamaMessages.push({
            role: "assistant",
            content: iterText,
            tool_calls: toolCalls.map((tc) => ({
                function: { name: tc.name, arguments: tc.input },
            })),
        });

        // Run tools
        for (const tc of toolCalls) {
            callbacks.onToolCallStart?.(tc);
        }
        const results = await runTools(toolCalls);

        // Add tool results as user messages
        for (const r of results) {
            ollamaMessages.push({
                role: "user",
                content: `[Tool result for ${r.tool_use_id}]: ${r.content}`,
            });
        }
    }

    return { fullText };
}

export async function completeOllamaText(params: {
    model: string;
    systemPrompt?: string;
    user: string;
    maxTokens?: number;
    apiKeys?: { ollama?: string | null };
}): Promise<string> {
    const host = getHost(params.apiKeys);
    const ollamaModel = getOllamaModel(params.model);
    const messages: OllamaMessage[] = [];
    if (params.systemPrompt) {
        messages.push({ role: "system", content: params.systemPrompt });
    }
    messages.push({ role: "user", content: params.user });

    const res = await fetch(`${host}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            model: ollamaModel,
            messages,
            stream: false,
            options: { num_predict: params.maxTokens ?? 512 },
        }),
    });

    if (!res.ok) {
        const errText = await res.text().catch(() => "");
        throw new Error(`Ollama HTTP ${res.status}: ${errText.slice(0, 200)}`);
    }

    const data = (await res.json()) as {
        message?: { content?: string };
        error?: string;
    };
    if (data.error) {
        throw new Error(`Ollama error: ${data.error}`);
    }
    return data.message?.content ?? "";
}
