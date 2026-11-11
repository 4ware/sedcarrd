"use client";

import { useTranslations } from "next-intl";
import type { FormEvent } from "react";
import { FieldGroup } from "@/components/ui/field";
import { useRouter } from "@/i18n/navigation";
import { useSignIn } from "../api/use-sign-in";
import { AuthError } from "../lib/auth-error";
import { EmailField } from "./fields/email-field";
import { PasswordField } from "./fields/password-field";
import { FormError } from "./form-error";
import { SubmitButton } from "./submit-button";

export function LoginForm() {
  const t = useTranslations("Auth");
  const router = useRouter();
  const signIn = useSignIn();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    signIn.mutate(
      { email: String(form.get("email")), password: String(form.get("password")) },
      {
        onSuccess: () => {
          router.replace("/dashboard");
          router.refresh();
        },
      },
    );
  }

  const errorKey = signIn.error instanceof AuthError ? signIn.error.key : signIn.error ? "generic" : null;

  return (
    <form onSubmit={handleSubmit} aria-label={t("login.title")}>
      <FieldGroup>
        <FormError message={errorKey ? t(`errors.${errorKey}`) : null} />
        <EmailField />
        <PasswordField />
        <SubmitButton pending={signIn.isPending}>{t("login.submit")}</SubmitButton>
      </FieldGroup>
    </form>
  );
}
