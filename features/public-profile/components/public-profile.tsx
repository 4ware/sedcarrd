"use client";

import { useQuery } from "@tanstack/react-query";
import { createContext, type ReactNode, useContext } from "react";
import {
  type PersonImageView,
  type PersonInput,
  publicPersonQueryOptions,
  toPersonFieldsValues,
} from "@/features/people";
import { type ProfileSectionKey, type ProfileView, type ThemeKey, ThemedProfile, useProfileView } from "@/features/themes";
import { api } from "@/lib/api/client";

const HiddenSectionsContext = createContext<ReadonlySet<ProfileSectionKey>>(new Set());

/**
 * The public page's Section slot: a plain wrapper. Sections without content are left out, so
 * visitors never see the editor's placeholders ("Fotos hinzufügen", …).
 */
function PublicSection({ section, className, children }: { section: ProfileSectionKey; className?: string; children: ReactNode }) {
  const hidden = useContext(HiddenSectionsContext);
  if (hidden.has(section)) return null;
  return <div className={className}>{children}</div>;
}

/** Sections with nothing to show. The name is always there (required). */
function emptySections(profile: ProfileView): Set<ProfileSectionKey> {
  const empty = new Set<ProfileSectionKey>();
  if (profile.professions.length === 0 && !profile.born) empty.add("about");
  if (profile.images.length === 0) empty.add("photos");
  for (const group of profile.groups) {
    if (group.rows.every((row) => !row.value)) empty.add(group.key);
  }
  return empty;
}

/**
 * A person's public page in their theme. The data is fetched on the server (page prefetch) and
 * hydrated into TanStack Query, so it renders immediately and stays in sync with later refetches.
 */
export function PublicProfile({ slug }: { slug: string }) {
  const { data: person } = useQuery(publicPersonQueryOptions(api, slug));
  // Always present: the page prefetches it and renders notFound() for unknown slugs.
  if (!person) return null;
  return <PublicProfileView person={person} />;
}

/** What the page needs from the public person response. */
type PublicPerson = PersonInput & { theme: ThemeKey; images: PersonImageView[] };

/** Renders a loaded public person (exported for tests). */
export function PublicProfileView({ person }: { person: PublicPerson }) {
  const profile = useProfileView(toPersonFieldsValues(person), person.images);

  return (
    <HiddenSectionsContext.Provider value={emptySections(profile)}>
      <main>
        <ThemedProfile theme={person.theme} profile={profile} Section={PublicSection} />
      </main>
    </HiddenSectionsContext.Provider>
  );
}
