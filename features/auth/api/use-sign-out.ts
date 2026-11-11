"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authClient } from "../lib/auth-client";
import { unwrapAuth } from "../lib/auth-error";

export function useSignOut() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => unwrapAuth(authClient.signOut()),
    // Nothing cached for the previous user may leak into the next session.
    onSuccess: () => queryClient.clear(),
  });
}
