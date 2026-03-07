import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { db } from '@/db';
import { workspaceTable } from '@/db/workspace';
import { eq, and } from 'drizzle-orm';

export const workspaceRouter = router({
    // Get all workspaces owned by the current user
    getAll: protectedProcedure.query(async ({ ctx }) => {
        return await db.query.workspaceTable.findMany({
            where: eq(workspaceTable.owner_id, ctx.session.user.id),
            with: {
                owner: true,
                pages: true,
            },
        });
    }),

    // Get a single workspace by ID
    getById: protectedProcedure
        .input(z.object({ id: z.string().uuid() }))
        .query(async ({ input, ctx }) => {
            return await db.query.workspaceTable.findFirst({
                where: eq(workspaceTable.id, input.id),
                with: {
                    owner: true,
                    pages: true,
                    members: {
                        with: {
                            user: true
                        }
                    }
                },
            });
        }),

    // Create a new workspace
    create: protectedProcedure
        .input(z.object({
            name: z.string().min(1),
        }))
        .mutation(async ({ input, ctx }) => {
            const [newWorkspace] = await db.insert(workspaceTable).values({
                name: input.name,
                owner_id: ctx.session.user.id,
            }).returning();

            return newWorkspace;
        }),
});
