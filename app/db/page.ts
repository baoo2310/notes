import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { workspaceTable } from "./workspace";

export const pageTable = pgTable("page", {
    id: uuid("page").primaryKey().defaultRandom(),
    name: varchar("name").notNull(),
    icon_img: varchar("icon_img"),
    background_img: varchar("background_img"),
    updatedAt: timestamp()
})

export const pageBelongTable = pgTable("workspace_page",  {
    workspace_id: uuid("workspace_id").references(() => workspaceTable.id),
    page_id: uuid("page_id").references(() => pageTable.id),
    createdAt: timestamp().$default(() => new Date())
})

export const pageContainPage = pgTable("page_belong_page", {
    page_root: uuid("page_root_id").references(() => pageTable.id),
    page_child: uuid("page_child_id").references(() => pageTable.id),
    createdAt: timestamp().$default(() => new Date())
})