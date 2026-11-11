"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { unwrap } from "@/lib/api/unwrap";
import type { ThemeKey } from "@/features/themes/registry";
import type { PersonInput } from "../lib/person-form";
import { peopleKeys } from "./queries";

export type UpdatePersonInput = Partial<PersonInput & { theme: ThemeKey }>;

/** Saves (some of) a person's fields; refreshes the list and that person's cached data. */
export function useUpdatePerson(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdatePersonInput) => unwrap(api.people({ id }).patch(input)),
    onSuccess: (person) => {
      queryClient.setQueryData(peopleKeys.detail(id), person);
      // The list and any cached public page show this person too.
      return Promise.all([
        queryClient.invalidateQueries({ queryKey: peopleKeys.list() }),
        queryClient.invalidateQueries({ queryKey: [...peopleKeys.all, "public"] }),
      ]);
    },
  });
}
