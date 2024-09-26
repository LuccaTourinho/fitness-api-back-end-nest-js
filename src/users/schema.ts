import { 
    pgTable, 
    text,
    timestamp,
    date,
    bigserial,
    bigint 
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { meals } from "src/meals/schema";
import { body } from "src/body/schema";
import { liquids } from "src/liquids/schema";
import { exercises } from "src/exercises/schema";

export const users = pgTable('users', {
    id: bigserial('id', {mode: 'number'}).primaryKey(),
    email: text('email').unique().notNull(),
    password: text('password').unique().notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const usersRelations = relations(users, ({ one }) => ({
    profile: one(profiles, {
        fields: [users.id],
        references: [profiles.userId],
    }),
}));

export const profiles = pgTable('profiles', {
    id: bigserial('id', {mode: 'number'}).primaryKey(),
    name: text('name').notNull(),
    gender: text('gender').notNull(),
    birthdate: date('birthdate').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    userId: bigint('user_id', {mode: 'number'}).notNull().references(() => users.id),
});


export const profilesRelations = relations(profiles, ({ many, one }) => ({
    users: one(users, {
        fields: [profiles.userId],
        references: [users.id],
    }),
    meals: many(meals),
    body: many(body),
    liquids: many(liquids),
    exercises: many(exercises),
}));

