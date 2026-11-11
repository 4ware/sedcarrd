import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Editor } from "@/features/editor";
import type { Locale } from "@/i18n/routing";

type Params = Promise<{ locale: string; personId: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale as Locale, namespace: "Editor" });
  return { title: t("metaTitle"), robots: { index: false } };
}

/** Full-screen editor (no dashboard sidebar) for one of the user's people. */
export default async function EditorPage({ params }: { params: Params }) {
  const { personId } = await params;
  return <Editor personId={personId} />;
}
