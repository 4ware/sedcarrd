import { cn } from "@/lib/utils";
import { type ThemeProps, themeVars } from "../../lib/types";
import { PhotoGallery } from "../photo-gallery";

/** Nacht: full-bleed dark gradient, bold sans name, profession chips and frosted tiles. */
export function MidnightTheme({ profile, Section }: ThemeProps) {
  return (
    <div
      className="min-h-svh bg-[#0b1020] bg-[radial-gradient(ellipse_at_top,#25335e_0%,#0b1020_60%)] px-4 pt-28 pb-20 font-sans text-white sm:px-8"
      style={themeVars("#8ab4ff", "#0b1020")}
    >
      <article className="mx-auto flex max-w-4xl flex-col gap-14">
        <header className="flex flex-col gap-6">
          <Section section="name" className="px-2 py-1">
            <h1
              className={cn(
                "text-5xl leading-[1.05] font-semibold tracking-tight break-words sm:text-7xl",
                !profile.name && "text-white/30",
              )}
            >
              {profile.name || profile.placeholders.name}
            </h1>
          </Section>
          <Section section="about" className="flex flex-col gap-3 px-2 py-1">
            {profile.professions.length > 0 || profile.born ? (
              <>
                {profile.professions.length > 0 ? (
                  <ul className="flex flex-wrap gap-2">
                    {profile.professions.map((profession) => (
                      <li key={profession} className="rounded-full bg-white/10 px-3 py-1 text-sm">
                        {profession}
                      </li>
                    ))}
                  </ul>
                ) : null}
                {profile.born ? <p className="text-white/60">{profile.born}</p> : null}
              </>
            ) : (
              <p className="text-white/40">{profile.placeholders.about}</p>
            )}
          </Section>
        </header>

        <Section section="photos" className="p-1">
          <PhotoGallery
            title={profile.photosTitle}
            images={profile.images}
            placeholder={profile.placeholders.photos}
            imageClassName="rounded-2xl ring-1 ring-white/10"
            emptyClassName="border-white/20 text-white/50"
          />
        </Section>

        <section className="flex flex-col gap-6">
          <h2 className="text-sm font-medium tracking-[0.2em] text-[#8ab4ff] uppercase">{profile.basicsTitle}</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {profile.groups.map((group) => (
              <Section key={group.key} section={group.key}>
                <div className="h-full rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur">
                  <h3 className="mb-4 text-base font-semibold">{group.title}</h3>
                  <dl className="grid gap-3 text-sm">
                    {group.rows.map((row) => (
                      <div key={row.label}>
                        <dt className="text-xs text-white/50">{row.label}</dt>
                        <dd className="break-words">{row.value || <span className="text-white/30">{profile.emptyValue}</span>}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </Section>
            ))}
          </div>
        </section>
      </article>
    </div>
  );
}
