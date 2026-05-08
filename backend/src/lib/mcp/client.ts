const REQUEST_TIMEOUT_MS = 30000;

export class McpHttpClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
  }

  async callTool(
    toolName: string,
    args: Record<string, unknown>
  ): Promise<string> {
    const id = crypto.randomUUID();
    const payload = {
      jsonrpc: "2.0",
      id,
      method: "tools/call",
      params: {
        name: toolName,
        arguments: args,
      },
    };

    const url = `${this.baseUrl}`;
    console.log(`[MCP] → ${url} | tool=${toolName} id=${id}`);
    console.log(`[MCP] payload:`, JSON.stringify(payload));

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      let data: unknown;
      try {
        data = await response.json();
      } catch {
        const text = await response.text();
        console.error(`[MCP] ← ${url} id=${id} invalid JSON:`, text.slice(0, 500));
        return `[MCP Error] Server returned invalid JSON for tool "${toolName}". Status: ${response.status}.`;
      }

      console.log(`[MCP] ← ${url} id=${id} status=${response.status}`);

      if (!response.ok) {
        console.error(`[MCP] ← ${url} id=${id} HTTP error:`, data);
        return `[MCP Error] HTTP ${response.status} calling tool "${toolName}".`;
      }

      const rpcResponse = data as {
        error?: { code?: number; message?: string };
        result?: {
          content?: Array<{ type?: string; text?: string }>;
        };
      };

      if (rpcResponse.error) {
        const errMsg =
          rpcResponse.error.message || `JSON-RPC error ${rpcResponse.error.code}`;
        console.error(`[MCP] ← ${url} id=${id} JSON-RPC error:`, errMsg);
        return `[MCP Error] ${errMsg} (tool: "${toolName}").`;
      }

      const content = rpcResponse.result?.content ?? [];
      const textParts = content
        .filter((c): c is { type: string; text: string } => c?.type === "text" && typeof c.text === "string")
        .map((c) => c.text);

      return textParts.join("\n");
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        console.error(`[MCP] ← ${url} id=${id} timed out after ${REQUEST_TIMEOUT_MS}ms`);
        return `[MCP Error] Request timed out calling tool "${toolName}" after ${REQUEST_TIMEOUT_MS}ms.`;
      }

      console.error(`[MCP] ← ${url} id=${id} network/error:`, err);
      return `[MCP Error] ${err instanceof Error ? err.message : String(err)} (tool: "${toolName}").`;
    }
  }
}

export const MCP_SERVERS: Record<string, string> = {
  entscheidsuche: "https://mcp.bettercallclaude.ch/entscheidsuche/mcp",
  "bge-search": "https://mcp.bettercallclaude.ch/bge-search/mcp",
  "legal-citations": "https://mcp.bettercallclaude.ch/legal-citations/mcp",
  "fedlex-sparql": "https://mcp.bettercallclaude.ch/fedlex-sparql/mcp",
  onlinekommentar: "https://mcp.bettercallclaude.ch/onlinekommentar/mcp",
  "legal-persona": "https://mcp.bettercallclaude.ch/legal-persona/mcp",
  "tas-jurisprudence": "https://mcp.bettercallclaude.ch/tas-jurisprudence/mcp",
};

export async function callMcpTool(
  serverName: string,
  toolName: string,
  args: Record<string, unknown>
): Promise<string> {
  const url = MCP_SERVERS[serverName];
  if (!url) {
    const msg = `[MCP Error] Unknown server "${serverName}".`;
    console.error(msg);
    return msg;
  }

  const client = new McpHttpClient(url);
  return client.callTool(toolName, args);
}

export type McpServerHealth = {
  name: string;
  url: string;
  status: "ok" | "error";
  error?: string;
};

const HEALTH_TIMEOUT_MS = 8000;

export async function checkMcpServerHealth(
  serverName: string,
): Promise<McpServerHealth> {
  const url = MCP_SERVERS[serverName];
  if (!url) {
    return { name: serverName, url: "", status: "error", error: "Unknown server" };
  }

  const id = crypto.randomUUID();
  const payload = {
    jsonrpc: "2.0",
    id,
    method: "tools/list",
  };

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), HEALTH_TIMEOUT_MS);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/event-stream",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      return {
        name: serverName,
        url,
        status: "error",
        error: `HTTP ${response.status}`,
      };
    }

    const text = await response.text();
    const lines = text.split("\n");
    let dataLine = "";
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith("data:")) {
        dataLine = trimmed.slice(5).trim();
        break;
      }
    }

    if (!dataLine) {
      return { name: serverName, url, status: "ok" };
    }

    try {
      const data = JSON.parse(dataLine) as { error?: { message?: string } };
      if (data.error) {
        return {
          name: serverName,
          url,
          status: "error",
          error: data.error.message || "JSON-RPC error",
        };
      }
    } catch {
      // Non-JSON data line is fine — server responded
    }

    return { name: serverName, url, status: "ok" };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      name: serverName,
      url,
      status: "error",
      error: message,
    };
  }
}

export async function checkAllMcpServers(): Promise<{
  servers: McpServerHealth[];
  allOk: boolean;
}> {
  const servers = await Promise.all(
    Object.keys(MCP_SERVERS).map((name) => checkMcpServerHealth(name)),
  );
  const allOk = servers.every((s) => s.status === "ok");
  return { servers, allOk };
}
