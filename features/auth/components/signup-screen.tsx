import { AuthShell } from "./auth-shell";
import { SignupFlow } from "./signup-flow";

export function SignupScreen() {
  return (
    <AuthShell>
      <SignupFlow />
    </AuthShell>
  );
}
