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
    /** URL slug from the name ("lena-vogt", "lena-vogt-2", …), unique across all people; set by the API on save. */
    slug: text("slug").notNull().unique(),
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

/**
 * Images of a person, stored in S3 (key `people/<personId>/<uuid>.<ext>`). One person has many
 * images; they are deleted with the person (the S3 objects are removed by the API on delete).
 */
export const personImage = pgTable(
  "person_image",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    personId: uuid("person_id")
      .notNull()
      .references(() => person.id, { onDelete: "cascade" }),
    /** S3 object key. */
    key: text("key").notNull().unique(),
    /** Original file name, used as fallback alt text. */
    name: text("name").notNull(),
    contentType: text("content_type").notNull(),
    size: integer("size").notNull(),
    /** Display order (ascending). */
    position: integer("position").notNull().default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("person_image_person_id_idx").on(table.personId)],
);

export type PersonImage = typeof personImage.$inferSelect;
