"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { personQueryOptions } from "./queries";

export function usePerson(id: string) {
  return useQuery(personQueryOptions(api, id));
}
