import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { db } from '@/db';
import { pageTable, pageBlockTable } from '@/db/page';
import { eq } from 'drizzle-orm';

export const pageRouter = router({
    // Get a page and all its nested blocks
    getById: publicProcedure
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

    // Save a block's new position after dragging
    updateBlockPosition: publicProcedure
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
