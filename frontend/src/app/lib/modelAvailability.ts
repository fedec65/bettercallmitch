import { MODELS, type ModelOption } from "../components/assistant/ModelToggle";

export type ModelProvider = "claude" | "gemini" | "ollama";

export function getModelProvider(modelId: string): ModelProvider | null {
    if (modelId.startsWith("ollama-")) return "ollama";
    const model = MODELS.find((m) => m.id === modelId);
    if (!model) return null;
    return model.group === "Anthropic" ? "claude" : "gemini";
}

export function isModelAvailable(
    modelId: string,
    apiKeys: { claudeApiKey: string | null; geminiApiKey: string | null },
    ollamaAvailable = false,
): boolean {
    const provider = getModelProvider(modelId);
    if (!provider) return false;
    if (provider === "ollama") return ollamaAvailable;
    return provider === "claude"
        ? !!apiKeys.claudeApiKey?.trim()
        : !!apiKeys.geminiApiKey?.trim();
}

export function isProviderAvailable(
    provider: ModelProvider,
    apiKeys: { claudeApiKey: string | null; geminiApiKey: string | null },
    ollamaAvailable = false,
): boolean {
    if (provider === "ollama") return ollamaAvailable;
    return provider === "claude"
        ? !!apiKeys.claudeApiKey?.trim()
        : !!apiKeys.geminiApiKey?.trim();
}

export function providerLabel(provider: ModelProvider): string {
    if (provider === "ollama") return "Ollama (Local)";
    return provider === "claude" ? "Anthropic (Claude)" : "Google (Gemini)";
}

export function modelGroupToProvider(
    group: ModelOption["group"],
): ModelProvider {
    if (group === "Ollama") return "ollama";
    return group === "Anthropic" ? "claude" : "gemini";
}
