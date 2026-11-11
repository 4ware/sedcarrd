import { Container } from "@/components/container";
import { headerCta, navItems } from "../../lib/content";
import { BrandLogo } from "./brand-logo";
import { HeaderCta } from "./header-cta";
import { MainNav } from "./main-nav";

export function SiteHeader() {
  return (
    <header className="border-b bg-secondary">
      <Container className="flex h-20 items-center justify-between gap-6 sm:h-24">
        <BrandLogo />
        <MainNav items={navItems} />
        <HeaderCta {...headerCta} />
      </Container>
    </header>
  );
}
