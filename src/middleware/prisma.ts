import { Prisma, PrismaClient } from "@prisma/client";

const prisma: PrismaClient<Prisma.PrismaClientOptions, never, Prisma.RejectOnNotFound | Prisma.RejectPerOperation> = new PrismaClient();

export default prisma;