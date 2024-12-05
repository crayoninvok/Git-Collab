import prisma from "../prisma";


export const findUser = async (data: string) => {
  return prisma.user.findFirst({
    where: {
      OR: [{ email: data }, { username: data }],
    },
  });
};
