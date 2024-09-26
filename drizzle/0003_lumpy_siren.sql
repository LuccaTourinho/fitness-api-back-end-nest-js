CREATE TABLE IF NOT EXISTS "body" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"dt_measure" date NOT NULL,
	"height" numeric(5, 2) NOT NULL,
	"weight" numeric(5, 2) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"profileId" bigint NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "body" ADD CONSTRAINT "body_profileId_profiles_id_fk" FOREIGN KEY ("profileId") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
