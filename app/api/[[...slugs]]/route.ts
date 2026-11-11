import { app } from "@/server/app";

/** Hands every /api/* request to Elysia (see server/app.ts). */
const handler = (request: Request) => app.fetch(request);

export { handler as DELETE, handler as GET, handler as HEAD, handler as OPTIONS, handler as PATCH, handler as POST, handler as PUT };
