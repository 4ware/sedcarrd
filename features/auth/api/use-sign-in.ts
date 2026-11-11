"use client";

import { useMutation } from "@tanstack/react-query";
import { authClient } from "../lib/auth-client";
import { unwrapAuth } from "../lib/auth-error";

export type SignInInput = { email: string; password: string };

export function useSignIn() {
  return useMutation({
    mutationFn: (input: SignInInput) => unwrapAuth(authClient.signIn.email(input)),
  });
}
