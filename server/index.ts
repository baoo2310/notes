import { router, publicProcedure } from './trpc';
import { workspaceRouter } from './routers/workspace';
import { pageRouter } from './routers/page';
import { adminRouter } from './routers/admin';
import { settingsRouter } from './routers/settings';

export const appRouter = router({
    hello: publicProcedure.query(() => {
        return 'Hello from tRPC!';
    }),

    // Attach our new routers
    workspace: workspaceRouter,
    page: pageRouter,
    admin: adminRouter,
    settings: settingsRouter,
});

export type AppRouter = typeof appRouter;
