import { useTranslations } from "next-intl";
import { Container } from "@/components/container";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { headerCtaHref, navItems } from "../../lib/content";
import { BrandLogo } from "./brand-logo";
import { HeaderCta } from "./header-cta";
import { MainNav } from "./main-nav";

export function SiteHeader() {
  const t = useTranslations("LandingPage.header");
  const items = navItems.map(({ key, href }) => ({ label: t(`nav.${key}`), href }));

  return (
    <header className="border-b bg-secondary">
      <Container className="flex h-20 items-center justify-between gap-6 sm:h-24">
        <BrandLogo label={t("home")} />
        <MainNav items={items} />
        <div className="flex items-center gap-3">
          <LocaleSwitcher />
          <HeaderCta label={t("cta")} href={headerCtaHref} />
        </div>
      </Container>
    </header>
  );
}
