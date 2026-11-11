import { routing, type Locale } from "@/i18n/routing";
import type { EmailMessage } from "@/lib/email/send-email";

const copy: Record<Locale, AuthEmailCopy> = {
  de: {
    subject: "Bestätige deine E-Mail-Adresse",
    greeting: (name: string) => `Hallo ${name},`,
    intro: "bitte bestätige deine E-Mail-Adresse, um dein Sedcarrd-Konto zu aktivieren.",
    button: "E-Mail-Adresse bestätigen",
    fallback: "Falls der Button nicht funktioniert, öffne diesen Link:",
    expiry: "Der Link ist 24 Stunden gültig.",
    ignore: "Du hast dich nicht bei Sedcarrd registriert? Dann kannst du diese E-Mail ignorieren.",
  },
  en: {
    subject: "Confirm your email address",
    greeting: (name: string) => `Hi ${name},`,
    intro: "please confirm your email address to activate your Sedcarrd account.",
    button: "Confirm email address",
    fallback: "If the button doesn't work, open this link:",
    expiry: "The link is valid for 24 hours.",
    ignore: "Didn't sign up for Sedcarrd? You can safely ignore this email.",
  },
};

/**
 * The locale of an account email, read from the link's `callbackURL` (verification and password
 * reset links both carry it)
 * (the client sends a locale-prefixed URL, e.g. ".../en/dashboard"; German has no prefix).
 */
export function localeFromVerificationUrl(url: string): Locale {
  try {
    const callback = new URL(url).searchParams.get("callbackURL") ?? "";
    const firstSegment = new URL(callback, "http://placeholder").pathname.split("/")[1];
    return routing.locales.find((locale) => locale === firstSegment) ?? routing.defaultLocale;
  } catch {
    return routing.defaultLocale;
  }
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`);
}

/** The texts of an account email with one action link. */
export type AuthEmailCopy = {
  subject: string;
  greeting: (name: string) => string;
  intro: string;
  button: string;
  fallback: string;
  expiry: string;
  ignore: string;
};

/** HTML + text of an account email with one action link (shared by verification and password reset). */
export function renderAuthEmail({
  to,
  name,
  url,
  locale,
  t,
}: {
  to: string;
  name: string;
  url: string;
  locale: Locale;
  t: AuthEmailCopy;
}): EmailMessage {
  const safeName = escapeHtml(name);
  const safeUrl = escapeHtml(url);

  const html = `<!doctype html>
<html lang="${locale}">
  <body style="margin:0;padding:24px;background:#f6f5f2;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1a1a1a;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:12px;">
      <tr>
        <td style="padding:32px;">
          <h1 style="margin:0 0 24px;font-size:22px;">${t.subject}</h1>
          <p style="margin:0 0 8px;font-size:16px;line-height:24px;">${t.greeting(safeName)}</p>
          <p style="margin:0 0 24px;font-size:16px;line-height:24px;">${t.intro}</p>
          <p style="margin:0 0 24px;">
            <a href="${safeUrl}" style="display:inline-block;padding:12px 20px;background:#1a1a1a;color:#ffffff;border-radius:8px;text-decoration:none;font-weight:600;">${t.button}</a>
          </p>
          <p style="margin:0 0 8px;font-size:14px;line-height:20px;color:#555555;">${t.fallback}</p>
          <p style="margin:0 0 24px;font-size:14px;line-height:20px;word-break:break-all;"><a href="${safeUrl}" style="color:#1a1a1a;">${safeUrl}</a></p>
          <p style="margin:0 0 8px;font-size:14px;line-height:20px;color:#555555;">${t.expiry}</p>
          <p style="margin:0;font-size:14px;line-height:20px;color:#555555;">${t.ignore}</p>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const text = [t.greeting(name), "", t.intro, "", `${t.button}: ${url}`, "", t.expiry, t.ignore].join("\n");

  return { to, subject: t.subject, html, text };
}

/** The "confirm your email" message sent after sign-up (and on sign-in while still unverified). */
export function verificationEmail({ to, name, url }: { to: string; name: string; url: string }): EmailMessage {
  const locale = localeFromVerificationUrl(url);
  return renderAuthEmail({ to, name, url, locale, t: copy[locale] });
}
