import { createTRPCRouter } from "~/server/api/trpc";
import { tracksRouter } from "~/server/api/routers/tracks";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  tracks: tracksRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
