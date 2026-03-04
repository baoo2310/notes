import { integer, pgEnum, pgTable, timestamp, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";

export const userRolesEnum = pgEnum("roles", ["admin", "user"]);

export const usersTable = pgTable("users", {
  id: uuid("user").primaryKey().defaultRandom(),
  email: varchar({ length: 255 }).notNull().unique(),
  username: varchar({ length: 255 }).notNull(),
  password: varchar().notNull(),
  age: integer().notNull(),
  role: userRolesEnum().default("user"),
  avatar: varchar(),
  bio: varchar(),
  createdAt: timestamp().notNull().$default(() => new Date()),
  updatedAt: timestamp(),
}, (table) => [
    uniqueIndex("email_idx").on(table.email)
]);