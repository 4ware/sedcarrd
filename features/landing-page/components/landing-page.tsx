import { HeroSection } from "./hero/hero-section";
import { SiteHeader } from "./site-header/site-header";

export function LandingPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <HeroSection />
      </main>
    </>
  );
}
