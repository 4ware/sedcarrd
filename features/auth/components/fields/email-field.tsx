import { useTranslations } from "next-intl";
import { TextField } from "./text-field";

export function EmailField() {
  const t = useTranslations("Auth.fields");
  return (
    <TextField
      name="email"
      type="email"
      label={t("email")}
      placeholder={t("emailPlaceholder")}
      autoComplete="email"
      required
    />
  );
}
