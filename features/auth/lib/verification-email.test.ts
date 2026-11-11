import { describe, expect, test } from "bun:test";
import type { Locale } from "@/i18n/routing";
import { localeFromVerificationUrl, verificationEmail } from "./verification-email";

const link = (callbackURL: string) =>
  `http://localhost:5173/api/auth/verify-email?token=abc.def&callbackURL=${encodeURIComponent(callbackURL)}`;

describe("localeFromVerificationUrl", () => {
  test.each([
    [link("http://localhost:5173/en/dashboard"), "en"],
    [link("http://localhost:5173/dashboard"), "de"],
    [link("/en/dashboard"), "en"],
    [link("http://localhost:5173/english/dashboard"), "de"],
    ["http://localhost:5173/api/auth/verify-email?token=abc", "de"],
    ["not a url", "de"],
  ] satisfies [string, Locale][])("%s → %s", (url, locale) => {
    expect(localeFromVerificationUrl(url)).toBe(locale);
  });
});

describe("verificationEmail", () => {
  test("writes to the user in their sign-up language with the link in HTML and text", () => {
    const url = link("http://localhost:5173/en/dashboard");
    const message = verificationEmail({ to: "mara@example.com", name: "Mara", url });

    expect(message.to).toBe("mara@example.com");
    expect(message.subject).toBe("Confirm your email address");
    expect(message.text).toContain("Hi Mara,");
    expect(message.text).toContain(url);
    expect(message.html).toContain('lang="en"');
    expect(message.html).toContain(`href="${url.replaceAll("&", "&#38;")}"`);
  });

  test("defaults to German", () => {
    const message = verificationEmail({ to: "a@b.de", name: "Ada", url: link("http://localhost:5173/dashboard") });
    expect(message.subject).toBe("Bestätige deine E-Mail-Adresse");
    expect(message.text).toContain("Hallo Ada,");
  });

  test("escapes the user's name in HTML", () => {
    const message = verificationEmail({ to: "x@y.z", name: '<img src=x onerror="alert(1)">', url: link("/dashboard") });
    expect(message.html).not.toContain("<img");
    expect(message.html).toContain("&#60;img");
  });
});
