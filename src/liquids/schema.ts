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

export const liquids = pgTable('liquids', {
    id: bigserial('id', {mode: 'number'}).primaryKey(),
    dt_drinked: date('dt_measure').notNull(),
    name: text('name').notNull(),
    volume: numeric('volume', {precision: 6, scale: 2}).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    profileId: bigint('profileId', {mode: 'number'}).notNull().references(() => profiles.id),
});

export const liquidsRelations = relations(liquids, ({ one }) => ({
    profiles: one(profiles, {
        fields: [liquids.profileId], 
        references: [profiles.id],
    }),
}))