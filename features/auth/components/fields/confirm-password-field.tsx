import { PasswordField } from "./password-field";

/** "Repeat password" on sign-up. */
export function ConfirmPasswordField({ error }: { error?: string | null }) {
  return <PasswordField variant="confirm" error={error} />;
}
