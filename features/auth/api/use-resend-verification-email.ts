"use client";

import { useMutation } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { authClient } from "../lib/auth-client";
import { unwrapAuth } from "../lib/auth-error";
import { verificationCallbackUrl } from "../lib/callback-url";

/** Mails a new verification link to an address that is not confirmed yet. */
export function useResendVerificationEmail() {
  const locale = useLocale() as Locale;

  return useMutation({
    mutationFn: (email: string) =>
      unwrapAuth(authClient.sendVerificationEmail({ email, callbackURL: verificationCallbackUrl(locale) })),
  });
}
