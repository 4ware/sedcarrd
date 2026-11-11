"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { unwrap } from "@/lib/api/unwrap";
import type { CreatePersonInput } from "../lib/person-form";
import { peopleKeys } from "./queries";

/** Creates a person for the signed-in user and refreshes the people list. */
export function useCreatePerson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreatePersonInput) => unwrap(api.people.post(input)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: peopleKeys.all }),
  });
}
