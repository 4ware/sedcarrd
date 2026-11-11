"use client";

import { useTranslations } from "next-intl";
import { type FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { Link } from "@/i18n/navigation";
import { useResetPassword } from "../api/use-reset-password";
import { AuthError } from "../lib/auth-error";
import { passwordsMatch } from "../lib/passwords-match";
import { AuthCard } from "./auth-card";
import { AuthSwitchLink } from "./auth-switch-link";
import { ConfirmPasswordField } from "./fields/confirm-password-field";
import { PasswordField } from "./fields/password-field";
import { FormError } from "./form-error";
import { SubmitButton } from "./submit-button";

type ResetPasswordFlowProps = {
  /** From the reset link (`?token=…`); null when missing or rejected (`?error=INVALID_TOKEN`). */
  token: string | null;
};

/** "Choose a new password" for the token from the emailed link; then points to the login. */
export function ResetPasswordFlow({ token }: ResetPasswordFlowProps) {
  const t = useTranslations("Auth");
  const reset = useResetPassword();
  const [mismatch, setMismatch] = useState(false);
  const footer = (
    <AuthSwitchLink prompt={t("resetPassword.switchPrompt")} label={t("resetPassword.switchLink")} href="/login" />
  );

  const errorKey = reset.error instanceof AuthError ? reset.error.key : reset.error ? "generic" : null;

  // No usable token: from the start, or the server rejected it (expired / already used).
  if (!token || errorKey === "invalidToken") {
    return (
      <AuthCard title={t("resetPassword.invalidTitle")} description={t("resetPassword.invalidDescription")} footer={footer}>
        <Button asChild size="cta" className="w-full">
          <Link href="/forgot-password">{t("resetPassword.requestNew")}</Link>
        </Button>
      </AuthCard>
    );
  }

  if (reset.isSuccess) {
    return (
      <AuthCard title={t("resetPassword.successTitle")} description={t("resetPassword.successDescription")}>
        <p role="status" className="sr-only">
          {t("resetPassword.successTitle")}
        </p>
        <Button asChild size="cta" className="w-full">
          <Link href="/login">{t("resetPassword.toLogin")}</Link>
        </Button>
      </AuthCard>
    );
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const newPassword = String(form.get("password"));

    if (!passwordsMatch(newPassword, String(form.get("passwordConfirm")))) {
      setMismatch(true);
      formElement.querySelector<HTMLInputElement>('[name="passwordConfirm"]')?.focus();
      return;
    }
    reset.mutate({ token: token as string, newPassword });
  }

  return (
    <AuthCard title={t("resetPassword.title")} description={t("resetPassword.description")} footer={footer}>
      <form
        onSubmit={handleSubmit}
        // The mismatch message disappears as soon as either password is edited.
        onInput={() => mismatch && setMismatch(false)}
        aria-label={t("resetPassword.title")}
      >
        <FieldGroup>
          <FormError message={errorKey ? t(`errors.${errorKey}`) : null} />
          <PasswordField variant="new" />
          <ConfirmPasswordField error={mismatch ? t("errors.passwordMismatch") : null} />
          <SubmitButton pending={reset.isPending}>{t("resetPassword.submit")}</SubmitButton>
        </FieldGroup>
      </form>
    </AuthCard>
  );
}
