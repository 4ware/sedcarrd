import { cn } from "@/lib/utils";
import { type ThemeProps, themeVars } from "../../lib/types";
import { PhotoGallery } from "../photo-gallery";

/** Klassisch: paper card on a muted page, serif name, Basisdaten in three columns. */
export function ClassicTheme({ profile, Section }: ThemeProps) {
  return (
    <div
      className="min-h-svh bg-muted px-4 pt-24 pb-16 text-foreground sm:px-8"
      style={themeVars("var(--primary)", "var(--primary-foreground)")}
    >
      <article className="mx-auto flex max-w-5xl flex-col gap-16 rounded-xl bg-background px-6 py-16 shadow-sm sm:px-16">
        <header className="flex flex-col items-center gap-10 text-center">
          <Section section="name" className="max-w-full px-4 py-2">
            <h1
              className={cn(
                "font-serif text-5xl leading-tight font-semibold break-words sm:text-7xl",
                !profile.name && "text-muted-foreground/60",
              )}
            >
              {profile.name || profile.placeholders.name}
            </h1>
          </Section>
          <Section section="about" className="flex min-w-64 flex-col gap-1 px-4 py-2">
            {profile.professions.length > 0 || profile.born ? (
              <>
                {profile.professions.length > 0 ? (
                  <p className="text-lg font-medium">{profile.professions.join(", ")}</p>
                ) : null}
                {profile.born ? <p className="text-muted-foreground">{profile.born}</p> : null}
              </>
            ) : (
              <p className="text-muted-foreground/70">{profile.placeholders.about}</p>
            )}
          </Section>
        </header>

        <Section section="photos" className="p-2">
          <PhotoGallery
            images={profile.images}
            placeholder={profile.placeholders.photos}
            imageClassName="rounded-md"
            emptyClassName="border-border text-muted-foreground"
          />
        </Section>

        <section className="flex flex-col gap-8">
          <h2 className="font-serif text-2xl font-semibold">{profile.basicsTitle}</h2>
          <div className="grid gap-10 md:grid-cols-3">
            {profile.groups.map((group) => (
              <Section key={group.key} section={group.key} className="p-2">
                <h3 className="mb-3 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                  {group.title}
                </h3>
                <dl className="grid gap-y-2 text-sm">
                  {group.rows.map((row) => (
                    <div key={row.label} className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-3">
                      <dt className="text-muted-foreground">{row.label}</dt>
                      <dd className="break-words">
                        {row.value || <span className="text-muted-foreground/60">{profile.emptyValue}</span>}
                      </dd>
                    </div>
                  ))}
                </dl>
              </Section>
            ))}
          </div>
        </section>
      </article>
    </div>
  );
}
