"use client";

import { useMutation } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { authClient } from "../lib/auth-client";
import { unwrapAuth } from "../lib/auth-error";
import { resetPasswordPageUrl } from "../lib/callback-url";

/** Mails a reset link. Succeeds the same way whether or not the email has an account. */
export function useRequestPasswordReset() {
  const locale = useLocale() as Locale;

  return useMutation({
    mutationFn: (email: string) =>
      unwrapAuth(authClient.requestPasswordReset({ email, redirectTo: resetPasswordPageUrl(locale) })),
  });
}
