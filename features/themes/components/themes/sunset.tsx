import { cn } from "@/lib/utils";
import { type ThemeProps, themeVars } from "../../lib/types";
import { PhotoGallery } from "../photo-gallery";

/** Abendrot: white frame around a warm gradient panel; name on the left, Basisdaten cards on the right. */
export function SunsetTheme({ profile, Section }: ThemeProps) {
  return (
    <div
      className="min-h-svh bg-[#eceef2] bg-[linear-gradient(160deg,#f4f5f7,#dfe3ea)] px-4 pt-24 pb-16 font-sans sm:px-8"
      style={themeVars("#ffffff", "#b4497e")}
    >
      <article className="mx-auto max-w-6xl rounded-[2rem] bg-white p-2 shadow-xl shadow-black/10">
        <div className="grid gap-12 rounded-[1.6rem] bg-[linear-gradient(135deg,#f6a96b_0%,#e8707a_50%,#b4497e_100%)] px-6 py-14 text-white sm:px-12 lg:grid-cols-[1fr_1.2fr] lg:py-16">
          <header className="flex flex-col gap-8 lg:pt-6">
            <Section section="name" className="px-2 py-1">
              <h1
                className={cn(
                  "font-serif text-5xl leading-[1.05] font-semibold break-words drop-shadow-sm sm:text-6xl",
                  !profile.name && "text-white/50",
                )}
              >
                {profile.name || profile.placeholders.name}
              </h1>
            </Section>
            <Section section="about" className="flex flex-col gap-2 px-2 py-1">
              {profile.professions.length > 0 || profile.born ? (
                <>
                  {profile.professions.length > 0 ? (
                    <p className="text-lg font-medium">{profile.professions.join(", ")}</p>
                  ) : null}
                  {profile.born ? <p className="text-white/80">{profile.born}</p> : null}
                </>
              ) : (
                <p className="text-white/70">{profile.placeholders.about}</p>
              )}
            </Section>
            <span aria-hidden="true" className="ml-2 h-1 w-14 rounded-full bg-white/60" />
            <Section section="photos" className="p-1">
              <PhotoGallery
                images={profile.images}
                placeholder={profile.placeholders.photos}
                imageClassName="rounded-2xl border-4 border-white shadow-lg"
                emptyClassName="border-white/50 text-white/80"
                columns={2}
              />
            </Section>
          </header>

          <section className="flex flex-col gap-4">
            <h2 className="px-1 text-sm font-semibold tracking-[0.18em] text-white/85 uppercase">{profile.basicsTitle}</h2>
            {profile.groups.map((group) => (
              <Section key={group.key} section={group.key}>
                <div className="rounded-2xl bg-white/15 p-5 ring-1 ring-white/25 backdrop-blur-sm">
                  <h3 className="mb-3 font-serif text-xl font-semibold">{group.title}</h3>
                  <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
                    {group.rows.map((row) => (
                      <div key={row.label} className="flex flex-col">
                        <dt className="text-xs text-white/75">{row.label}</dt>
                        <dd className="break-words">{row.value || <span className="text-white/55">{profile.emptyValue}</span>}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </Section>
            ))}
          </section>
        </div>
      </article>
    </div>
  );
}
