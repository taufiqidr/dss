import { router } from "../trpc";
import { fakultasRouter } from "./fakultas";
import { jurusanRouter } from "./jurusan";
import { mahasiswaRouter } from "./mahasiswa";

export const appRouter = router({
  fakultas: fakultasRouter,
  jurusan: jurusanRouter,
  mahasiswa: mahasiswaRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
