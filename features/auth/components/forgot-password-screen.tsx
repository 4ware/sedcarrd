import { AuthShell } from "./auth-shell";
import { ForgotPasswordFlow } from "./forgot-password-flow";

export function ForgotPasswordScreen() {
  return (
    <AuthShell>
      <ForgotPasswordFlow />
    </AuthShell>
  );
}
