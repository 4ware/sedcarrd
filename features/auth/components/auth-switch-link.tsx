import { Link } from "@/i18n/navigation";

type AuthSwitchLinkProps = { prompt: string; label: string; href: "/login" | "/signup" };

/** "No account yet? Sign up" style link between the login and sign-up screens. */
export function AuthSwitchLink({ prompt, label, href }: AuthSwitchLinkProps) {
  return (
    <p className="text-sm text-muted-foreground">
      {prompt}{" "}
      <Link href={href} className="font-medium text-primary underline-offset-4 hover:underline">
        {label}
      </Link>
    </p>
  );
}
