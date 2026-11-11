"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { AuthCard } from "./auth-card";
import { AuthSwitchLink } from "./auth-switch-link";
import { CheckEmailNotice } from "./check-email-notice";
import { SignupForm } from "./signup-form";

/** The sign-up card: the form first, then "check your inbox" once the account exists. */
export function SignupFlow() {
  const t = useTranslations("Auth");
  const [sentTo, setSentTo] = useState<string | null>(null);

  if (sentTo) {
    return (
      <AuthCard
        title={t("checkEmail.title")}
        description={t("checkEmail.description")}
        footer={<AuthSwitchLink prompt={t("checkEmail.switchPrompt")} label={t("checkEmail.switchLink")} href="/login" />}
      >
        <CheckEmailNotice email={sentTo} />
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title={t("signup.title")}
      description={t("signup.description")}
      footer={<AuthSwitchLink prompt={t("signup.switchPrompt")} label={t("signup.switchLink")} href="/login" />}
    >
      <SignupForm onSignedUp={setSentTo} />
    </AuthCard>
  );
}
