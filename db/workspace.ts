import { pgEnum, primaryKey, timestamp, uuid, varchar } from "drizzle-orm/pg-core"
import { pgTable } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"
import { usersTable } from "./user"
import { pageTable } from "./page"

export const workspaceRoleEnum = pgEnum("workspaces_role", ["viewer", "editor", "owner"])

export const workspaceTable = pgTable("workspace", {
    id: uuid("workspace").primaryKey().defaultRandom(),
    name: varchar("name").notNull().unique(),
    owner_id: uuid("owner_id").references(() => usersTable.id).notNull(),
    createdAt: timestamp().notNull().$default(() => new Date()),
    updatedAt: timestamp(),
})

export const workspaceRelations = relations(workspaceTable, ({ one, many }) => ({
    owner: one(usersTable, {
        fields: [workspaceTable.owner_id],
        references: [usersTable.id]
    }),
    members: many(workspaceMemberTable),
    pages: many(pageTable)
}));

export const workspaceMemberTable = pgTable("workspace_member", {
    workspace_id: uuid("workspace_id").references(() => workspaceTable.id, { onDelete: 'cascade' }).notNull(),
    user_id: uuid("user_id").references(() => usersTable.id, { onDelete: 'cascade' }).notNull(),
    role: workspaceRoleEnum("role").notNull().default("viewer"),
    createdAt: timestamp().notNull().$default(() => new Date()),
}, (t) => [
    primaryKey({ columns: [t.workspace_id, t.user_id] })
])

export const workspaceMemberRelations = relations(workspaceMemberTable, ({ one }) => ({
    workspace: one(workspaceTable, {
        fields: [workspaceMemberTable.workspace_id],
        references: [workspaceTable.id]
    }),
    user: one(usersTable, {
        fields: [workspaceMemberTable.user_id],
        references: [usersTable.id]
    })
}));
