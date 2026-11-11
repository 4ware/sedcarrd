import { useTranslations } from "next-intl";
import { BrandLogo } from "@/components/brand-logo";
import { Container } from "@/components/container";
import { navItems } from "../../lib/content";
import { HeaderActions } from "./header-actions";
import { MainNav } from "./main-nav";

export function SiteHeader({ isSignedIn = false }: { isSignedIn?: boolean }) {
  const t = useTranslations("LandingPage.header");
  const items = navItems.map(({ key, href }) => ({ label: t(`nav.${key}`), href }));

  return (
    <header className="border-b bg-secondary">
      <Container className="flex h-20 items-center justify-between gap-6 sm:h-24">
        <BrandLogo label={t("home")} />
        <MainNav items={items} label={t("navLabel")} />
        <HeaderActions isSignedIn={isSignedIn} />
      </Container>
    </header>
  );
}
