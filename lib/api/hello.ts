import { queryOptions } from "@tanstack/react-query";
import type { ApiClient } from "./types";
import { unwrap } from "./unwrap";

/**
 * Query keys + options for the hello endpoint. Options take the API client as an argument so the
 * same definition works for client hooks (`api`) and server prefetching (`serverApi`).
 */
export const helloKeys = {
  all: ["hello"] as const,
  detail: (name?: string) => [...helloKeys.all, { name }] as const,
};

export function helloQueryOptions(client: ApiClient, name?: string) {
  return queryOptions({
    queryKey: helloKeys.detail(name),
    queryFn: () => unwrap(client.hello.get({ query: { name } })),
  });
}
