import type { ReactNode } from "react";
import { redirectIfAuthenticated } from "@/features/auth/server";
import type { Locale } from "@/i18n/routing";

/** Login and sign-up are only for anonymous visitors. */
export default async function AuthLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  await redirectIfAuthenticated(locale as Locale);
  return children;
}
