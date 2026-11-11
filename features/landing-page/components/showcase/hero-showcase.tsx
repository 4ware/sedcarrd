import { sampleProfile, showcaseNotes } from "../../lib/content";
import { profileUrl } from "../../lib/profile-url";
import { ProfileCard } from "../profile-card/profile-card";
import { ArchBackdrop } from "./arch-backdrop";
import { CircleStamp } from "./circle-stamp";
import { LinkNote } from "./link-note";
import { TapeLabel } from "./tape-label";

/** Right column of the hero: a collage of the sample profile card and paper notes. */
export function HeroShowcase() {
  return (
    <div className="relative mx-auto w-full max-w-[640px] pb-20 pt-4 sm:pb-12">
      <ArchBackdrop className="absolute bottom-24 left-[9%] right-[3%] top-0" />
      <ProfileCard profile={sampleProfile} className="relative ml-[18%] mt-8 w-[78%] rotate-2" />
      <TapeLabel className="absolute left-[10%] top-[14%] -rotate-[4deg]">{showcaseNotes.tape}</TapeLabel>
      <CircleStamp {...showcaseNotes.stamp} className="absolute -right-2 top-4 -rotate-12" />
      <LinkNote
        label={showcaseNotes.linkNote.label}
        url={profileUrl(showcaseNotes.linkNote.domain, sampleProfile.slug)}
        className="absolute bottom-0 left-0 -rotate-2 sm:bottom-[14%]"
      />
    </div>
  );
}
