import { useTranslations } from "next-intl";
import { heroLinks, socialProofPeople } from "../../lib/content";
import { HeroActions } from "./hero-actions";
import { HeroEyebrow } from "./hero-eyebrow";
import { HeroHeadline } from "./hero-headline";
import { HeroLede } from "./hero-lede";
import { SocialProof } from "./social-proof";

/** Left column of the hero: everything textual. */
export function HeroCopy() {
  const t = useTranslations("LandingPage.hero");

  return (
    <div className="flex flex-col gap-10">
      <HeroEyebrow>{t("eyebrow")}</HeroEyebrow>
      <div className="flex flex-col gap-6">
        <HeroHeadline lines={[t("headline.line1"), t("headline.line2")]} accent={t("headline.accent")} />
        <HeroLede>{t("lede")}</HeroLede>
      </div>
      <HeroActions
        primary={{ label: t("primaryCta"), href: heroLinks.primary }}
        secondary={{ label: t("secondaryCta"), href: heroLinks.secondary }}
      />
      <SocialProof text={t("socialProof")} people={socialProofPeople} />
    </div>
  );
}
