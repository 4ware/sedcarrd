import { Eye as EyeIcon, EyeOff as EyeOffIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

type PasswordVisibilityToggleProps = {
  /** Whether the password is currently shown as plain text. */
  visible: boolean;
  onToggle: () => void;
  /** id of the input it controls. */
  controls: string;
};

/** Eye button inside a password input that switches between hidden and plain-text display. */
export function PasswordVisibilityToggle({ visible, onToggle, controls }: PasswordVisibilityToggleProps) {
  const t = useTranslations("Auth.fields");

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="size-9 text-muted-foreground hover:text-foreground"
      aria-label={visible ? t("hidePassword") : t("showPassword")}
      aria-pressed={visible}
      aria-controls={controls}
      onClick={onToggle}
    >
      {visible ? <EyeOffIcon aria-hidden="true" /> : <EyeIcon aria-hidden="true" />}
    </Button>
  );
}
