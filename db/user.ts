import { integer, pgEnum, pgTable, timestamp, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { workspaceMemberTable, workspaceTable } from "./workspace";

export const userRolesEnum = pgEnum("roles", ["admin", "user"]);

export const usersTable = pgTable("users", {
  id: varchar("id", { length: 255 }).notNull().primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date", precision: 3 }),
  image: varchar("image", { length: 255 }),
  // Our custom fields
  role: userRolesEnum().default("user"),
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