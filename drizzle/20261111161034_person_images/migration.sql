CREATE TABLE "person_image" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"person_id" uuid NOT NULL,
	"key" text NOT NULL UNIQUE,
	"name" text NOT NULL,
	"content_type" text NOT NULL,
	"size" integer NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "person_image_person_id_idx" ON "person_image" ("person_id");--> statement-breakpoint
ALTER TABLE "person_image" ADD CONSTRAINT "person_image_person_id_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "person"("id") ON DELETE CASCADE;