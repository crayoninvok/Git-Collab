import { PrismaClient,Prisma } from "@prisma/client";

export default new PrismaClient({log: ['query', 'info', 'error']})