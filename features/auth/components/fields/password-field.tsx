"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { PasswordVisibilityToggle } from "./password-visibility-toggle";
import { TextField } from "./text-field";

type PasswordFieldProps = {
  /**
   * - `current`: log-in password
   * - `new`: sign-up password, with the length hint
   * - `confirm`: sign-up "repeat password"
   */
  variant?: "current" | "new" | "confirm";
  error?: string | null;
};

const MIN_LENGTH = 8;
const MAX_LENGTH = 128;

/** Password input with a show/hide toggle; each field toggles independently. */
export function PasswordField({ variant = "current", error }: PasswordFieldProps) {
  const t = useTranslations("Auth.fields");
  const [visible, setVisible] = useState(false);

  const isConfirm = variant === "confirm";
  const name = isConfirm ? "passwordConfirm" : "password";
  const id = `field-${name}`;

  return (
    <TextField
      id={id}
      name={name}
      type={visible ? "text" : "password"}
      label={isConfirm ? t("passwordConfirm") : t("password")}
      description={variant === "new" ? t("passwordHint") : undefined}
      error={error}
      autoComplete={variant === "current" ? "current-password" : "new-password"}
      // Keep the browser from capitalising or "correcting" a password shown as plain text.
      autoCapitalize="none"
      autoCorrect="off"
      spellCheck={false}
      required
      minLength={variant === "current" ? undefined : MIN_LENGTH}
      maxLength={MAX_LENGTH}
      endAdornment={
        <PasswordVisibilityToggle visible={visible} onToggle={() => setVisible((v) => !v)} controls={id} />
      }
    />
  );
}
