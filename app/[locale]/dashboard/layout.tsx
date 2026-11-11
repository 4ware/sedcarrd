import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import { requireSession } from "@/features/auth/server";
import type { Locale } from "@/i18n/routing";

type Props = { children: ReactNode; params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Omit<Props, "children">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale as Locale, namespace: "Dashboard" });
  return { title: t("metaTitle"), robots: { index: false } };
}

/**
 * Everything under /dashboard requires a session; anonymous visitors go to /login.
 * Pages with the sidebar live in the (shell) group; the editor is full screen.
 */
export default async function DashboardLayout({ children, params }: Props) {
  const { locale } = await params;
  await requireSession(locale as Locale);
  return children;
}
