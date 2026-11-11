import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { BrandLogo } from "@/components/brand-logo";

/** Full-page frame for the auth screens: brand on top, content centered on the sand background. */
export function AuthShell({ children }: { children: ReactNode }) {
  const t = useTranslations("Auth");

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-10 bg-background px-4 py-12">
      <header>
        <BrandLogo label={t("backHome")} />
      </header>
      <main className="w-full max-w-md">{children}</main>
    </div>
  );
}
