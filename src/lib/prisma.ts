/**
 * @fileoverview Prisma client configuration and singleton instance
 * @description Provides a singleton Prisma client instance to prevent multiple connections in development
 * @author Generated SaaS Template
 * @version 1.0.0
 */

import { PrismaClient } from '../generated/prisma'

/**
 * Global variable to store Prisma client instance in development
 * @description Prevents multiple Prisma client instances during hot reloads in development
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

/**
 * Prisma client singleton instance
 * @description Creates a single PrismaClient instance that persists across hot reloads
 * @example
 * ```typescript
 * import { prisma } from '@/lib/prisma'
 *
 * const user = await prisma.user.findUnique({
 *   where: { email: 'user@example.com' }
 * })
 * ```
 */
export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

/**
 * Connects to the database
 * @description Establishes a connection to the database and handles connection errors
 * @returns {Promise<void>} Promise that resolves when connection is established
 * @throws {Error} Throws error if connection fails
 * @example
 * ```typescript
 * await connectDB()
 * console.log('Database connected successfully')
 * ```
 */
export async function connectDB(): Promise<void> {
  try {
    await prisma.$connect()
    console.log('Database connected successfully')
  } catch (error) {
    console.error('Failed to connect to database:', error)
    throw error
  }
}

/**
 * Disconnects from the database
 * @description Properly closes the database connection
 * @returns {Promise<void>} Promise that resolves when disconnection is complete
 * @example
 * ```typescript
 * await disconnectDB()
 * console.log('Database disconnected')
 * ```
 */
export async function disconnectDB(): Promise<void> {
  await prisma.$disconnect()
}
