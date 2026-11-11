"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { peopleQueryOptions } from "./queries";

export function usePeople() {
  return useQuery(peopleQueryOptions(api));
}
