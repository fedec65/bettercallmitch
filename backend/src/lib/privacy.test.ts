import { describe, it, expect } from "vitest";
import { scanForPrivilege } from "./privacy";

describe("Privacy Scanner (Anwaltsgeheimnis)", () => {
    describe("Strong markers — always block", () => {
        it("blocks 'anwaltsgeheimnis'", () => {
            const result = scanForPrivilege("Dies ist anwaltsgeheimnis.");
            expect(result.isPrivileged).toBe(true);
            expect(result.category).toBe("anwaltsgeheimnis");
        });

        it("blocks 'mandatsgeheimnis'", () => {
            const result = scanForPrivilege("Mandatsgeheimnis muss gewahrt werden.");
            expect(result.isPrivileged).toBe(true);
            expect(result.category).toBe("mandatsgeheimnis");
        });

        it("blocks 'secret professionnel'", () => {
            const result = scanForPrivilege("Ceci est un secret professionnel.");
            expect(result.isPrivileged).toBe(true);
            expect(result.category).toBe("secret-professionnel");
        });

        it("blocks 'segreto professionale'", () => {
            const result = scanForPrivilege("Questo è un segreto professionale.");
            expect(result.isPrivileged).toBe(true);
            expect(result.category).toBe("segreto-professionale");
        });

        it("blocks 'Art. 321 StGB'", () => {
            const result = scanForPrivilege("Geschützt nach Art. 321 StGB.");
            expect(result.isPrivileged).toBe(true);
            expect(result.category).toBe("Art.321-StGB");
        });

        it("blocks 'Art. 13 BGFA'", () => {
            const result = scanForPrivilege("Verletzung von Art. 13 BGFA.");
            expect(result.isPrivileged).toBe(true);
            expect(result.category).toBe("Art.13-BGFA");
        });
    });

    describe("Weak markers — block with co-occurrence", () => {
        it("blocks when two weak words co-occur", () => {
            const result = scanForPrivilege("Dies ist vertraulich und confidentiel.");
            expect(result.isPrivileged).toBe(true);
            expect(result.category).toBe("co-occurring-weak-patterns");
        });
    });

    describe("Weak markers — block with path discriminator", () => {
        it("blocks 'vertraulich' with client path hint", () => {
            const result = scanForPrivilege(
                "Dies ist vertraulich.",
                { path: "client-file", toolName: "search_bge" }
            );
            expect(result.isPrivileged).toBe(true);
            expect(result.category).toBe("weak-with-path-discriminator");
        });
    });

    describe("Clean content — no block", () => {
        it("allows general legal questions", () => {
            const result = scanForPrivilege("Was sagt Art. 97 OR zur Verzugsentschädigung?");
            expect(result.isPrivileged).toBe(false);
        });

        it("allows BGE citations", () => {
            const result = scanForPrivilege("BGE 138 II 351 besagt...");
            expect(result.isPrivileged).toBe(false);
        });

        it("allows procedural questions", () => {
            const result = scanForPrivilege("Wie lautet die Klagefrist nach Art. 148 ZPO?");
            expect(result.isPrivileged).toBe(false);
        });

        it("allows single weak word without discriminator", () => {
            const result = scanForPrivilege("Dies ist vertraulich.");
            expect(result.isPrivileged).toBe(false);
        });
    });
});
