"use client";

import { useMutation } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { authClient } from "../lib/auth-client";
import { unwrapAuth } from "../lib/auth-error";
import { verificationCallbackUrl } from "../lib/callback-url";

export type SignInInput = { email: string; password: string };

export function useSignIn() {
  const locale = useLocale() as Locale;

  return useMutation({
    // callbackURL: an unverified user gets a fresh verification link pointing there (and in their
    // language). On success Better Auth's client also navigates to it, i.e. to the dashboard.
    mutationFn: (input: SignInInput) =>
      unwrapAuth(authClient.signIn.email({ ...input, callbackURL: verificationCallbackUrl(locale) })),
  });
}
