import "dotenv/config"
import { PrismaClient } from "@prisma/client"
import { PrismaNeon } from "@prisma/adapter-neon"

const globalForPrisma = globalThis

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL,
})

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log: ["error"],
  })

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}

export default prisma
