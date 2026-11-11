"use client";

import { useTranslations } from "next-intl";
import { type FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { useRequestPasswordReset } from "../api/use-request-password-reset";
import { AuthError } from "../lib/auth-error";
import { AuthCard } from "./auth-card";
import { AuthSwitchLink } from "./auth-switch-link";
import { EmailField } from "./fields/email-field";
import { FormError } from "./form-error";
import { SubmitButton } from "./submit-button";

/**
 * "Forgot password": asks for the email, then says a link is on its way. The answer is the same
 * whether or not an account exists, so the form can't be used to probe for accounts.
 */
export function ForgotPasswordFlow() {
  const t = useTranslations("Auth");
  const request = useRequestPasswordReset();
  const [sentTo, setSentTo] = useState<string | null>(null);
  const footer = (
    <AuthSwitchLink prompt={t("forgotPassword.switchPrompt")} label={t("forgotPassword.switchLink")} href="/login" />
  );

  if (sentTo) {
    return (
      <AuthCard title={t("forgotPassword.sentTitle")} description={t("forgotPassword.sentHint")} footer={footer}>
        <div className="flex flex-col gap-4">
          <p role="status" className="text-base">
            {t.rich("forgotPassword.sentDescription", {
              email: sentTo,
              strong: (chunks) => <strong className="break-all">{chunks}</strong>,
            })}
          </p>
          <Button
            type="button"
            variant="outline"
            size="cta"
            className="w-full"
            onClick={() => {
              request.reset();
              setSentTo(null);
            }}
          >
            {t("forgotPassword.tryAgain")}
          </Button>
        </div>
      </AuthCard>
    );
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = String(new FormData(event.currentTarget).get("email")).trim();
    request.mutate(email, { onSuccess: () => setSentTo(email) });
  }

  const errorKey = request.error instanceof AuthError ? request.error.key : request.error ? "generic" : null;

  return (
    <AuthCard title={t("forgotPassword.title")} description={t("forgotPassword.description")} footer={footer}>
      <form onSubmit={handleSubmit} aria-label={t("forgotPassword.title")}>
        <FieldGroup>
          <FormError message={errorKey ? t(`errors.${errorKey}`) : null} />
          <EmailField />
          <SubmitButton pending={request.isPending}>{t("forgotPassword.submit")}</SubmitButton>
        </FieldGroup>
      </form>
    </AuthCard>
  );
}
