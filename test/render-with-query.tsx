import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, type RenderHookOptions } from "@testing-library/react";
import type { ReactNode } from "react";

/** A QueryClient tuned for tests: no retries, no caching between tests. */
export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: Infinity }, mutations: { retry: false } },
  });
}

/** renderHook inside a fresh QueryClientProvider. */
export function renderHookWithQuery<Result, Props>(
  hook: (props: Props) => Result,
  options: RenderHookOptions<Props> = {},
) {
  const queryClient = createTestQueryClient();
  function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  }

  return { queryClient, ...renderHook(hook, { wrapper: Wrapper, ...options }) };
}
