import { z } from "zod";
import { router, publicProcedure, adminProcedure } from "../trpc";

export const jurusanRouter = router({
  // public
  getAll: publicProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.prisma.jurusan.findMany({
        select: {
          id: true,
          nama_jurusan: true,
          fakultas: true,
          mahasiswa: true,
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
        return await ctx.prisma.jurusan.findUnique({
          where: {
            id: input.id,
          },
          select: {
            id: true,
            nama_jurusan: true,
            fakultas: true,
            mahasiswa: true,
          },
        });
      } catch (error) {
        console.log("error", error);
      }
    }),
  getByFakultas: publicProcedure
    .input(
      z.object({
        fakultasId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.jurusan.findMany({
          where: {
            fakultasId: input.fakultasId,
          },
          select: {
            id: true,
            nama_jurusan: true,
          },
        });
      } catch (error) {
        console.log("error", error);
      }
    }),

  postJurusan: adminProcedure
    .input(
      z.object({
        name: z.string(),
        fakultasId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.jurusan.create({
          data: {
            nama_jurusan: input.name,
            fakultasId: input.fakultasId,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),

  deleteJurusan: adminProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.jurusan.delete({
          where: {
            id: input.id,
          },
        });
      } catch (error) {
        console.log("error", error);
      }
    }),
  updateJurusan: adminProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        fakultasId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.jurusan.update({
          where: {
            id: input.id,
          },
          data: {
            nama_jurusan: input.name,
            fakultasId: input.fakultasId,
          },
        });
      } catch (error) {
        console.log("error", error);
      }
    }),
});
