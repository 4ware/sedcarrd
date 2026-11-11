import type { PresetThemeKey } from "../../registry";

export type PresetLayout = "stack" | "hero" | "split" | "columns" | "banner";

/**
 * A theme as configuration for one of the shared layouts (./preset-theme.tsx).
 * All values are complete Tailwind class strings, so Tailwind finds them when scanning the source.
 */
export type ThemePreset = {
  layout: PresetLayout;
  /** Outline/tag colour of editable blocks (hex), and the text colour on it. */
  accent: string;
  onAccent: string;
  /** Page background, base text colour and body font. */
  page: string;
  /** The main surface (all layouts except hero). */
  card: string;
  /** Name heading: font, size, weight, case. */
  heading: string;
  /** Secondary text (born line, labels). */
  muted: string;
  /** Placeholders and empty values. */
  faint: string;
  /** The small "Basisdaten" title. */
  label: string;
  /** One Basisdaten group. */
  tile: string;
  groupTitle: string;
  /** Label / empty-value colours inside a group tile, when the tile sits on a different surface. */
  tileMuted?: string;
  tileFaint?: string;
  /** Labels left of values, or above them. */
  rows: "inline" | "stacked";
  /** Professions as chips with these classes; otherwise a comma-separated line. */
  chip?: string;
  /** split: the panel holding the Basisdaten. */
  panel?: string;
  /** banner: the coloured block holding name and professions. */
  banner?: string;
  /** columns: short accent bar above each group title. */
  bar?: string;
  /** Photo corners/frame; default "rounded-lg". */
  photo?: string;
  /** Miniature in the theme picker: page and card backgrounds, text colour, font. */
  swatch: { page: string; card: string; text: string; font: string };
};

export const PRESETS: Record<PresetThemeKey, ThemePreset> = {
  // ── stack ─────────────────────────────────────────────────────────────────────
  paper: {
    layout: "stack",
    accent: "#2f3e46",
    onAccent: "#fbf8f1",
    page: "bg-[#efe9dd] text-[#2f3e46] font-sans",
    card: "rounded-sm bg-[#fbf8f1] shadow-[0_1px_0_#d8cfbd,0_20px_40px_-20px_rgba(47,62,70,0.35)]",
    heading: "font-serif text-5xl font-semibold leading-tight",
    muted: "text-[#2f3e46]/65",
    faint: "text-[#2f3e46]/35",
    label: "font-serif text-sm italic text-[#2f3e46]/60",
    tile: "border-t border-[#2f3e46]/15 pt-4",
    groupTitle: "font-serif text-lg font-semibold",
    rows: "inline",
    photo: "rounded-sm shadow-md",
    swatch: { page: "bg-[#efe9dd]", card: "bg-[#fbf8f1]", text: "text-[#2f3e46]", font: "font-serif" },
  },
  ink: {
    layout: "stack",
    accent: "#5eead4",
    onAccent: "#0f1113",
    page: "bg-[#0f1113] text-[#e7e9ea] font-sans",
    card: "rounded-2xl border border-white/10 bg-[#181b1f] shadow-2xl shadow-black/50",
    heading: "font-sans text-4xl font-semibold tracking-tight",
    muted: "text-white/60",
    faint: "text-white/30",
    label: "text-xs font-medium uppercase tracking-[0.2em] text-[#5eead4]",
    tile: "rounded-xl bg-white/[0.04] p-4",
    groupTitle: "text-sm font-semibold",
    rows: "inline",
    chip: "rounded-full border border-[#5eead4]/40 px-3 py-0.5 text-sm text-[#5eead4]",
    swatch: { page: "bg-[#0f1113]", card: "bg-[#181b1f]", text: "text-[#e7e9ea]", font: "font-sans" },
  },
  lavender: {
    layout: "stack",
    accent: "#a5b4fc",
    onAccent: "#1e1b4b",
    page: "bg-[radial-gradient(circle_at_30%_0%,#4c3a8a_0%,#1e1b4b_55%,#120f2e_100%)] text-white font-sans",
    card: "rounded-3xl bg-white/[0.07] ring-1 ring-white/15 backdrop-blur",
    heading: "font-sans text-4xl font-semibold",
    muted: "text-white/65",
    faint: "text-white/35",
    label: "text-xs uppercase tracking-[0.2em] text-[#c7d2fe]",
    tile: "rounded-2xl bg-[#6366f1]/15 p-4 ring-1 ring-[#a5b4fc]/20",
    groupTitle: "text-sm font-semibold text-[#c7d2fe]",
    rows: "inline",
    chip: "rounded-md bg-[#6366f1] px-2.5 py-1 text-sm text-white",
    photo: "rounded-2xl ring-1 ring-white/20",
    swatch: { page: "bg-[#1e1b4b]", card: "bg-[#3b3478]", text: "text-white", font: "font-sans" },
  },
  dotted: {
    layout: "stack",
    accent: "#ef4444",
    onAccent: "#ffffff",
    page: "bg-[#f7f7f8] bg-[radial-gradient(#d4d4d8_1px,transparent_1px)] bg-size-[18px_18px] text-[#18181b] font-sans",
    card: "rounded-2xl border-2 border-dashed border-[#d4d4d8] bg-white",
    heading: "font-sans text-4xl font-bold tracking-tight",
    muted: "text-[#71717a]",
    faint: "text-[#a1a1aa]",
    label: "text-xs font-semibold uppercase tracking-[0.25em] text-[#ef4444]",
    tile: "rounded-xl border border-dashed border-[#e4e4e7] p-4",
    groupTitle: "text-sm font-bold",
    rows: "inline",
    photo: "rounded-xl border-2 border-dashed border-[#d4d4d8] p-1",
    swatch: { page: "bg-[#f7f7f8]", card: "bg-white", text: "text-[#18181b]", font: "font-sans" },
  },

  // ── hero ──────────────────────────────────────────────────────────────────────
  forest: {
    layout: "hero",
    accent: "#cfe1b9",
    onAccent: "#1b3022",
    page: "bg-[linear-gradient(180deg,#2d4a35_0%,#1b3022_70%,#122017_100%)] text-[#f1efe6] font-sans",
    card: "",
    heading: "font-serif text-6xl font-semibold leading-[1.02] sm:text-8xl",
    muted: "text-[#f1efe6]/70",
    faint: "text-[#f1efe6]/35",
    label: "font-serif text-lg italic text-[#cfe1b9]",
    tile: "rounded-xl border border-[#cfe1b9]/20 bg-[#cfe1b9]/[0.06] p-5",
    groupTitle: "font-serif text-xl font-semibold",
    rows: "stacked",
    photo: "rounded-xl",
    swatch: { page: "bg-[#1b3022]", card: "bg-[#2d4a35]", text: "text-[#f1efe6]", font: "font-serif" },
  },
  dune: {
    layout: "hero",
    accent: "#b4532a",
    onAccent: "#fff7ed",
    page: "bg-[linear-gradient(170deg,#fde7c8_0%,#f3c99b_55%,#e2a873_100%)] text-[#3b2416] font-sans",
    card: "",
    heading: "font-serif text-6xl font-medium leading-[1.02] sm:text-8xl",
    muted: "text-[#3b2416]/70",
    faint: "text-[#3b2416]/40",
    label: "text-xs font-semibold uppercase tracking-[0.3em] text-[#b4532a]",
    tile: "rounded-lg bg-[#fff7ed]/55 p-5",
    groupTitle: "font-serif text-xl",
    rows: "stacked",
    swatch: { page: "bg-[#f3c99b]", card: "bg-[#fff7ed]", text: "text-[#3b2416]", font: "font-serif" },
  },
  ocean: {
    layout: "hero",
    accent: "#67e8f9",
    onAccent: "#082f49",
    page: "bg-[linear-gradient(160deg,#0e7490_0%,#0c4a6e_50%,#082f49_100%)] text-white font-sans",
    card: "",
    heading: "font-sans text-6xl font-bold tracking-tight leading-[1.02] sm:text-8xl",
    muted: "text-white/70",
    faint: "text-white/35",
    label: "text-xs font-semibold uppercase tracking-[0.3em] text-[#67e8f9]",
    tile: "rounded-2xl bg-white/10 p-5 backdrop-blur",
    groupTitle: "text-base font-semibold",
    rows: "stacked",
    chip: "rounded-full bg-[#67e8f9]/20 px-3 py-1 text-sm text-[#cffafe]",
    swatch: { page: "bg-[#0c4a6e]", card: "bg-[#0e7490]", text: "text-white", font: "font-sans" },
  },
  noir: {
    layout: "hero",
    accent: "#e11d48",
    onAccent: "#ffffff",
    page: "bg-[#0a0a0a] text-[#fafafa] font-sans",
    card: "",
    heading: "font-serif text-6xl font-normal italic leading-[1.02] sm:text-9xl",
    muted: "text-white/60",
    faint: "text-white/25",
    label: "text-xs uppercase tracking-[0.4em] text-[#e11d48]",
    tile: "border-l-2 border-[#e11d48] pl-5",
    groupTitle: "text-sm font-semibold uppercase tracking-[0.2em]",
    rows: "stacked",
    photo: "rounded-none grayscale",
    swatch: { page: "bg-[#0a0a0a]", card: "bg-[#262626]", text: "text-white", font: "font-serif" },
  },

  // ── split ─────────────────────────────────────────────────────────────────────
  studio: {
    layout: "split",
    accent: "#111827",
    onAccent: "#ffffff",
    page: "bg-[#e5e7eb] text-[#111827] font-sans",
    card: "rounded-3xl bg-white shadow-xl shadow-black/5",
    heading: "font-sans text-5xl font-extrabold tracking-tight leading-[1.02] sm:text-6xl",
    muted: "text-[#6b7280]",
    faint: "text-[#9ca3af]",
    label: "text-xs font-semibold uppercase tracking-[0.25em] text-[#6b7280]",
    tile: "rounded-2xl bg-white p-5",
    groupTitle: "text-base font-bold",
    rows: "inline",
    panel: "rounded-[1.25rem] bg-[#f3f4f6]",
    photo: "rounded-2xl",
    swatch: { page: "bg-[#e5e7eb]", card: "bg-white", text: "text-[#111827]", font: "font-sans" },
  },
  citrus: {
    layout: "split",
    accent: "#1a2e05",
    onAccent: "#ecfccb",
    page: "bg-[#fefce8] text-[#1a2e05] font-sans",
    card: "rounded-3xl bg-white shadow-lg shadow-[#a3e635]/20",
    heading: "font-sans text-5xl font-bold tracking-tight sm:text-6xl",
    muted: "text-[#1a2e05]/65",
    faint: "text-[#1a2e05]/35",
    label: "text-xs font-bold uppercase tracking-[0.25em] text-[#1a2e05]/70",
    tile: "rounded-2xl bg-white/60 p-5",
    groupTitle: "text-base font-bold",
    rows: "inline",
    panel: "rounded-[1.25rem] bg-[linear-gradient(135deg,#d9f99d_0%,#fde047_100%)]",
    chip: "rounded-full bg-[#1a2e05] px-3 py-1 text-sm text-[#ecfccb]",
    swatch: { page: "bg-[#fefce8]", card: "bg-[#d9f99d]", text: "text-[#1a2e05]", font: "font-sans" },
  },
  lagoon: {
    layout: "split",
    accent: "#ffffff",
    onAccent: "#0f766e",
    page: "bg-[#ecfdf5] text-[#134e4a] font-sans",
    card: "rounded-3xl bg-white shadow-xl shadow-[#0f766e]/10",
    heading: "font-serif text-5xl font-semibold sm:text-6xl",
    muted: "text-[#134e4a]/65",
    faint: "text-[#134e4a]/35",
    label: "text-xs font-semibold uppercase tracking-[0.25em] text-white/85",
    tile: "rounded-2xl bg-white/15 p-5 text-white ring-1 ring-white/25",
    groupTitle: "font-serif text-lg font-semibold",
    tileMuted: "text-white/80",
    tileFaint: "text-white/50",
    rows: "inline",
    panel: "rounded-[1.25rem] bg-[linear-gradient(140deg,#5eead4_0%,#14b8a6_45%,#0f766e_100%)]",
    swatch: { page: "bg-[#ecfdf5]", card: "bg-[#14b8a6]", text: "text-white", font: "font-serif" },
  },
  plum: {
    layout: "split",
    accent: "#facc15",
    onAccent: "#2e1065",
    page: "bg-[#1c0f2e] text-[#f5f3ff] font-sans",
    card: "rounded-3xl bg-[#2e1a47] ring-1 ring-white/10",
    heading: "font-serif text-5xl font-semibold text-[#facc15] sm:text-6xl",
    muted: "text-[#f5f3ff]/65",
    faint: "text-[#f5f3ff]/30",
    label: "font-serif text-base italic text-[#facc15]/80",
    tile: "rounded-2xl bg-white/[0.04] p-5",
    groupTitle: "font-serif text-lg",
    rows: "inline",
    panel: "rounded-[1.25rem] bg-[#3b2160]",
    swatch: { page: "bg-[#1c0f2e]", card: "bg-[#3b2160]", text: "text-[#facc15]", font: "font-serif" },
  },

  // ── columns ───────────────────────────────────────────────────────────────────
  grid: {
    layout: "columns",
    accent: "#2563eb",
    onAccent: "#ffffff",
    page: "bg-white text-[#0a0a0a] font-sans",
    card: "border border-[#e5e5e5] bg-white",
    heading: "font-sans text-6xl font-bold tracking-tighter sm:text-7xl",
    muted: "text-[#525252]",
    faint: "text-[#a3a3a3]",
    label: "font-mono text-xs uppercase tracking-widest text-[#2563eb]",
    tile: "",
    groupTitle: "font-mono text-sm uppercase tracking-wider",
    rows: "inline",
    bar: "bg-[#2563eb]",
    photo: "rounded-none",
    swatch: { page: "bg-white", card: "bg-[#f5f5f5]", text: "text-[#0a0a0a]", font: "font-sans" },
  },
  neon: {
    layout: "columns",
    accent: "#f0abfc",
    onAccent: "#111111",
    page: "bg-[#111111] text-white font-sans",
    card: "rounded-2xl bg-[#181818] ring-1 ring-white/10",
    heading: "font-sans text-6xl font-semibold tracking-tight sm:text-7xl",
    muted: "text-white/60",
    faint: "text-white/25",
    label: "text-xs font-semibold uppercase tracking-[0.3em] text-[#f0abfc]",
    tile: "",
    groupTitle: "text-base font-semibold",
    rows: "stacked",
    bar: "bg-[linear-gradient(90deg,#f0abfc,#818cf8)]",
    chip: "rounded-full bg-[#f0abfc]/15 px-3 py-1 text-sm text-[#f5d0fe]",
    swatch: { page: "bg-[#111111]", card: "bg-[#181818]", text: "text-[#f0abfc]", font: "font-sans" },
  },
  sage: {
    layout: "columns",
    accent: "#3f6212",
    onAccent: "#f7fee7",
    page: "bg-[#c7d3bf] text-[#2b3a27] font-sans",
    card: "rounded-[2rem] bg-[#f4f1e8]",
    heading: "font-serif text-6xl font-medium sm:text-7xl",
    muted: "text-[#2b3a27]/65",
    faint: "text-[#2b3a27]/35",
    label: "font-serif text-lg italic text-[#3f6212]",
    tile: "",
    groupTitle: "font-serif text-xl",
    rows: "inline",
    bar: "bg-[#3f6212]",
    photo: "rounded-[1.5rem]",
    swatch: { page: "bg-[#c7d3bf]", card: "bg-[#f4f1e8]", text: "text-[#2b3a27]", font: "font-serif" },
  },
  blueprint: {
    layout: "columns",
    accent: "#ffffff",
    onAccent: "#1e40af",
    page: "bg-[#1e40af] bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-size-[24px_24px] text-white font-mono",
    card: "border border-white/40 bg-[#1e40af]/60",
    heading: "font-mono text-5xl font-medium tracking-tight sm:text-6xl",
    muted: "text-white/70",
    faint: "text-white/35",
    label: "font-mono text-xs uppercase tracking-[0.3em] text-white/80",
    tile: "",
    groupTitle: "font-mono text-sm uppercase tracking-widest",
    rows: "inline",
    bar: "bg-white",
    photo: "rounded-none border border-white/50",
    swatch: { page: "bg-[#1e40af]", card: "bg-[#2747b8]", text: "text-white", font: "font-mono" },
  },

  // ── banner ────────────────────────────────────────────────────────────────────
  candy: {
    layout: "banner",
    accent: "#db2777",
    onAccent: "#ffffff",
    page: "bg-[#fdf2f8] text-[#3f1d38] font-sans",
    card: "rounded-[2rem] bg-white shadow-xl shadow-[#db2777]/10",
    heading: "font-sans text-5xl font-bold tracking-tight text-white sm:text-6xl",
    muted: "text-[#3f1d38]/65",
    faint: "text-[#3f1d38]/35",
    label: "text-xs font-semibold uppercase tracking-[0.25em] text-[#db2777]",
    tile: "rounded-2xl bg-[#fdf2f8] p-5",
    groupTitle: "text-base font-bold",
    rows: "inline",
    banner: "rounded-[1.6rem] bg-[linear-gradient(135deg,#f472b6_0%,#c084fc_100%)] text-white",
    photo: "rounded-3xl",
    swatch: { page: "bg-[#fdf2f8]", card: "bg-[#f472b6]", text: "text-white", font: "font-sans" },
  },
  aurora: {
    layout: "banner",
    accent: "#5eead4",
    onAccent: "#0b1120",
    page: "bg-[#0b1120] text-[#e2e8f0] font-sans",
    card: "rounded-[2rem] bg-[#111827] ring-1 ring-white/10",
    heading: "font-sans text-5xl font-semibold tracking-tight text-white sm:text-6xl",
    muted: "text-[#e2e8f0]/60",
    faint: "text-[#e2e8f0]/30",
    label: "text-xs font-semibold uppercase tracking-[0.3em] text-[#5eead4]",
    tile: "rounded-2xl bg-white/[0.04] p-5",
    groupTitle: "text-base font-semibold",
    rows: "stacked",
    banner: "rounded-[1.6rem] bg-[linear-gradient(120deg,#2dd4bf_0%,#6366f1_55%,#a855f7_100%)] text-white",
    chip: "rounded-full bg-white/20 px-3 py-1 text-sm text-white",
    swatch: { page: "bg-[#0b1120]", card: "bg-[#6366f1]", text: "text-white", font: "font-sans" },
  },
  clay: {
    layout: "banner",
    accent: "#9a3412",
    onAccent: "#fff7ed",
    page: "bg-[#ede4d8] text-[#3d2b1f] font-sans",
    card: "rounded-xl bg-[#faf6f0] shadow-sm",
    heading: "font-serif text-5xl font-semibold text-[#fff7ed] sm:text-6xl",
    muted: "text-[#3d2b1f]/65",
    faint: "text-[#3d2b1f]/35",
    label: "font-serif text-base italic text-[#9a3412]",
    tile: "rounded-lg border border-[#3d2b1f]/10 p-5",
    groupTitle: "font-serif text-lg font-semibold",
    rows: "inline",
    banner: "rounded-lg bg-[#b45b37] text-[#fff7ed]",
    swatch: { page: "bg-[#ede4d8]", card: "bg-[#b45b37]", text: "text-[#fff7ed]", font: "font-serif" },
  },
  slate: {
    layout: "banner",
    accent: "#fbbf24",
    onAccent: "#1e293b",
    page: "bg-[#334155] text-[#e2e8f0] font-sans",
    card: "rounded-2xl bg-[#1e293b] shadow-2xl shadow-black/30",
    heading: "font-sans text-5xl font-bold tracking-tight text-[#1e293b] sm:text-6xl",
    muted: "text-[#e2e8f0]/60",
    faint: "text-[#e2e8f0]/30",
    label: "text-xs font-bold uppercase tracking-[0.3em] text-[#fbbf24]",
    tile: "rounded-xl bg-[#273449] p-5",
    groupTitle: "text-base font-bold",
    rows: "stacked",
    banner: "rounded-xl bg-[#fbbf24] text-[#1e293b]",
    chip: "rounded-md bg-[#1e293b] px-2.5 py-1 text-sm text-[#fbbf24]",
    swatch: { page: "bg-[#334155]", card: "bg-[#fbbf24]", text: "text-[#1e293b]", font: "font-sans" },
  },
};
