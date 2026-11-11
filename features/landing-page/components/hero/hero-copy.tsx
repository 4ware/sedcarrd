import { hero } from "../../lib/content";
import { HeroActions } from "./hero-actions";
import { HeroEyebrow } from "./hero-eyebrow";
import { HeroHeadline } from "./hero-headline";
import { HeroLede } from "./hero-lede";
import { SocialProof } from "./social-proof";

/** Left column of the hero: everything textual. */
export function HeroCopy() {
  return (
    <div className="flex flex-col gap-10">
      <HeroEyebrow>{hero.eyebrow}</HeroEyebrow>
      <div className="flex flex-col gap-6">
        <HeroHeadline lines={hero.headline.lines} accent={hero.headline.accent} />
        <HeroLede>{hero.lede}</HeroLede>
      </div>
      <HeroActions primary={hero.primaryCta} secondary={hero.secondaryCta} />
      <SocialProof {...hero.socialProof} />
    </div>
  );
}
