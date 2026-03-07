import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { db } from '@/db';
import { pageTable, pageBlockTable } from '@/db/page';
import { eq } from 'drizzle-orm';

export const pageRouter = router({
    // List all pages in a workspace
    getAll: protectedProcedure
        .input(z.object({ workspace_id: z.string().uuid() }))
        .query(async ({ input }) => {
            return await db.query.pageTable.findMany({
                where: eq(pageTable.workspace_id, input.workspace_id),
                columns: {
                    id: true,
                    name: true,
                    icon_img: true,
                },
                orderBy: (page, { desc }) => [desc(page.createdAt)],
            });
        }),

    // Get a page and all its nested blocks
    getById: protectedProcedure
        .input(z.object({ id: z.string().uuid() }))
        .query(async ({ input }) => {
            return await db.query.pageTable.findFirst({
                where: eq(pageTable.id, input.id),
                with: {
                    blocks: true,
                    childPages: true,
                },
            });
        }),

    // Create a new page
    create: protectedProcedure
        .input(z.object({
            name: z.string().min(1),
            workspace_id: z.string().uuid(),
        }))
        .mutation(async ({ input }) => {
            const [newPage] = await db.insert(pageTable).values({
                name: input.name,
                workspace_id: input.workspace_id,
            }).returning();
            return newPage;
        }),

    // Delete a page
    delete: protectedProcedure
        .input(z.object({ id: z.string().uuid() }))
        .mutation(async ({ input }) => {
            const [deleted] = await db.delete(pageTable)
                .where(eq(pageTable.id, input.id))
                .returning();
            return deleted;
        }),

    // Add a block to a page
    addBlock: protectedProcedure
        .input(z.object({
            page_id: z.string().uuid(),
            type: z.enum(['NOTE', 'BOARD', 'CALENDAR', 'LINK']),
            pos_x: z.number().int().default(20),
            pos_y: z.number().int().default(20),
            width: z.number().int().default(300),
            height: z.number().int().default(200),
        }))
        .mutation(async ({ input }) => {
            const [newBlock] = await db.insert(pageBlockTable).values({
                page_id: input.page_id,
                type: input.type,
                pos_x: input.pos_x,
                pos_y: input.pos_y,
                width: input.width,
                height: input.height,
            }).returning();
            return newBlock;
        }),

    // Delete a block
    deleteBlock: protectedProcedure
        .input(z.object({ id: z.string().uuid() }))
        .mutation(async ({ input }) => {
            const [deleted] = await db.delete(pageBlockTable)
                .where(eq(pageBlockTable.id, input.id))
                .returning();
            return deleted;
        }),

    // Save a block's new position after dragging
    updateBlockPosition: protectedProcedure
        .input(z.object({
            id: z.string().uuid(),
            pos_x: z.number().int(),
            pos_y: z.number().int(),
            width: z.number().int(),
            height: z.number().int(),
            z_index: z.number().int(),
        }))
        .mutation(async ({ input }) => {
            const [updatedBlock] = await db.update(pageBlockTable)
                .set({
                    pos_x: input.pos_x,
                    pos_y: input.pos_y,
                    width: input.width,
                    height: input.height,
                    z_index: input.z_index,
                })
                .where(eq(pageBlockTable.id, input.id))
                .returning();

            return updatedBlock;
        }),
});
