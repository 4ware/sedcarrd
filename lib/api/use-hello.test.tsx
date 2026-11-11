import { describe, expect, mock, test } from "bun:test";
import { treaty } from "@elysiajs/eden";
import { waitFor } from "@testing-library/react";
import { app } from "@/server/app";
import { renderHookWithQuery } from "@/test/render-with-query";

// Route the browser client straight into the Elysia app instead of over HTTP.
mock.module("./client", () => ({ api: treaty(app).api }));
const { useHello } = await import("./use-hello");
const { ApiError } = await import("./unwrap");

describe("useHello", () => {
  test("loads the greeting", async () => {
    const { result } = renderHookWithQuery(() => useHello("Kai"));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual({ message: "Hello Kai from vinext on Cloudflare Workers" });
  });

  test("surfaces API errors as ApiError", async () => {
    const { result } = renderHookWithQuery(() => useHello(""));

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(ApiError);
    expect((result.current.error as InstanceType<typeof ApiError>).status).toBe(422);
  });
});
