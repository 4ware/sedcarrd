"use client";

import { useMutation } from "@tanstack/react-query";
import { authClient } from "../lib/auth-client";
import { unwrapAuth } from "../lib/auth-error";

/** Sets a new password with the token from the reset link (single use; signs out all sessions). */
export function useResetPassword() {
  return useMutation({
    mutationFn: ({ token, newPassword }: { token: string; newPassword: string }) =>
      unwrapAuth(authClient.resetPassword({ token, newPassword })),
  });
}
