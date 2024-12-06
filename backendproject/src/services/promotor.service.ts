import prisma from "../prisma";


export const findPromotor = async (data: string) => {
  return prisma.promotor.findFirst({
    where: {
      OR: [{ email: data }, { name: data }],
    },
  });
};
