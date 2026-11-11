"use client";

import { PlusIcon, UsersIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@/i18n/navigation";
import { usePeople } from "../api/use-people";
import { ageFromBirthYear } from "../lib/age";

/** Dashboard list of the signed-in user's people. */
export function PeopleList() {
  const t = useTranslations("People");
  const people = usePeople();

  return (
    <section aria-labelledby="people-title" className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="people-title" className="font-serif text-2xl font-semibold">
          {t("title")}
        </h2>
        <Button asChild size="sm">
          <Link href="/dashboard/people/new">
            <PlusIcon data-icon="inline-start" aria-hidden="true" />
            {t("create")}
          </Link>
        </Button>
      </div>

      {people.isPending ? (
        <div className="flex flex-col gap-2">
          <p role="status" className="sr-only">
            {t("loading")}
          </p>
          <Skeleton aria-hidden="true" className="h-16 w-full" />
          <Skeleton aria-hidden="true" className="h-16 w-full" />
        </div>
      ) : people.isError ? (
        <p role="alert" className="text-destructive">
          {t("error")}
        </p>
      ) : people.data.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed px-6 py-10 text-center">
          <UsersIcon className="size-6 text-muted-foreground" aria-hidden="true" />
          <p className="font-medium">{t("empty.title")}</p>
          <p className="text-sm text-muted-foreground">{t("empty.description")}</p>
        </div>
      ) : (
        <ul className="divide-y rounded-lg border bg-background">
          {people.data.map((person) => {
            const age = ageFromBirthYear(person.birthYear);
            const details = [
              age === null ? null : t("age", { age }),
              person.workingLocation,
            ].filter(Boolean);

            return (
              <li
                key={person.id}
                className="relative flex items-center gap-4 px-4 py-3 has-focus-visible:ring-2 has-focus-visible:ring-ring hover:bg-muted/50"
              >
                <PersonThumbnail url={person.thumbnailUrl} firstName={person.firstName} lastName={person.lastName} />
                <div className="flex min-w-0 flex-col gap-1">
                  <h3 className="font-medium">
                    {/* The stretched link makes the whole row open the person in the editor. */}
                    <Link
                      href={`/dashboard/editor/${person.id}`}
                      className="underline-offset-4 after:absolute after:inset-0 hover:underline focus-visible:outline-none"
                    >
                      {person.firstName} {person.lastName}
                    </Link>
                  </h3>
                  {person.professions.length > 0 ? (
                    <p className="text-sm">{person.professions.join(", ")}</p>
                  ) : null}
                  {details.length > 0 ? <p className="text-sm text-muted-foreground">{details.join(" · ")}</p> : null}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

/**
 * The person's first photo as a small square, or their initials. Decorative (alt=""): the name is
 * right next to it.
 */
function PersonThumbnail({ url, firstName, lastName }: { url: string | null; firstName: string; lastName: string }) {
  if (url) {
    return <img src={url} alt="" loading="lazy" className="size-14 shrink-0 rounded-md object-cover" />;
  }
  return (
    <span
      aria-hidden="true"
      data-testid="person-initials"
      className="flex size-14 shrink-0 items-center justify-center rounded-md bg-muted font-serif text-lg font-semibold text-muted-foreground"
    >
      {`${firstName.trim().charAt(0)}${lastName.trim().charAt(0)}`.toUpperCase()}
    </span>
  );
}
