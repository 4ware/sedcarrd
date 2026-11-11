import { setRequestLocale } from "next-intl/server";
import { getSession } from "@/features/auth/server";
import { LandingPage } from "@/features/landing-page";
import type { Locale } from "@/i18n/routing";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const session = await getSession();

  return <LandingPage isSignedIn={!!session} />;
}
