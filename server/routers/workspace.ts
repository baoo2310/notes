import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { db } from '@/db';
import { workspaceTable } from '@/db/workspace';
import { eq } from 'drizzle-orm';

export const workspaceRouter = router({
    // Get all workspaces (in a real app, this would filter by the logged-in user)
    getAll: publicProcedure.query(async () => {
        return await db.query.workspaceTable.findMany({
            with: {
                owner: true,
                pages: true,
            },
        });
    }),

    // Get a single workspace by ID
    getById: publicProcedure
        .input(z.object({ id: z.string().uuid() }))
        .query(async ({ input }) => {
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
    create: publicProcedure
        .input(z.object({
            name: z.string().min(1),
            owner_id: z.string().uuid(),
        }))
        .mutation(async ({ input }) => {
            const [newWorkspace] = await db.insert(workspaceTable).values({
                name: input.name,
                owner_id: input.owner_id,
            }).returning();

            return newWorkspace;
        }),
});
