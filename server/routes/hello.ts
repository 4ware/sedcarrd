import { Elysia, t } from "elysia";

/** Example router. Feature routers follow the same shape: `features/<name>/api/routes.ts`. */
export const helloRoutes = new Elysia({ name: "routes/hello" }).get(
  "/hello",
  ({ query: { name } }) => ({
    message: name ? `Hello ${name} from vinext on Cloudflare Workers` : "Hello from vinext on Cloudflare Workers",
  }),
  {
    query: t.Object({ name: t.Optional(t.String({ minLength: 1, maxLength: 64 })) }),
    response: t.Object({ message: t.String() }),
  },
);
