import { useTranslations } from "next-intl";
import { TextField } from "./text-field";

export function NameField() {
  const t = useTranslations("Auth.fields");
  return (
    <TextField name="name" label={t("name")} placeholder={t("namePlaceholder")} autoComplete="name" required maxLength={100} />
  );
}
