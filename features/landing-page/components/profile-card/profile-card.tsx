import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
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
  return (
    <Card
      role="article"
      className={cn("gap-0 p-3 shadow-2xl shadow-black/25 ring-0 sm:p-5", className)}
    >
      <ProfilePhoto photo={profile.photo}>
        <div className="absolute right-4 top-4">
          <AvailabilityBadge>{profile.availability}</AvailabilityBadge>
        </div>
        <div className="absolute inset-x-4 bottom-5 flex flex-col gap-2 sm:inset-x-6 sm:bottom-7">
          <ProfileMeta role={profile.role} locations={profile.locations} />
          <ProfileName>{profile.name}</ProfileName>
        </div>
      </ProfilePhoto>
      <CardContent className="flex flex-col gap-5 px-2 pt-6 sm:px-4">
        <ProfileQuote>{profile.quote}</ProfileQuote>
        <Separator className="bg-coral/50" />
      </CardContent>
      <CardFooter className="justify-between gap-4 border-t-0 bg-transparent px-2 pt-5 pb-0 sm:px-4">
        <ProfileLinks links={profile.links} />
        <ProfileLinkButton href={`/${profile.slug}`} label={`Open ${profile.name}'s page`} />
      </CardFooter>
    </Card>
  );
}
