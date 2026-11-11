-- Add the slug in three steps so existing people get one before NOT NULL / UNIQUE apply.
ALTER TABLE "person" ADD COLUMN "slug" text;--> statement-breakpoint
-- Backfill: an SQL approximation of ts-slug (German umlauts, then anything else non-alphanumeric
-- becomes "-"), made unique with the start of the id. The API writes the proper slug on the next save.
UPDATE "person" SET "slug" = coalesce(
  nullif(
    trim(both '-' from regexp_replace(
      replace(replace(replace(replace(lower("first_name" || ' ' || "last_name"), 'ä', 'ae'), 'ö', 'oe'), 'ü', 'ue'), 'ß', 'ss'),
      '[^a-z0-9]+', '-', 'g'
    )),
    ''
  ),
  'person'
) || '-' || left("id"::text, 8);--> statement-breakpoint
ALTER TABLE "person" ALTER COLUMN "slug" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "person" ADD CONSTRAINT "person_slug_key" UNIQUE("slug");
