import { describe, it, expect } from "vitest";
import { buildMessages } from "./chatTools";

interface Msg { role: string; content: string }

describe("buildMessages", () => {
    const emptyMessages: Parameters<typeof buildMessages>[0] = [];
    const emptyDocs: Parameters<typeof buildMessages>[1] = [];

    function getSystem(result: unknown[]): Msg {
        return (result as Msg[]).find((m) => m.role === "system")!;
    }

    describe("agent injection", () => {
        it("includes agent mode for researcher", () => {
            const result = buildMessages(emptyMessages, emptyDocs, undefined, undefined, undefined, "researcher");
            const systemMsg = getSystem(result);
            expect(systemMsg.content).toContain("AGENT MODE: RESEARCHER");
            expect(systemMsg.content).toContain("precedent");
        });

        it("includes agent mode for litigator", () => {
            const result = buildMessages(emptyMessages, emptyDocs, undefined, undefined, undefined, "litigator");
            const systemMsg = getSystem(result);
            expect(systemMsg.content).toContain("AGENT MODE: LITIGATOR");
            expect(systemMsg.content).toContain("ZPO");
        });

        it("includes agent mode for strategist", () => {
            const result = buildMessages(emptyMessages, emptyDocs, undefined, undefined, undefined, "strategist");
            const systemMsg = getSystem(result);
            expect(systemMsg.content).toContain("AGENT MODE: STRATEGIST");
            expect(systemMsg.content).toContain("strategic");
        });

        it("works for all 20 agents", () => {
            const agentIds = [
                "general", "researcher", "litigator", "drafter", "strategist",
                "cantonal_specialist", "citation_verifier", "federal_analyst",
                "adversarial_advocate", "adversarial_adversary", "adversarial_judge",
                "document_analyst", "translator", "summarizer", "cas_specialist",
                "compliance_officer", "corporate_lawyer", "employment_lawyer",
                "real_estate_lawyer", "tax_advisor",
            ];
            for (const agentId of agentIds) {
                const result = buildMessages(emptyMessages, emptyDocs, undefined, undefined, undefined, agentId);
                const systemMsg = getSystem(result);
                expect(systemMsg.content).toContain("AGENT MODE:");
            }
        });

        it("falls back to general for unknown agent", () => {
            const result = buildMessages(emptyMessages, emptyDocs, undefined, undefined, undefined, "nonexistent");
            const systemMsg = getSystem(result);
            expect(systemMsg.content).toContain("AGENT MODE: GENERAL");
        });

        it("does not inject agent when agentId is undefined", () => {
            const result = buildMessages(emptyMessages, emptyDocs);
            const systemMsg = getSystem(result);
            expect(systemMsg.content).not.toContain("AGENT MODE:");
        });
    });

    describe("canton injection", () => {
        it("includes Zurich canton context", () => {
            const result = buildMessages(emptyMessages, emptyDocs, undefined, undefined, "ZH");
            const systemMsg = getSystem(result);
            expect(systemMsg.content).toContain("CANTON CONTEXT:");
            expect(systemMsg.content).toContain("Zurich");
            expect(systemMsg.content).toContain("German");
        });

        it("includes Geneva canton context", () => {
            const result = buildMessages(emptyMessages, emptyDocs, undefined, undefined, "GE");
            const systemMsg = getSystem(result);
            expect(systemMsg.content).toContain("Geneva");
            expect(systemMsg.content).toContain("French");
        });

        it("includes Ticino canton context", () => {
            const result = buildMessages(emptyMessages, emptyDocs, undefined, undefined, "TI");
            const systemMsg = getSystem(result);
            expect(systemMsg.content).toContain("Ticino");
            expect(systemMsg.content).toContain("Italian");
        });

        it("ignores invalid canton codes", () => {
            const result = buildMessages(emptyMessages, emptyDocs, undefined, undefined, "XX");
            const systemMsg = getSystem(result);
            expect(systemMsg.content).not.toContain("CANTON CONTEXT:");
        });
    });

    describe("agent + canton combination", () => {
        it("includes both agent and canton for litigator + ZH", () => {
            const result = buildMessages(emptyMessages, emptyDocs, undefined, undefined, "ZH", "litigator");
            const systemMsg = getSystem(result);
            expect(systemMsg.content).toContain("AGENT MODE: LITIGATOR");
            expect(systemMsg.content).toContain("CANTON CONTEXT:");
            expect(systemMsg.content).toContain("Zurich");
        });

        it("includes both agent and canton for researcher + GE", () => {
            const result = buildMessages(emptyMessages, emptyDocs, undefined, undefined, "GE", "researcher");
            const systemMsg = getSystem(result);
            expect(systemMsg.content).toContain("AGENT MODE: RESEARCHER");
            expect(systemMsg.content).toContain("Geneva");
        });
    });

    describe("system prompt extra", () => {
        it("appends extra prompt content", () => {
            const extra = "EXTRA INSTRUCTIONS";
            const result = buildMessages(emptyMessages, emptyDocs, extra);
            const systemMsg = getSystem(result);
            expect(systemMsg.content).toContain("EXTRA INSTRUCTIONS");
        });

        it("combines extra with agent and canton", () => {
            const extra = "PROJECT CONTEXT";
            const result = buildMessages(emptyMessages, emptyDocs, extra, undefined, "BE", "strategist");
            const systemMsg = getSystem(result);
            expect(systemMsg.content).toContain("AGENT MODE: STRATEGIST");
            expect(systemMsg.content).toContain("Bern");
            expect(systemMsg.content).toContain("PROJECT CONTEXT");
        });
    });
});
