import type { ReactNode } from "react";
import { requireSession } from "@/features/auth/server";
import { DashboardShell } from "@/features/dashboard";
import type { Locale } from "@/i18n/routing";

type Props = { children: ReactNode; params: Promise<{ locale: string }> };

/** Dashboard pages with the sidebar. The session lookup is deduplicated with the parent layout. */
export default async function DashboardShellLayout({ children, params }: Props) {
  const { locale } = await params;
  const { user } = await requireSession(locale as Locale);

  return <DashboardShell user={{ name: user.name, email: user.email, image: user.image }}>{children}</DashboardShell>;
}
