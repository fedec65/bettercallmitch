import { describe, it, expect, vi, beforeAll } from "vitest";
import request from "supertest";
import { mockAuthModule } from "../test-utils/mockAuth";

// Must mock auth BEFORE importing the app
vi.mock("../middleware/auth", () => mockAuthModule());

// Import app after mock is set up
let app: typeof import("../index").app;
beforeAll(async () => {
    const mod = await import("../index");
    app = mod.app;
});

describe("Chat API — Agents (authenticated)", () => {
    describe("GET /chat/agents", () => {
        it("returns 20 agents", async () => {
            const res = await request(app).get("/chat/agents");
            expect(res.status).toBe(200);
            expect(res.body).toHaveLength(20);
        });

        it("returns agents with correct shape (no prompts)", async () => {
            const res = await request(app).get("/chat/agents");
            expect(res.status).toBe(200);
            for (const agent of res.body) {
                expect(agent).toHaveProperty("id");
                expect(agent).toHaveProperty("name");
                expect(agent).toHaveProperty("description");
                expect(agent).toHaveProperty("icon");
                expect(agent).not.toHaveProperty("prompt");
            }
        });

        it("includes all priority agents", async () => {
            const res = await request(app).get("/chat/agents");
            const ids = res.body.map((a: { id: string }) => a.id);
            expect(ids).toContain("general");
            expect(ids).toContain("researcher");
            expect(ids).toContain("litigator");
            expect(ids).toContain("drafter");
            expect(ids).toContain("strategist");
        });

        it("includes all phase 2 agents", async () => {
            const res = await request(app).get("/chat/agents");
            const ids = res.body.map((a: { id: string }) => a.id);
            expect(ids).toContain("cantonal_specialist");
            expect(ids).toContain("citation_verifier");
            expect(ids).toContain("federal_analyst");
            expect(ids).toContain("adversarial_advocate");
            expect(ids).toContain("adversarial_adversary");
            expect(ids).toContain("adversarial_judge");
            expect(ids).toContain("document_analyst");
            expect(ids).toContain("translator");
            expect(ids).toContain("summarizer");
            expect(ids).toContain("cas_specialist");
            expect(ids).toContain("compliance_officer");
            expect(ids).toContain("corporate_lawyer");
            expect(ids).toContain("employment_lawyer");
            expect(ids).toContain("real_estate_lawyer");
            expect(ids).toContain("tax_advisor");
        });

        it("lists general agent first", async () => {
            const res = await request(app).get("/chat/agents");
            expect(res.body[0].id).toBe("general");
        });
    });
});
