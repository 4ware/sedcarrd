import { index, integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { user } from "@/features/auth/db/schema";
import { DEFAULT_THEME, type ThemeKey } from "@/features/themes/registry";

/** Empty Postgres text array, the default for every list column. */
const emptyList = () => [] as string[];

/**
 * A person (e.g. an actor) managed by a user: the profile header plus the "Basisdaten" of a casting
 * profile (modelled on Crew United). One user has many people; a person belongs to exactly one user.
 *
 * Lists are text arrays. Single-choice attributes (build, hair, eyes, …) are free text until the
 * option sets are fixed.
 */
export const person = pgTable(
  "person",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    // ── Header ──────────────────────────────────────────────────────────────────
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    /** e.g. Schauspielerin, Synchronschauspielerin, Sängerin, Sprecherin. */
    professions: text("professions").array().notNull().default(emptyList()),
    /** Only the year is shown ("Geboren 2000 … (26 Jahre)"); the age is derived from it. */
    birthYear: integer("birth_year"),
    birthPlace: text("birth_place"),

    // ── Basisdaten: skills ──────────────────────────────────────────────────────
    languages: text("languages").array().notNull().default(emptyList()),
    dialects: text("dialects").array().notNull().default(emptyList()),
    /** Singing styles (Gesang), e.g. A cappella, Musical. */
    singing: text("singing").array().notNull().default(emptyList()),
    /** Fähigkeiten (Tanz). */
    dances: text("dances").array().notNull().default(emptyList()),
    /** Fähigkeiten (Sport). */
    sports: text("sports").array().notNull().default(emptyList()),
    /** Driving licences etc., e.g. "B (Kraftwagen) [eu]". */
    licences: text("licences").array().notNull().default(emptyList()),

    // ── Basisdaten: location & nationality ─────────────────────────────────────
    /** Unmittelbarer Arbeitsort. */
    workingLocation: text("working_location"),
    /** Bundesland (1. Wohnsitz), e.g. "Spanien - Madrid". */
    primaryResidence: text("primary_residence"),
    nationalities: text("nationalities").array().notNull().default(emptyList()),

    // ── Basisdaten: appearance ──────────────────────────────────────────────────
    heightCm: integer("height_cm"),
    weightKg: integer("weight_kg"),
    /** Statur, e.g. athletisch-sportlich. */
    build: text("build"),
    /** Konfektion, e.g. S/M or 38. */
    clothingSize: text("clothing_size"),
    /** Ethn. Erscheinung (casting category; personal data, handle with care). */
    ethnicAppearance: text("ethnic_appearance"),
    hairColor: text("hair_color"),
    /** Haarlänge. */
    hairLength: text("hair_length"),
    eyeColor: text("eye_color"),

    // ── Presentation ────────────────────────────────────────────────────────────
    /** Theme of the person's page (keys in features/themes/registry.ts; validated by the API). */
    theme: text("theme").$type<ThemeKey>().notNull().default(DEFAULT_THEME),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("person_user_id_idx").on(table.userId)],
);

export type Person = typeof person.$inferSelect;
export type NewPerson = typeof person.$inferInsert;
