import {
    pgTable, 
    timestamp,
    numeric,
    date,
    bigserial,
    bigint
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { profiles } from "../users/schema";

export const body = pgTable('body', {
    id: bigserial('id', {mode: 'number'}).primaryKey(),
    dt_measure: date('dt_measure').notNull(),
    height: numeric('height', {precision: 5, scale: 2}).notNull(),
    weight: numeric('weight', {precision: 5, scale: 2}).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    profileId: bigint('profileId', {mode: 'number'}).notNull().references(() => profiles.id),
});

export const bodyRelations = relations(body, ({ one }) => ({
    profiles: one(profiles, {
        fields: [body.profileId], 
        references: [profiles.id],
    }),
}));
