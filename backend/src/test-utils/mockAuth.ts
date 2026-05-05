const TEST_USER_ID = "test-user-123";
const TEST_USER_EMAIL = "test@example.com";

/**
 * Mocks the auth middleware to bypass authentication for tests.
 * Import this and call vi.mock("../middleware/auth", () => mockAuthModule())
 * in any test file that needs authenticated routes.
 */
export function mockAuthModule() {
    return {
        requireAuth: (_req: unknown, res: { locals: Record<string, unknown> }, next: () => void) => {
            res.locals.userId = TEST_USER_ID;
            res.locals.userEmail = TEST_USER_EMAIL;
            res.locals.token = "test-token";
            next();
        },
    };
}

export { TEST_USER_ID, TEST_USER_EMAIL };
