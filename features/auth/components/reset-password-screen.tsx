import { AuthShell } from "./auth-shell";
import { ResetPasswordFlow } from "./reset-password-flow";

export function ResetPasswordScreen({ token }: { token: string | null }) {
  return (
    <AuthShell>
      <ResetPasswordFlow token={token} />
    </AuthShell>
  );
}
