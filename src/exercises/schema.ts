import { 
    pgTable, 
    text,
    timestamp,
    date,
    bigserial,
    bigint 
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { profiles } from "../users/schema";

export const exercises = pgTable('exercises', {
    id: bigserial('id', {mode: 'number'}).primaryKey(),
    dt_exercise: date('dt_exercise').notNull(),
    name: text('name').notNull(),
    description: text('description').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    profileId: bigint('profileId', {mode: 'number'}).notNull().references(() => profiles.id),
});

export const exercisesRelations = relations(exercises, ({ one }) => ({
    profiles: one(profiles, {
        fields: [exercises.profileId], 
        references: [profiles.id],
    }),
}));