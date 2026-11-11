/** Server-only entry point of the auth feature (Server Components, layouts, route handlers). */
export { getSession, redirectIfAuthenticated, requireSession } from "./lib/session";
export type { Session, SessionUser } from "./lib/auth";
