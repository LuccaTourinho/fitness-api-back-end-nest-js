import { 
    pgTable, 
    text,
    timestamp,
    numeric,
    date,
    bigserial,
    bigint 
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { profiles } from "../users/schema";

export const meals = pgTable('meals', {
    id: bigserial('id', {mode: 'number'}).primaryKey(),
    dt_meal: date('dt_meal').notNull(),
    tot_carb_kcal: numeric('tot_carb_kcal', {precision: 5, scale: 2}).notNull(),
    tot_protein_kcal: numeric('tot_protein_kcal', {precision: 5, scale: 2}).notNull(),
    tot_fat_kcal: numeric('tot_fat_kcal', {precision: 5, scale: 2}).notNull(),
    description: text('description').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    profileId: bigint('profileId', {mode: 'number'}).notNull().references(() => profiles.id),
});

export const mealsRelations = relations(meals, ({ one }) => ({
    profiles: one(profiles, {
        fields: [meals.profileId], 
        references: [profiles.id],
    }),
}));
