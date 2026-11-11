"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "./client";
import { helloQueryOptions } from "./hello";

export function useHello(name?: string) {
  return useQuery(helloQueryOptions(api, name));
}
