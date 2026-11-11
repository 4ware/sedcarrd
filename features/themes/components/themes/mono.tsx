import { cn } from "@/lib/utils";
import { type ThemeProps, themeVars } from "../../lib/types";
import { PhotoGallery } from "../photo-gallery";

const TILE_COLORS = ["bg-[#e07a5f] text-[#1d2433]", "bg-[#f2cc8f] text-[#1d2433]", "bg-[#81b29a] text-[#1d2433]"];

/** Mono: a monospace "window" card on a dotted ink background, Basisdaten as numbered tiles. */
export function MonoTheme({ profile, Section }: ThemeProps) {
  return (
    <div
      className="min-h-svh bg-[#1d2433] bg-[radial-gradient(#2c3650_1px,transparent_1px)] bg-size-[14px_14px] px-4 pt-24 pb-16 font-mono text-[#1d2433]"
      style={themeVars("#e07a5f", "#1d2433")}
    >
      <article className="mx-auto max-w-2xl overflow-hidden rounded-lg border border-[#f6efe2]/30 bg-[#f6efe2] shadow-2xl shadow-black/40">
        {/* Window title bar: decoration only, it repeats the name of the heading below. */}
        <div aria-hidden="true" className="flex items-center justify-between bg-[#2b3550] px-5 py-3 text-sm text-[#f6efe2]">
          <span className="truncate">{profile.name || profile.placeholders.name}</span>
          <span className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-[#e07a5f]" />
            <span className="size-2.5 rounded-full bg-[#f2cc8f]" />
            <span className="size-2.5 rounded-full bg-[#81b29a]" />
          </span>
        </div>

        <header className="flex flex-col gap-6 border-b border-[#1d2433]/15 px-6 pt-12 pb-10 sm:px-10">
          <Section section="name" className="px-2 py-1">
            <h1
              className={cn(
                "text-4xl leading-tight font-medium tracking-tight break-words sm:text-6xl",
                !profile.name && "text-[#1d2433]/35",
              )}
            >
              {profile.name || profile.placeholders.name}
            </h1>
          </Section>
          <Section section="about" className="flex flex-col gap-1 px-2 py-1 text-sm">
            {profile.professions.length > 0 || profile.born ? (
              <>
                {profile.professions.length > 0 ? <p>{profile.professions.join(" · ")}</p> : null}
                {profile.born ? <p className="text-[#1d2433]/60">{profile.born}</p> : null}
              </>
            ) : (
              <p className="text-[#1d2433]/45">{profile.placeholders.about}</p>
            )}
          </Section>
        </header>

        <div className="border-b border-[#1d2433]/15 px-6 py-8 sm:px-10">
          <Section section="photos" className="p-1">
            <PhotoGallery
              title={profile.photosTitle}
              images={profile.images}
              placeholder={profile.placeholders.photos}
              imageClassName="rounded-sm border border-[#1d2433]/20"
              emptyClassName="border-[#1d2433]/25 text-[#1d2433]/50"
              columns={2}
            />
          </Section>
        </div>

        <section className="flex flex-col gap-4 px-6 py-10 sm:px-10">
          <h2 className="text-xs tracking-[0.2em] text-[#1d2433]/60 uppercase">{profile.basicsTitle}</h2>
          {profile.groups.map((group, index) => (
            <Section key={group.key} section={group.key}>
              <div className={cn("rounded-md px-4 py-3", TILE_COLORS[index % TILE_COLORS.length])}>
                <h3 className="text-sm font-medium">
                  <span aria-hidden="true">{String(index + 1).padStart(2, "0")} / </span>
                  {group.title}
                </h3>
              </div>
              <dl className="grid gap-1.5 px-4 pt-3 pb-1 text-[0.8rem]">
                {group.rows.map((row) => (
                  <div key={row.label} className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-3">
                    <dt className="text-[#1d2433]/55">{row.label}</dt>
                    <dd className="break-words">{row.value || <span className="text-[#1d2433]/35">{profile.emptyValue}</span>}</dd>
                  </div>
                ))}
              </dl>
            </Section>
          ))}
        </section>
      </article>
    </div>
  );
}
