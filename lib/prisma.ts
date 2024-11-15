
import { PrismaClient } from "@prisma/client"

const PrismaClientSingleton = () => {
    return new PrismaClient()
}

type PrismaClientSingleton = ReturnType<typeof PrismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
    prisma?: PrismaClientSingleton | undefined
}

const prisma = globalForPrisma.prisma ?? PrismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma