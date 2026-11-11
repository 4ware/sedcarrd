CREATE TABLE "person" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" text NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"professions" text[] DEFAULT '{}'::text[] NOT NULL,
	"birth_year" integer,
	"birth_place" text,
	"languages" text[] DEFAULT '{}'::text[] NOT NULL,
	"dialects" text[] DEFAULT '{}'::text[] NOT NULL,
	"singing" text[] DEFAULT '{}'::text[] NOT NULL,
	"dances" text[] DEFAULT '{}'::text[] NOT NULL,
	"sports" text[] DEFAULT '{}'::text[] NOT NULL,
	"licences" text[] DEFAULT '{}'::text[] NOT NULL,
	"working_location" text,
	"primary_residence" text,
	"nationalities" text[] DEFAULT '{}'::text[] NOT NULL,
	"height_cm" integer,
	"weight_kg" integer,
	"build" text,
	"clothing_size" text,
	"ethnic_appearance" text,
	"hair_color" text,
	"hair_length" text,
	"eye_color" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "person_user_id_idx" ON "person" ("user_id");--> statement-breakpoint
ALTER TABLE "person" ADD CONSTRAINT "person_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;