import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { db } from '@/db';
import { pageTable, pageBlockTable } from '@/db/page';
import { workspaceTable } from '@/db/workspace';
import { eq, and } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';

/** Verify the requesting user owns the workspace that contains this page. */
async function assertPageOwnership(pageId: string, userId: string) {
    const result = await db.select({
        pageId: pageTable.id,
        ownerId: workspaceTable.owner_id,
    })
        .from(pageTable)
        .innerJoin(workspaceTable, eq(pageTable.workspace_id, workspaceTable.id))
        .where(eq(pageTable.id, pageId))
        .limit(1);

    if (result.length === 0) throw new TRPCError({ code: 'NOT_FOUND', message: 'Page not found' });
    if (result[0].ownerId !== userId) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'You do not own this workspace' });
    }
}

export const pageRouter = router({
    // List all pages in a workspace
    getAll: protectedProcedure
        .input(z.object({ workspace_id: z.string().uuid() }))
        .query(async ({ input, ctx }) => {
            // Verify user owns this workspace
            const ws = await db.query.workspaceTable.findFirst({
                where: eq(workspaceTable.id, input.workspace_id),
            });
            if (!ws || ws.owner_id !== ctx.session.user.id) {
                throw new TRPCError({ code: 'FORBIDDEN' });
            }
            return await db.query.pageTable.findMany({
                where: eq(pageTable.workspace_id, input.workspace_id),
                columns: {
                    id: true,
                    name: true,
                    icon_img: true,
                    parent_page_id: true,
                },
                orderBy: (page, { desc }) => [desc(page.createdAt)],
            });
        }),

    // Get a page and all its nested blocks
    getById: protectedProcedure
        .input(z.object({ id: z.string().uuid() }))
        .query(async ({ input, ctx }) => {
            await assertPageOwnership(input.id, ctx.session.user.id);
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
            parent_page_id: z.string().uuid().optional(),
        }))
        .mutation(async ({ input, ctx }) => {
            // Verify user owns this workspace before creating page
            const ws = await db.query.workspaceTable.findFirst({
                where: eq(workspaceTable.id, input.workspace_id),
            });
            if (!ws || ws.owner_id !== ctx.session.user.id) {
                throw new TRPCError({ code: 'FORBIDDEN' });
            }
            const [newPage] = await db.insert(pageTable).values({
                name: input.name,
                workspace_id: input.workspace_id,
                parent_page_id: input.parent_page_id,
            }).returning();
            return newPage;
        }),

    // Update page details (title, icon, background)
    updatePage: protectedProcedure
        .input(z.object({
            id: z.string().uuid(),
            name: z.string().min(1).optional(),
            icon_img: z.string().nullable().optional(),
            background_img: z.string().nullable().optional(),
        }))
        .mutation(async ({ input, ctx }) => {
            await assertPageOwnership(input.id, ctx.session.user.id);
            const updates: Record<string, any> = { updatedAt: new Date() };
            if (input.name !== undefined) updates.name = input.name;
            if (input.icon_img !== undefined) updates.icon_img = input.icon_img;
            if (input.background_img !== undefined) updates.background_img = input.background_img;
            const [updated] = await db.update(pageTable)
                .set(updates)
                .where(eq(pageTable.id, input.id))
                .returning();
            return updated;
        }),

    // Delete a page
    delete: protectedProcedure
        .input(z.object({ id: z.string().uuid() }))
        .mutation(async ({ input, ctx }) => {
            await assertPageOwnership(input.id, ctx.session.user.id);
            const [deleted] = await db.delete(pageTable)
                .where(eq(pageTable.id, input.id))
                .returning();
            return deleted;
        }),

    // Add a block to a page
    addBlock: protectedProcedure
        .input(z.object({
            page_id: z.string().uuid(),
            type: z.enum(['NOTE', 'BOARD', 'CALENDAR', 'LINK', 'POMODORO', 'CLOCK']),
        }))
        .mutation(async ({ input, ctx }) => {
            await assertPageOwnership(input.page_id, ctx.session.user.id);
            const [newBlock] = await db.insert(pageBlockTable).values({
                page_id: input.page_id,
                type: input.type,
            }).returning();
            return newBlock;
        }),

    // Delete a block
    deleteBlock: protectedProcedure
        .input(z.object({ id: z.string().uuid() }))
        .mutation(async ({ input, ctx }) => {
            // Find block's page, then check ownership
            const block = await db.query.pageBlockTable.findFirst({
                where: eq(pageBlockTable.id, input.id),
            });
            if (!block) throw new TRPCError({ code: 'NOT_FOUND' });
            await assertPageOwnership(block.page_id, ctx.session.user.id);
            const [deleted] = await db.delete(pageBlockTable)
                .where(eq(pageBlockTable.id, input.id))
                .returning();
            return deleted;
        }),

    // Update block content (jsonb)
    updateBlockContent: protectedProcedure
        .input(z.object({
            id: z.string().uuid(),
            content: z.any(),
        }))
        .mutation(async ({ input, ctx }) => {
            const block = await db.query.pageBlockTable.findFirst({
                where: eq(pageBlockTable.id, input.id),
            });
            if (!block) throw new TRPCError({ code: 'NOT_FOUND' });
            await assertPageOwnership(block.page_id, ctx.session.user.id);
            const [updated] = await db.update(pageBlockTable)
                .set({ content: input.content, updatedAt: new Date() })
                .where(eq(pageBlockTable.id, input.id))
                .returning();
            return updated;
        }),
});
