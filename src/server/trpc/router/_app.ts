import { router } from "../trpc";
import { fakultasRouter } from "./fakultas";

export const appRouter = router({
  fakultas: fakultasRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
