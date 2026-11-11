import { getPathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

/**
 * Absolute URL the verification link leads to once confirmed (the localized dashboard).
 * Absolute so Better Auth never has to guess the origin; the locale prefix also tells the
 * server which language to write the email in.
 */
export function verificationCallbackUrl(locale: Locale) {
  return new URL(getPathname({ href: "/dashboard", locale }), window.location.origin).toString();
}

/**
 * Absolute URL of the "choose a new password" page, used as `redirectTo` of a reset request: the
 * emailed link checks the token and then opens this page with `?token=…` (or `?error=INVALID_TOKEN`).
 * The locale prefix also sets the email's language.
 */
export function resetPasswordPageUrl(locale: Locale) {
  return new URL(getPathname({ href: "/reset-password", locale }), window.location.origin).toString();
}
