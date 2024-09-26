CREATE TABLE IF NOT EXISTS "meals" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"dt_meal" date NOT NULL,
	"tot_carb_kcal" numeric(5, 2) NOT NULL,
	"tot_protein_kcal" numeric(5, 2) NOT NULL,
	"tot_fat_kcal" numeric(5, 2) NOT NULL,
	"description" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"profileId" bigint NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "meals" ADD CONSTRAINT "meals_profileId_profiles_id_fk" FOREIGN KEY ("profileId") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
