import { timestamp, uuid, varchar } from "drizzle-orm/pg-core"
import { pgTable } from "drizzle-orm/pg-core"
import { usersTable } from "./user"

export const workspaceTable = pgTable("workspace", {
    id: uuid("workspace").primaryKey().defaultRandom(),
    name: varchar("name").notNull().unique()
})

export const workspaceOwnerTable = pgTable("tableOwner", {
    user_id: uuid("user_id").references(() => usersTable.id),
    workspace_id: uuid("workspace_id").references(() => workspaceTable.id),
    createdAt: timestamp().notNull().$default(() => new Date()),
    updatedAt: timestamp(),
})