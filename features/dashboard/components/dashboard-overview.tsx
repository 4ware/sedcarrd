import { useTranslations } from "next-intl";
import { DashboardHeader } from "./dashboard-header";

export function DashboardOverview({ name }: { name: string }) {
  const t = useTranslations("Dashboard.overview");

  return (
    <>
      <DashboardHeader title={t("title")} />
      <div className="flex flex-col gap-2 p-6">
        <h2 className="font-serif text-3xl font-semibold">{t("greeting", { name })}</h2>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>
    </>
  );
}
