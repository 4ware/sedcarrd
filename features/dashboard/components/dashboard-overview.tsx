import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { DashboardHeader } from "./dashboard-header";

/** Greeting plus the page sections passed as children (e.g. the people list). */
export function DashboardOverview({ name, children }: { name: string; children?: ReactNode }) {
  const t = useTranslations("Dashboard.overview");

  return (
    <>
      <DashboardHeader title={t("title")} />
      <div className="flex flex-col gap-2 p-6">
        <h2 className="font-serif text-3xl font-semibold">{t("greeting", { name })}</h2>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>
      {children ? <div className="flex flex-col gap-8 px-6 pb-6">{children}</div> : null}
    </>
  );
}
