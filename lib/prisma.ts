import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

function createPrismaClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })
}

export const getPrismaClient = () => {
  if (process.env.NODE_ENV === 'production') {
    return createPrismaClient()
  }
  
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient()
  }
  
  return globalForPrisma.prisma
}

// Also export a default instance for convenience
export const prisma = getPrismaClient()
export default prisma