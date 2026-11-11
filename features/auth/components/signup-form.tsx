"use client";

import { useTranslations } from "next-intl";
import type { FormEvent } from "react";
import { FieldGroup } from "@/components/ui/field";
import { useRouter } from "@/i18n/navigation";
import { useSignUp } from "../api/use-sign-up";
import { AuthError } from "../lib/auth-error";
import { EmailField } from "./fields/email-field";
import { NameField } from "./fields/name-field";
import { PasswordField } from "./fields/password-field";
import { FormError } from "./form-error";
import { SubmitButton } from "./submit-button";

export function SignupForm() {
  const t = useTranslations("Auth");
  const router = useRouter();
  const signUp = useSignUp();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    signUp.mutate(
      {
        name: String(form.get("name")).trim(),
        email: String(form.get("email")).trim(),
        password: String(form.get("password")),
      },
      {
        // Better Auth signs the new user in right away (autoSignIn).
        onSuccess: () => {
          router.replace("/dashboard");
          router.refresh();
        },
      },
    );
  }

  const errorKey = signUp.error instanceof AuthError ? signUp.error.key : signUp.error ? "generic" : null;

  return (
    <form onSubmit={handleSubmit} aria-label={t("signup.title")}>
      <FieldGroup>
        <FormError message={errorKey ? t(`errors.${errorKey}`) : null} />
        <NameField />
        <EmailField />
        <PasswordField isNew />
        <SubmitButton pending={signUp.isPending}>{t("signup.submit")}</SubmitButton>
      </FieldGroup>
    </form>
  );
}
