import { z } from "zod";
import { router, publicProcedure, adminProcedure } from "../trpc";

export const fakultasRouter = router({
  // public
  getAll: publicProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.prisma.fakultas.findMany({
        select: {
          id: true,
          nama_fakultas: true,
          jurusan: true,
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
        return await ctx.prisma.fakultas.findUnique({
          where: {
            id: input.id,
          },
          select: {
            id: true,
            nama_fakultas: true,
            jurusan: true,
            mahasiswa: true,
          },
        });
      } catch (error) {
        console.log("error", error);
      }
    }),

  postFakultas: adminProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.fakultas.create({
          data: {
            nama_fakultas: input.name,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),

  deleteFakultas: adminProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.fakultas.delete({
          where: {
            id: input.id,
          },
        });
      } catch (error) {
        console.log("error", error);
      }
    }),
  updateFakultas: adminProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.fakultas.update({
          where: {
            id: input.id,
          },
          data: {
            nama_fakultas: input.name,
          },
        });
      } catch (error) {
        console.log("error", error);
      }
    }),
});
