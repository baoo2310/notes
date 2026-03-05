import { timestamp, uuid, varchar, primaryKey } from "drizzle-orm/pg-core"
import { pgTable } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"
import { usersTable } from "./user"
import { pageBelongTable } from "./page"

export const workspaceTable = pgTable("workspace", {
    id: uuid("workspace").primaryKey().defaultRandom(),
    name: varchar("name").notNull().unique()
})

export const workspaceOwnerTable = pgTable("tableOwner", {
    user_id: uuid("user_id").references(() => usersTable.id).notNull(),
    workspace_id: uuid("workspace_id").references(() => workspaceTable.id).notNull(),
    createdAt: timestamp().notNull().$default(() => new Date()),
    updatedAt: timestamp(),
}, (t) => [
    primaryKey({ columns: [t.user_id, t.workspace_id] })
])

export const workspaceRelations = relations(workspaceTable, ({ many }) => ({
    owners: many(workspaceOwnerTable),
    pages: many(pageBelongTable)
}));

export const workspaceOwnerRelations = relations(workspaceOwnerTable, ({ one }) => ({
    user: one(usersTable, {
        fields: [workspaceOwnerTable.user_id],
        references: [usersTable.id]
    }),
    workspace: one(workspaceTable, {
        fields: [workspaceOwnerTable.workspace_id],
        references: [workspaceTable.id]
    })
}));