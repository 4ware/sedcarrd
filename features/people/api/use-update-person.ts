"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { unwrap } from "@/lib/api/unwrap";
import type { PersonInput } from "../lib/person-form";
import { peopleKeys } from "./queries";

export type UpdatePersonInput = Partial<PersonInput>;

/** Saves (some of) a person's fields; refreshes the list and that person's cached data. */
export function useUpdatePerson(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdatePersonInput) => unwrap(api.people({ id }).patch(input)),
    onSuccess: (person) => {
      queryClient.setQueryData(peopleKeys.detail(id), person);
      return queryClient.invalidateQueries({ queryKey: peopleKeys.list() });
    },
  });
}
