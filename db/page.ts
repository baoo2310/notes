import { pgTable, timestamp, uuid, varchar, jsonb, integer, pgEnum, primaryKey, AnyPgColumn } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { workspaceTable } from "./workspace";
import { usersTable } from "./user";

export const blockTypeEnum = pgEnum('block_type', ['NOTE', 'BOARD', 'CALENDAR', 'LINK']);
export const pageRoleEnum = pgEnum('page_role', ['viewer', 'editor']);

// A single page acts as a container for many content "blocks"
export const pageTable = pgTable("page", {
    id: uuid("page").primaryKey().defaultRandom(),
    name: varchar("name").notNull(),
    icon_img: varchar("icon_img"),
    background_img: varchar("background_img"),
    layout_config: jsonb("layout_config"), // Define how blocks are rendered (grid, stack, etc)
    workspace_id: uuid("workspace_id").references(() => workspaceTable.id, { onDelete: 'cascade' }).notNull(),
    parent_page_id: uuid("parent_page_id").references((): AnyPgColumn => pageTable.id, { onDelete: 'cascade' }),
    updatedAt: timestamp(),
    createdAt: timestamp().$default(() => new Date())
})

export const pageBlockTable = pgTable("page_block", {
    id: uuid("page_block").primaryKey().defaultRandom(),
    page_id: uuid("page_id").references(() => pageTable.id, { onDelete: 'cascade' }).notNull(),
    type: blockTypeEnum("type").notNull().default("NOTE"),

    pos_x: integer("pos_x").notNull().default(0),
    pos_y: integer("pos_y").notNull().default(0),

    width: integer("width").notNull().default(300),
    height: integer("height").notNull().default(200),

    z_index: integer("z_index").notNull().default(1),

    content: jsonb("content"),
    updatedAt: timestamp()
})

export const pageMemberTable = pgTable("page_member", {
    page_id: uuid("page_id").references(() => pageTable.id, { onDelete: 'cascade' }).notNull(),
    user_id: uuid("user_id").references(() => usersTable.id, { onDelete: 'cascade' }).notNull(),
    role: pageRoleEnum("role").notNull().default("viewer"),
    createdAt: timestamp().notNull().$default(() => new Date()),
}, (t) => [
    primaryKey({ columns: [t.page_id, t.user_id] })
])

// --- Additional Relations ---

export const pageRelations = relations(pageTable, ({ one, many }) => ({
    workspace: one(workspaceTable, {
        fields: [pageTable.workspace_id],
        references: [workspaceTable.id]
    }),
    parentPage: one(pageTable, {
        fields: [pageTable.parent_page_id],
        references: [pageTable.id],
        relationName: "nested_pages"
    }),
    childPages: many(pageTable, {
        relationName: "nested_pages"
    }),
    blocks: many(pageBlockTable)
}));
