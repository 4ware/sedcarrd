import { cn } from "@/lib/utils";
import { type ProfileView, type SectionSlot, type ThemeProps, themeVars } from "../../lib/types";
import { PhotoGallery } from "../photo-gallery";
import type { ThemePreset } from "./presets";

type BlockProps = { profile: ProfileView; Section: SectionSlot; preset: ThemePreset };

/** The name, in the preset's heading style. `onColor`: drawn on a coloured banner (placeholder dimmed by opacity). */
function NameBlock({ profile, Section, preset, className, onColor }: BlockProps & { className?: string; onColor?: boolean }) {
  return (
    <Section section="name" className={cn("px-2 py-1", className)}>
      <h1 className={cn("break-words", preset.heading, !profile.name && (onColor ? "opacity-50" : preset.faint))}>
        {profile.name || profile.placeholders.name}
      </h1>
    </Section>
  );
}

/** Professions (chips or a line) and the born line. */
function AboutBlock({
  profile,
  Section,
  preset,
  className,
  onColor,
  centered,
}: BlockProps & { className?: string; onColor?: boolean; centered?: boolean }) {
  const muted = onColor ? "opacity-80" : preset.muted;
  const hasContent = profile.professions.length > 0 || profile.born;

  return (
    <Section section="about" className={cn("flex flex-col gap-2 px-2 py-1", className)}>
      {hasContent ? (
        <>
          {profile.professions.length > 0 ? (
            preset.chip ? (
              <ul className={cn("flex flex-wrap gap-2", centered && "justify-center")}>
                {profile.professions.map((profession) => (
                  <li key={profession} className={preset.chip}>
                    {profession}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-lg font-medium">{profile.professions.join(", ")}</p>
            )
          ) : null}
          {profile.born ? <p className={muted}>{profile.born}</p> : null}
        </>
      ) : (
        <p className={onColor ? "opacity-60" : preset.faint}>{profile.placeholders.about}</p>
      )}
    </Section>
  );
}

/** One Basisdaten group (skills, location or appearance). */
function GroupBlock({
  profile,
  Section,
  preset,
  group,
}: BlockProps & { group: ProfileView["groups"][number] }) {
  return (
    <Section section={group.key} className="h-full">
      <div className={cn("h-full", preset.tile)}>
        {preset.bar ? <span aria-hidden="true" className={cn("mb-4 block h-1 w-10 rounded-full", preset.bar)} /> : null}
        <h3 className={cn("mb-3", preset.groupTitle)}>{group.title}</h3>
        <dl className={cn("grid text-sm", preset.rows === "inline" ? "gap-y-2" : "gap-y-3")}>
          {group.rows.map((row) =>
            preset.rows === "inline" ? (
              <div key={row.label} className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-3">
                <dt className={preset.tileMuted ?? preset.muted}>{row.label}</dt>
                <dd className="break-words">{row.value || <span className={preset.tileFaint ?? preset.faint}>{profile.emptyValue}</span>}</dd>
              </div>
            ) : (
              <div key={row.label}>
                <dt className={cn("text-xs", preset.tileMuted ?? preset.muted)}>{row.label}</dt>
                <dd className="break-words">{row.value || <span className={preset.tileFaint ?? preset.faint}>{profile.emptyValue}</span>}</dd>
              </div>
            ),
          )}
        </dl>
      </div>
    </Section>
  );
}

/** The photos, in the preset's colours. `onColor`: drawn on a coloured surface. */
function PhotosBlock({
  profile,
  Section,
  preset,
  columns,
  className,
}: BlockProps & { columns?: 2 | 3 | 4; className?: string }) {
  return (
    <Section section="photos" className={cn("p-1", className)}>
      <PhotoGallery
        images={profile.images}
        placeholder={profile.placeholders.photos}
        imageClassName={preset.photo ?? "rounded-lg"}
        emptyClassName={cn("border-current/25", preset.faint)}
        columns={columns}
      />
    </Section>
  );
}

function BasicsTitle({ profile, preset, className }: { profile: ProfileView; preset: ThemePreset; className?: string }) {
  return <h2 className={cn(preset.label, className)}>{profile.basicsTitle}</h2>;
}

/** Renders a preset theme with its shared layout. */
export function PresetTheme({ preset, profile, Section }: ThemeProps & { preset: ThemePreset }) {
  const blocks = { profile, Section, preset };
  const groups = profile.groups.map((group) => <GroupBlock key={group.key} {...blocks} group={group} />);

  return (
    <div
      className={cn("min-h-svh px-4 pt-24 pb-16 sm:px-8", preset.page)}
      style={themeVars(preset.accent, preset.onAccent)}
    >
      {preset.layout === "stack" ? (
        // Narrow centered card, everything stacked.
        <article className={cn("mx-auto max-w-lg", preset.card)}>
          <header className="flex flex-col items-center gap-5 px-6 pt-14 pb-10 text-center sm:px-10">
            <NameBlock {...blocks} />
            <AboutBlock {...blocks} className="items-center" centered />
          </header>
          <div className="px-5 pb-8 sm:px-8">
            <PhotosBlock {...blocks} columns={2} />
          </div>
          <section className="flex flex-col gap-4 border-t border-current/10 px-6 py-10 sm:px-10">
            <BasicsTitle profile={profile} preset={preset} className="mb-2 text-center" />
            {groups}
          </section>
        </article>
      ) : preset.layout === "hero" ? (
        // Full-bleed background, name large and low, groups in a row below.
        <article className="mx-auto flex min-h-[calc(100svh-10rem)] w-full max-w-6xl flex-col justify-end gap-14">
          <header className="flex flex-col gap-6">
            <NameBlock {...blocks} />
            <AboutBlock {...blocks} className="max-w-2xl" />
          </header>
          <PhotosBlock {...blocks} columns={4} />
          <section className="flex flex-col gap-5">
            <BasicsTitle profile={profile} preset={preset} className="px-2" />
            <div className="grid gap-4 md:grid-cols-3">{groups}</div>
          </section>
        </article>
      ) : preset.layout === "split" ? (
        // Wide card: name on the left, groups on a coloured panel on the right.
        <article className={cn("mx-auto grid max-w-6xl gap-3 p-3 lg:grid-cols-[1fr_1.25fr]", preset.card)}>
          <header className="flex flex-col justify-center gap-6 px-6 py-12 sm:px-10">
            <NameBlock {...blocks} />
            <AboutBlock {...blocks} />
            <PhotosBlock {...blocks} columns={2} className="mt-4" />
          </header>
          <section className={cn("flex flex-col gap-4 p-5 sm:p-8", preset.panel)}>
            <BasicsTitle profile={profile} preset={preset} className="px-1" />
            {groups}
          </section>
        </article>
      ) : preset.layout === "columns" ? (
        // Wide card: name top-left, groups in three columns with accent bars.
        <article className={cn("mx-auto flex max-w-6xl flex-col gap-16 px-6 py-14 sm:px-14", preset.card)}>
          <header className="flex flex-col gap-6">
            <NameBlock {...blocks} />
            <AboutBlock {...blocks} />
          </header>
          <PhotosBlock {...blocks} columns={4} />
          <section className="flex flex-col gap-8">
            <BasicsTitle profile={profile} preset={preset} className="px-2" />
            <div className="grid gap-10 md:grid-cols-3">{groups}</div>
          </section>
        </article>
      ) : (
        // banner: card with a coloured banner for name and professions, groups below.
        <article className={cn("mx-auto flex max-w-5xl flex-col gap-3 p-3", preset.card)}>
          <header className={cn("flex flex-col gap-5 px-6 py-14 sm:px-12", preset.banner)}>
            <NameBlock {...blocks} onColor />
            <AboutBlock {...blocks} onColor />
          </header>
          <div className="px-3 pt-6 sm:px-6">
            <PhotosBlock {...blocks} />
          </div>
          <section className="flex flex-col gap-5 px-3 pt-6 pb-4 sm:px-6">
            <BasicsTitle profile={profile} preset={preset} className="px-1" />
            <div className="grid gap-4 md:grid-cols-3">{groups}</div>
          </section>
        </article>
      )}
    </div>
  );
}
