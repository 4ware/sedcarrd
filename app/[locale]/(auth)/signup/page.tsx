import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { SignupScreen } from "@/features/auth";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale as Locale, namespace: "Auth.signup" });
  return { title: t("metaTitle"), robots: { index: false } };
}

export default function SignupPage() {
  return <SignupScreen />;
}
