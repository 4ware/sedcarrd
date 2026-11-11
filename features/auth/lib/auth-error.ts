/** Message keys under `Auth.errors` in features/auth/messages. */
export type AuthErrorKey =
  | "invalidCredentials"
  | "userExists"
  | "invalidEmail"
  | "passwordTooShort"
  | "passwordTooLong"
  | "tooManyRequests"
  | "generic";

const codeToKey: Record<string, AuthErrorKey> = {
  INVALID_EMAIL_OR_PASSWORD: "invalidCredentials",
  INVALID_PASSWORD: "invalidCredentials",
  USER_ALREADY_EXISTS: "userExists",
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: "userExists",
  INVALID_EMAIL: "invalidEmail",
  PASSWORD_TOO_SHORT: "passwordTooShort",
  PASSWORD_TOO_LONG: "passwordTooLong",
};

/** A failed Better Auth call, carrying a translatable message key. */
export class AuthError extends Error {
  readonly key: AuthErrorKey;

  constructor(
    readonly status: number,
    readonly code: string | undefined,
    message?: string,
  ) {
    super(message ?? code ?? `Auth request failed with status ${status}`);
    this.name = "AuthError";
    this.key = status === 429 ? "tooManyRequests" : ((code ? codeToKey[code] : undefined) ?? "generic");
  }
}

type BetterAuthResult<T> =
  | { data: T; error: null }
  | { data: null; error: { status: number; code?: string; message?: string } };

/** Turns Better Auth's `{ data, error }` result into "return data or throw AuthError" for TanStack Query. */
export async function unwrapAuth<T>(request: Promise<BetterAuthResult<T>>): Promise<T> {
  const { data, error } = await request;
  if (error) throw new AuthError(error.status, error.code, error.message);
  return data;
}
