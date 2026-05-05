import { describe, it, expect } from "vitest";
import { getAgent, listAgents, buildAgentSystemPrompt } from "./registry";

describe("Agent Registry", () => {
    describe("listAgents", () => {
        it("returns all 20 agents", () => {
            const agents = listAgents();
            expect(agents).toHaveLength(20);
        });

        it("returns agents with required fields", () => {
            const agents = listAgents();
            for (const agent of agents) {
                expect(agent.id).toBeDefined();
                expect(agent.name).toBeDefined();
                expect(agent.description).toBeDefined();
                expect(agent.icon).toBeDefined();
            }
        });

        it("includes priority agents", () => {
            const agents = listAgents();
            const ids = agents.map((a) => a.id);
            expect(ids).toContain("general");
            expect(ids).toContain("researcher");
            expect(ids).toContain("litigator");
            expect(ids).toContain("drafter");
            expect(ids).toContain("strategist");
        });

        it("includes phase 2 agents", () => {
            const agents = listAgents();
            const ids = agents.map((a) => a.id);
            expect(ids).toContain("adversarial_advocate");
            expect(ids).toContain("adversarial_adversary");
            expect(ids).toContain("adversarial_judge");
            expect(ids).toContain("compliance_officer");
            expect(ids).toContain("tax_advisor");
        });
    });

    describe("getAgent", () => {
        it("returns the correct agent by id", () => {
            const agent = getAgent("researcher");
            expect(agent.id).toBe("researcher");
            expect(agent.name).toBe("Researcher");
            expect(agent.prompt).toContain("precedent");
        });

        it("returns general agent for unknown id", () => {
            const agent = getAgent("nonexistent");
            expect(agent.id).toBe("general");
        });

        it("every agent has a non-empty prompt", () => {
            const agents = listAgents();
            for (const { id } of agents) {
                const agent = getAgent(id);
                expect(agent.prompt).toBeTruthy();
                expect(agent.prompt.length).toBeGreaterThan(50);
            }
        });
    });

    describe("buildAgentSystemPrompt", () => {
        it("appends agent suffix to base prompt", () => {
            const base = "BASE PROMPT";
            const result = buildAgentSystemPrompt(base, "researcher");
            expect(result).toContain("BASE PROMPT");
            expect(result).toContain("AGENT MODE: RESEARCHER");
            expect(result).toContain("precedent");
        });

        it("works for all registered agents", () => {
            const agents = listAgents();
            for (const { id } of agents) {
                const result = buildAgentSystemPrompt("BASE", id);
                expect(result).toContain("AGENT MODE");
                expect(result).toContain("BASE");
            }
        });

        it("falls back to general for unknown agent", () => {
            const result = buildAgentSystemPrompt("BASE", "unknown");
            expect(result).toContain("AGENT MODE: GENERAL");
        });
    });
});
