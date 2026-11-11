import { useTranslations } from "next-intl";
import { TextField } from "./text-field";

/** Password input; `isNew` switches autocomplete and shows the length hint for sign-up. */
export function PasswordField({ isNew = false }: { isNew?: boolean }) {
  const t = useTranslations("Auth.fields");
  return (
    <TextField
      name="password"
      type="password"
      label={t("password")}
      description={isNew ? t("passwordHint") : undefined}
      autoComplete={isNew ? "new-password" : "current-password"}
      required
      minLength={isNew ? 8 : undefined}
      maxLength={128}
    />
  );
}
