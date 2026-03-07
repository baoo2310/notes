import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { db } from '@/db';
import { usersTable } from '@/db/user';
import { workspaceTable } from '@/db/workspace';
import { pageTable } from '@/db/page';
import { eq, sql } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';

/** Middleware that checks the user has the "admin" role. */
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
    // @ts-ignore — role exists on usersTable but not in the session type
    if ((ctx.session.user as any).role !== 'admin') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
    }
    return next({ ctx });
});

export const adminRouter = router({
    // Get all users with basic info
    getAllUsers: adminProcedure.query(async () => {
        return await db.select({
            id: usersTable.id,
            name: usersTable.name,
            email: usersTable.email,
            image: usersTable.image,
            role: usersTable.role,
            createdAt: usersTable.createdAt,
        }).from(usersTable);
    }),

    // Get aggregate stats
    getStats: adminProcedure.query(async () => {
        const [userCount] = await db.select({ count: sql<number>`count(*)` }).from(usersTable);
        const [wsCount] = await db.select({ count: sql<number>`count(*)` }).from(workspaceTable);
        const [pageCount] = await db.select({ count: sql<number>`count(*)` }).from(pageTable);

        return {
            users: Number(userCount.count),
            workspaces: Number(wsCount.count),
            pages: Number(pageCount.count),
        };
    }),
});
