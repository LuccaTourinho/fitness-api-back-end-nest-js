CREATE TABLE IF NOT EXISTS "liquids" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"dt_measure" date NOT NULL,
	"name" text NOT NULL,
	"volume" numeric(6, 2) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"profileId" bigint NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "liquids" ADD CONSTRAINT "liquids_profileId_profiles_id_fk" FOREIGN KEY ("profileId") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
