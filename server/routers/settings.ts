import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { db } from '@/db';
import { usersTable } from '@/db/user';
import { eq } from 'drizzle-orm';

export const settingsRouter = router({
    getProfile: protectedProcedure.query(async ({ ctx }) => {
        return await db.query.usersTable.findFirst({
            where: eq(usersTable.id, ctx.session.user.id),
            columns: {
                id: true,
                name: true,
                email: true,
                image: true,
                bio: true,
                role: true,
                createdAt: true,
            },
        });
    }),

    updateProfile: protectedProcedure
        .input(z.object({
            name: z.string().min(1).max(255).optional(),
            bio: z.string().max(500).optional(),
        }))
        .mutation(async ({ input, ctx }) => {
            const [updated] = await db.update(usersTable)
                .set({
                    name: input.name,
                    bio: input.bio,
                    updatedAt: new Date(),
                })
                .where(eq(usersTable.id, ctx.session.user.id))
                .returning();
            return updated;
        }),
});
