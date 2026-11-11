import { expect, test } from "bun:test";
import { resetPasswordEmail } from "./reset-password-email";

const link = (callbackURL: string) =>
  `http://localhost:5173/api/auth/reset-password/abc?callbackURL=${encodeURIComponent(callbackURL)}`;

test("writes in the language of the page the link opens, with the link in HTML and text", () => {
  const de = resetPasswordEmail({ to: "a@b.de", name: "Ada", url: link("http://localhost:5173/reset-password") });
  expect(de.subject).toBe("Setze dein Passwort zurück");
  expect(de.text).toContain("Hallo Ada,");

  const url = link("http://localhost:5173/en/reset-password");
  const en = resetPasswordEmail({ to: "a@b.de", name: "Ada", url });
  expect(en.subject).toBe("Reset your password");
  expect(en.text).toContain(url);
  expect(en.html).toContain('lang="en"');
});
