import { HeroSection } from "./hero/hero-section";
import { SiteHeader } from "./site-header/site-header";

/** `isSignedIn` swaps the header's log-in/sign-up links for a dashboard link. */
export function LandingPage({ isSignedIn = false }: { isSignedIn?: boolean }) {
  return (
    <>
      <SiteHeader isSignedIn={isSignedIn} />
      <main>
        <HeroSection />
      </main>
    </>
  );
}
