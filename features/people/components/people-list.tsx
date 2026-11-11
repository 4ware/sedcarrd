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
        <div className="flex flex-col gap-2" aria-busy="true" aria-label={t("loading")}>
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
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
                className="relative flex flex-col gap-1 px-4 py-3 has-focus-visible:ring-2 has-focus-visible:ring-ring hover:bg-muted/50"
              >
                <p className="font-medium">
                  {/* The stretched link makes the whole row open the person in the editor. */}
                  <Link
                    href={`/dashboard/editor/${person.id}`}
                    className="underline-offset-4 after:absolute after:inset-0 hover:underline focus-visible:outline-none"
                  >
                    {person.firstName} {person.lastName}
                  </Link>
                </p>
                {person.professions.length > 0 ? (
                  <p className="text-sm">{person.professions.join(", ")}</p>
                ) : null}
                {details.length > 0 ? <p className="text-sm text-muted-foreground">{details.join(" · ")}</p> : null}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
