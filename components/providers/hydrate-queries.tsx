"use client";

import { type DehydratedState, HydrationBoundary } from "@tanstack/react-query";
import type { ReactNode } from "react";

/**
 * Hands queries prefetched in a Server Component to the client cache. Use this instead of importing
 * HydrationBoundary in a Server Component: there, the client reference points at
 * @tanstack/react-query directly, while QueryProvider uses Vite's pre-bundled copy. In dev that loads
 * two copies with two contexts ("No QueryClient set"). Importing it here keeps a single copy.
 */
export function HydrateQueries({ state, children }: { state: DehydratedState; children: ReactNode }) {
  return <HydrationBoundary state={state}>{children}</HydrationBoundary>;
}
