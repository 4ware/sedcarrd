import { mock } from "bun:test";

type Result = { data: unknown; error: null | { status: number; code?: string; message?: string } };
const ok = async (): Promise<Result> => ({ data: { ok: true }, error: null });

/**
 * Shared stand-in for the Better Auth browser client. `mock.module` is process-wide in bun,
 * so every test uses this one object; call `resetAuthClientMock()` in `beforeEach`.
 */
export const authClientMock = {
  signIn: { email: mock((_input: { email: string; password: string; callbackURL?: string }) => ok()) },
  signUp: {
    email: mock((_input: { name: string; email: string; password: string; callbackURL?: string }) => ok()),
  },
  signOut: mock(() => ok()),
  sendVerificationEmail: mock((_input: { email: string; callbackURL?: string }) => ok()),
};

export function resetAuthClientMock() {
  for (const fn of [
    authClientMock.signIn.email,
    authClientMock.signUp.email,
    authClientMock.signOut,
    authClientMock.sendVerificationEmail,
  ]) {
    fn.mockReset();
    fn.mockImplementation(ok);
  }
}

mock.module("@/features/auth/lib/auth-client", () => ({ authClient: authClientMock }));
