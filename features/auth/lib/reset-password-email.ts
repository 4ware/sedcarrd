import type { Locale } from "@/i18n/routing";
import type { EmailMessage } from "@/lib/email/send-email";
import { type AuthEmailCopy, localeFromVerificationUrl, renderAuthEmail } from "./verification-email";

const copy: Record<Locale, AuthEmailCopy> = {
  de: {
    subject: "Setze dein Passwort zurück",
    greeting: (name: string) => `Hallo ${name},`,
    intro: "jemand – hoffentlich du – möchte das Passwort deines Sedcarrd-Kontos zurücksetzen.",
    button: "Neues Passwort festlegen",
    fallback: "Falls der Button nicht funktioniert, öffne diesen Link:",
    expiry: "Der Link ist eine Stunde gültig und kann nur einmal benutzt werden.",
    ignore: "Du hast das nicht angefordert? Dann ignoriere diese E-Mail, dein Passwort bleibt unverändert.",
  },
  en: {
    subject: "Reset your password",
    greeting: (name: string) => `Hi ${name},`,
    intro: "someone – hopefully you – asked to reset the password of your Sedcarrd account.",
    button: "Choose a new password",
    fallback: "If the button doesn't work, open this link:",
    expiry: "The link is valid for one hour and can be used once.",
    ignore: "Didn't ask for this? Ignore this email; your password stays the same.",
  },
};

/** The "reset your password" message; its language follows the link's callbackURL (the page it opens). */
export function resetPasswordEmail({ to, name, url }: { to: string; name: string; url: string }): EmailMessage {
  const locale = localeFromVerificationUrl(url);
  return renderAuthEmail({ to, name, url, locale, t: copy[locale] });
}
