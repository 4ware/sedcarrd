import { useTranslations } from "next-intl";
import { AuthCard } from "./auth-card";
import { AuthShell } from "./auth-shell";
import { AuthSwitchLink } from "./auth-switch-link";
import { LoginForm } from "./login-form";

export function LoginScreen() {
  const t = useTranslations("Auth.login");

  return (
    <AuthShell>
      <AuthCard
        title={t("title")}
        description={t("description")}
        footer={<AuthSwitchLink prompt={t("switchPrompt")} label={t("switchLink")} href="/signup" />}
      >
        <LoginForm />
      </AuthCard>
    </AuthShell>
  );
}
