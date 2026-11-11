"use client";

import { useMutation } from "@tanstack/react-query";
import { authClient } from "../lib/auth-client";
import { unwrapAuth } from "../lib/auth-error";

export type SignUpInput = { name: string; email: string; password: string };

export function useSignUp() {
  return useMutation({
    mutationFn: (input: SignUpInput) => unwrapAuth(authClient.signUp.email(input)),
  });
}
