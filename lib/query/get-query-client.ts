import { defaultShouldDehydrateQuery, isServer, QueryClient } from "@tanstack/react-query";
import { ApiError } from "@/lib/api/unwrap";

const MAX_RETRIES = 3;

/** Retry network and server errors, but not 4xx answers (missing, invalid, unauthorized): those won't change. */
export function shouldRetry(failureCount: number, error: unknown) {
  if (error instanceof ApiError && error.status >= 400 && error.status < 500) return false;
  return failureCount < MAX_RETRIES;
}

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, avoid refetching immediately on the client after hydration.
        staleTime: 60 * 1000,
        retry: shouldRetry,
      },
      dehydrate: {
        // Also hand still-pending (streamed) server prefetches to the client.
        shouldDehydrateQuery: (query) => defaultShouldDehydrateQuery(query) || query.state.status === "pending",
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

/** A fresh client per server request; one shared client in the browser. */
export function getQueryClient() {
  if (isServer) return makeQueryClient();
  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
}
