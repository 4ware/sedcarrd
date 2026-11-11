import { dehydrate } from "@tanstack/react-query";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { HydrateQueries } from "@/components/providers/hydrate-queries";
import { publicPersonQueryOptions } from "@/features/people";
import { PublicProfile } from "@/features/public-profile";
import { serverApi } from "@/lib/api/server";
import { ApiError } from "@/lib/api/unwrap";
import { getQueryClient } from "@/lib/query/get-query-client";

type Props = { params: Promise<{ locale: string; slug: string }> };

/** Fetches the person once per request (metadata + page) into a fresh query client; null if unknown. */
const loadPerson = cache(async (slug: string) => {
  const queryClient = getQueryClient();
  try {
    const person = await queryClient.fetchQuery(publicPersonQueryOptions(serverApi, slug));
    return { queryClient, person };
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const loaded = await loadPerson(slug);
  if (!loaded) return {};
  const { person } = loaded;
  return {
    title: `${person.firstName} ${person.lastName} — Sedcarrd`,
    description: person.professions.join(", ") || undefined,
  };
}

/** Public page of a person (/people/<slug>, no login), rendered in the person's theme. */
export default async function PersonPage({ params }: Props) {
  const { slug } = await params;
  const loaded = await loadPerson(slug);
  if (!loaded) notFound();

  return (
    <HydrateQueries state={dehydrate(loaded.queryClient)}>
      <PublicProfile slug={slug} />
    </HydrateQueries>
  );
}
