import { useTranslations } from "next-intl";
import { AuthCard } from "./auth-card";
import { AuthShell } from "./auth-shell";
import { AuthSwitchLink } from "./auth-switch-link";
import { SignupForm } from "./signup-form";

export function SignupScreen() {
  const t = useTranslations("Auth.signup");

  return (
    <AuthShell>
      <AuthCard
        title={t("title")}
        description={t("description")}
        footer={<AuthSwitchLink prompt={t("switchPrompt")} label={t("switchLink")} href="/login" />}
      >
        <SignupForm />
      </AuthCard>
    </AuthShell>
  );
}
