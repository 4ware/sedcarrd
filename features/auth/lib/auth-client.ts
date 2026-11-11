import { createAuthClient } from "better-auth/react";

/**
 * Browser client for Better Auth's endpoints (/api/auth/*, served through Elysia).
 * Use it only through the TanStack Query hooks in ../api, never directly in components.
 */
export const authClient = createAuthClient({ basePath: "/api/auth" });
