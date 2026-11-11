"use client";

import { useTranslations } from "next-intl";
import { useState, type FormEvent } from "react";
import { FieldGroup } from "@/components/ui/field";
import { useSignUp } from "../api/use-sign-up";
import { AuthError } from "../lib/auth-error";
import { passwordsMatch } from "../lib/passwords-match";
import { ConfirmPasswordField } from "./fields/confirm-password-field";
import { EmailField } from "./fields/email-field";
import { NameField } from "./fields/name-field";
import { PasswordField } from "./fields/password-field";
import { FormError } from "./form-error";
import { SubmitButton } from "./submit-button";

/** Creates the account; `onSignedUp` receives the address the verification link was sent to. */
export function SignupForm({ onSignedUp }: { onSignedUp: (email: string) => void }) {
  const t = useTranslations("Auth");
  const signUp = useSignUp();
  const [mismatch, setMismatch] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const password = String(form.get("password"));

    if (!passwordsMatch(password, String(form.get("passwordConfirm")))) {
      setMismatch(true);
      formElement.querySelector<HTMLInputElement>('[name="passwordConfirm"]')?.focus();
      return;
    }

    const email = String(form.get("email")).trim();
    signUp.mutate(
      { name: String(form.get("name")).trim(), email, password },
      // No session yet: the user first confirms the address via the emailed link. A taken email
      // gets the same answer on purpose (Better Auth does not reveal existing accounts).
      { onSuccess: () => onSignedUp(email) },
    );
  }

  const errorKey = signUp.error instanceof AuthError ? signUp.error.key : signUp.error ? "generic" : null;

  return (
    <form
      onSubmit={handleSubmit}
      // The mismatch message disappears as soon as either password is edited.
      onInput={() => mismatch && setMismatch(false)}
      aria-label={t("signup.title")}
    >
      <FieldGroup>
        <FormError message={errorKey ? t(`errors.${errorKey}`) : null} />
        <NameField />
        <EmailField />
        <PasswordField variant="new" />
        <ConfirmPasswordField error={mismatch ? t("errors.passwordMismatch") : null} />
        <SubmitButton pending={signUp.isPending}>{t("signup.submit")}</SubmitButton>
      </FieldGroup>
    </form>
  );
}
