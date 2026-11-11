import { queryOptions } from "@tanstack/react-query";
import type { ApiClient } from "@/lib/api/types";
import { unwrap } from "@/lib/api/unwrap";

export const peopleKeys = {
  all: ["people"] as const,
  list: () => [...peopleKeys.all, "list"] as const,
  detail: (id: string) => [...peopleKeys.all, "detail", id] as const,
};

/** The signed-in user's people (works with the browser `api` and the in-process `serverApi`). */
export function peopleQueryOptions(client: ApiClient) {
  return queryOptions({
    queryKey: peopleKeys.list(),
    queryFn: () => unwrap(client.people.get()),
  });
}

/** One of the signed-in user's people; 404 (ApiError) when it does not exist or belongs to someone else. */
export function personQueryOptions(client: ApiClient, id: string) {
  return queryOptions({
    queryKey: peopleKeys.detail(id),
    queryFn: () => unwrap(client.people({ id }).get()),
  });
}
