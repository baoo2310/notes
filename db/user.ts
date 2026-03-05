import { integer, pgEnum, pgTable, timestamp, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { workspaceMemberTable, workspaceTable } from "./workspace";

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

export const usersRelations = relations(usersTable, ({ many }) => ({
  ownedWorkspaces: many(workspaceTable),
  sharedWorkspaces: many(workspaceMemberTable),
}));