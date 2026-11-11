import { useId } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { SampleProfile } from "../../lib/content";
import { AvailabilityBadge } from "./availability-badge";
import { ProfileLinkButton } from "./profile-link-button";
import { ProfileLinks } from "./profile-links";
import { ProfileMeta } from "./profile-meta";
import { ProfileName } from "./profile-name";
import { ProfilePhoto } from "./profile-photo";
import { ProfileQuote } from "./profile-quote";

/** A sample Sedcarrd profile page, styled like a printed card. */
export function ProfileCard({ profile, className }: { profile: SampleProfile; className?: string }) {
  const t = useTranslations("LandingPage.profile");
  const nameId = useId();

  return (
    // A real <article> (a self-contained profile), named by the person's heading.
    <article aria-labelledby={nameId} className={className}>
      <Card className="gap-0 p-3 shadow-2xl shadow-black/25 ring-0 sm:p-5">
      <ProfilePhoto photo={profile.photo}>
        <div className="absolute right-4 top-4">
          <AvailabilityBadge>{t("availability")}</AvailabilityBadge>
        </div>
        <div className="absolute inset-x-4 bottom-5 flex flex-col gap-2 sm:inset-x-6 sm:bottom-7">
          <ProfileMeta role={t("role")} locations={profile.locations} />
          <ProfileName id={nameId}>{profile.name}</ProfileName>
        </div>
      </ProfilePhoto>
      <CardContent className="flex flex-col gap-5 px-2 pt-6 sm:px-4">
        <ProfileQuote>{t("quote")}</ProfileQuote>
        <Separator className="bg-coral/50" />
      </CardContent>
      <CardFooter className="justify-between gap-4 border-t-0 bg-transparent px-2 pt-5 pb-0 sm:px-4">
        <ProfileLinks links={profile.links.map((key) => t(`links.${key}`))} />
        <ProfileLinkButton href={`/${profile.slug}`} label={t("open", { name: profile.name })} />
      </CardFooter>
      </Card>
    </article>
  );
}
