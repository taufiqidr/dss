import { z } from "zod";
import { router, publicProcedure, adminProcedure } from "../trpc";

export const mahasiswaRouter = router({
  // public
  getAll: publicProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.prisma.mahasiswa.findMany({
        select: {
          id: true,
          nim: true,
          nama: true,
          jurusan: true,
          fakultas: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } catch (error) {
      console.log("error", error);
    }
  }),
  getOne: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.mahasiswa.findUnique({
          where: {
            id: input.id,
          },
          select: {
            id: true,
            nim: true,
            nama: true,
            jurusan: true,
            fakultas: true,
          },
        });
      } catch (error) {
        console.log("error", error);
      }
    }),

  postMahasiswa: adminProcedure
    .input(
      z.object({
        name: z.string(),
        nim: z.number(),
        jurusanId: z.string(),
        fakultasId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.mahasiswa.create({
          data: {
            nama: input.name,
            nim: input.nim,
            jurusanId: input.jurusanId,
            fakultasId: input.fakultasId,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),

  deleteMahasiswa: adminProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.mahasiswa.delete({
          where: {
            id: input.id,
          },
        });
      } catch (error) {
        console.log("error", error);
      }
    }),
  updateMahasiswa: adminProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        nim: z.number(),
        jurusanId: z.string(),
        fakultasId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.mahasiswa.update({
          where: {
            id: input.id,
          },
          data: {
            nama: input.name,
            nim: input.nim,
            jurusanId: input.jurusanId,
            fakultasId: input.fakultasId,
          },
        });
      } catch (error) {
        console.log("error", error);
      }
    }),
});
