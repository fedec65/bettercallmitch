import { Router } from "express";
import { checkAllMcpServers } from "../lib/mcp/client";

export const mcpRouter = Router();

mcpRouter.get("/status", async (_req, res) => {
    const { servers, allOk } = await checkAllMcpServers();
    res.json({ servers, allOk });
});
