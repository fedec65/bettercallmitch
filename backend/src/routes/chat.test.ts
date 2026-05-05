import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../index";

describe("Chat API", () => {
    describe("GET /chat/agents", () => {
        it("requires authentication", async () => {
            const res = await request(app).get("/chat/agents");
            expect(res.status).toBe(401);
        });
    });

    describe("GET /health", () => {
        it("returns ok", async () => {
            const res = await request(app).get("/health");
            expect(res.status).toBe(200);
            expect(res.body).toEqual({ ok: true });
        });
    });
});
