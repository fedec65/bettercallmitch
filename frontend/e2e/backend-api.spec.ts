import { test, expect } from "@playwright/test";

test.describe("Backend API", () => {
    test("health endpoint returns ok", async ({ request }) => {
        const response = await request.get("/health");
        expect(response.ok()).toBeTruthy();
        const body = await response.json();
        expect(body).toEqual({ ok: true });
    });

    test("agents endpoint requires auth", async ({ request }) => {
        const response = await request.get("/chat/agents");
        expect(response.status()).toBe(401);
    });

    test("chat list requires auth", async ({ request }) => {
        const response = await request.get("/chat");
        expect(response.status()).toBe(401);
    });
});
