import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { createServerSupabase } from "../lib/supabase";

export const userRouter = Router();

// POST /user/profile
userRouter.post("/profile", requireAuth, async (req, res) => {
  const userId = res.locals.userId as string;
  const db = createServerSupabase();
  const { error } = await db
    .from("user_profiles")
    .upsert(
      { user_id: userId },
      { onConflict: "user_id", ignoreDuplicates: true },
    );
  if (error) return void res.status(500).json({ detail: error.message });
  res.json({ ok: true });
});

// GET /user/health/ollama
userRouter.get("/health/ollama", async (_req, res) => {
  const host = (process.env.OLLAMA_HOST || "http://localhost:11434").replace(/\/$/, "");
  try {
    const response = await fetch(`${host}/api/tags`, { signal: AbortSignal.timeout(5000) });
    if (!response.ok) {
      return void res.json({ available: false, models: [] });
    }
    const data = (await response.json()) as { models?: Array<{ name: string }> };
    const models = (data.models || []).map((m) => m.name);
    res.json({ available: true, models });
  } catch {
    res.json({ available: false, models: [] });
  }
});

// DELETE /user/account
userRouter.delete("/account", requireAuth, async (_req, res) => {
  const userId = res.locals.userId as string;
  const db = createServerSupabase();
  const { error } = await db.auth.admin.deleteUser(userId);
  if (error) return void res.status(500).json({ detail: error.message });
  res.status(204).send();
});
