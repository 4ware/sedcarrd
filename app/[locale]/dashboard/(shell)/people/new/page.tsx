import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { DashboardHeader } from "@/features/dashboard";
import { CreatePersonForm } from "@/features/people";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale as Locale, namespace: "People.form" });
  return { title: t("metaTitle"), robots: { index: false } };
}

export default function NewPersonPage() {
  const t = useTranslations("People.form");

  return (
    <>
      <DashboardHeader title={t("title")} />
      <div className="p-6">
        <CreatePersonForm />
      </div>
    </>
  );
}
