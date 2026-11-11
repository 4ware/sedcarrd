/** Name + email, truncated to fit the sidebar. */
export function UserSummary({ name, email }: { name: string; email: string }) {
  return (
    <span className="grid flex-1 text-left text-sm leading-tight">
      <span className="truncate font-medium">{name}</span>
      <span className="truncate text-xs text-muted-foreground">{email}</span>
    </span>
  );
}
