import { router, publicProcedure } from './trpc';
import { workspaceRouter } from './routers/workspace';
import { pageRouter } from './routers/page';

export const appRouter = router({
    hello: publicProcedure.query(() => {
        return 'Hello from tRPC!';
    }),

    // Attach our new routers
    workspace: workspaceRouter,
    page: pageRouter,
});

export type AppRouter = typeof appRouter;
