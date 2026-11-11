import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ResetPasswordScreen } from "@/features/auth";
import type { Locale } from "@/i18n/routing";

type Props = {
  params: Promise<{ locale: string }>;
  /** Set by Better Auth's reset link: `token` when valid, `error=INVALID_TOKEN` when not. */
  searchParams: Promise<{ token?: string; error?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale as Locale, namespace: "Auth.resetPassword" });
  return { title: t("metaTitle"), robots: { index: false } };
}

export default async function ResetPasswordPage({ searchParams }: Props) {
  const { token, error } = await searchParams;
  return <ResetPasswordScreen token={!error && token ? token : null} />;
}
