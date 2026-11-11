"use client";

import { useMutation } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { authClient } from "../lib/auth-client";
import { unwrapAuth } from "../lib/auth-error";
import { verificationCallbackUrl } from "../lib/callback-url";

export type SignUpInput = { name: string; email: string; password: string };

/** Creates the account and mails a verification link; no session until the email is confirmed. */
export function useSignUp() {
  const locale = useLocale() as Locale;

  return useMutation({
    mutationFn: (input: SignUpInput) =>
      unwrapAuth(authClient.signUp.email({ ...input, callbackURL: verificationCallbackUrl(locale) })),
  });
}
