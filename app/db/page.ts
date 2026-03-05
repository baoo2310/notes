import { pgTable, timestamp, uuid, varchar, jsonb, integer, pgEnum, primaryKey } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { workspaceTable } from "./workspace";

export const blockTypeEnum = pgEnum('block_type', ['NOTE', 'BOARD', 'CALENDAR', 'LINK']);

// A single page acts as a container for many content "blocks"
export const pageTable = pgTable("page", {
    id: uuid("page").primaryKey().defaultRandom(),
    name: varchar("name").notNull(),
    icon_img: varchar("icon_img"),
    background_img: varchar("background_img"),
    layout_config: jsonb("layout_config"), // Define how blocks are rendered (grid, stack, etc)
    updatedAt: timestamp()
})

export const pageBelongTable = pgTable("workspace_page", {
    workspace_id: uuid("workspace_id").references(() => workspaceTable.id).notNull(),
    page_id: uuid("page_id").references(() => pageTable.id).notNull(),
    createdAt: timestamp().$default(() => new Date())
}, (t) => [
    primaryKey({ columns: [t.workspace_id, t.page_id] })
])

// Single page acts as a container for many content "blocks"
export const pageBlockTable = pgTable("page_block", {
    id: uuid("page_block").primaryKey().defaultRandom(),
    page_id: uuid("page_id").references(() => pageTable.id, { onDelete: 'cascade' }).notNull(),
    type: blockTypeEnum("type").notNull().default("NOTE"),
    position_order: integer("position_order").notNull().default(0),
    position_col: varchar("position_col").notNull().default("full"), // 'full', 'left', 'right'
    size: varchar("size").notNull().default("medium"), // 'small', 'medium', 'large'
    content: jsonb("content"), // Stores actual text or JSON config (e.g. { target_page_id })
    updatedAt: timestamp()
})

// The pageRelations will be declared below

// This relation allows a block to point back to its parent page
export const pageBlockRelations = relations(pageBlockTable, ({ one }) => ({
    page: one(pageTable, {
        fields: [pageBlockTable.page_id],
        references: [pageTable.id]
    })
}));

export const pageContainPage = pgTable("page_belong_page", {
    page_root: uuid("page_root_id").references(() => pageTable.id).notNull(),
    page_child: uuid("page_child_id").references(() => pageTable.id).notNull(),
    createdAt: timestamp().$default(() => new Date())
}, (t) => [
    primaryKey({ columns: [t.page_root, t.page_child] })
])

// --- Additional Relations ---

export const pageRelations = relations(pageTable, ({ many }) => ({
    blocks: many(pageBlockTable),
    workspaces: many(pageBelongTable),
    childPages: many(pageContainPage, { relationName: "parent_to_child" }),
    parentPages: many(pageContainPage, { relationName: "child_to_parent" })
}));

export const pageBelongRelations = relations(pageBelongTable, ({ one }) => ({
    workspace: one(workspaceTable, {
        fields: [pageBelongTable.workspace_id],
        references: [workspaceTable.id]
    }),
    page: one(pageTable, {
        fields: [pageBelongTable.page_id],
        references: [pageTable.id]
    })
}));

export const pageContainPageRelations = relations(pageContainPage, ({ one }) => ({
    parent: one(pageTable, {
        fields: [pageContainPage.page_root],
        references: [pageTable.id],
        relationName: "parent_to_child"
    }),
    child: one(pageTable, {
        fields: [pageContainPage.page_child],
        references: [pageTable.id],
        relationName: "child_to_parent"
    })
}));