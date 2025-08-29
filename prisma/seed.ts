/**
 * @fileoverview Prisma database seed script
 * @description Seeds the database with test data including a test user with login credentials
 * @author Generated SaaS Template
 * @version 1.0.0
 */

import { PrismaClient } from '../src/generated/prisma'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

/**
 * Main seed function
 * @description Seeds the database with initial test data
 */
async function main() {
  console.log('🌱 Starting database seed...')

  try {
    // Create test user with the credentials shown in the login form
    const testUserEmail = 'usuario@ejemplo.com'
    const testUserPassword = 'password123'
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: testUserEmail }
    })

    if (existingUser) {
      console.log(`👤 User ${testUserEmail} already exists, skipping...`)
    } else {
      // Hash the password
      const hashedPassword = await hash(testUserPassword, 12)
      
      // Create the test user
      const testUser = await prisma.user.create({
        data: {
          email: testUserEmail,
          name: 'Usuario de Prueba',
          password: hashedPassword,
        }
      })

      console.log(`✅ Created test user: ${testUser.email}`)
      console.log(`🔑 Login credentials:`)
      console.log(`   Email: ${testUserEmail}`)
      console.log(`   Password: ${testUserPassword}`)
    }

    // You can add more seed data here as needed
    // For example: sample products, categories, etc.

    console.log('🎉 Database seed completed successfully!')
    
  } catch (error) {
    console.error('❌ Error during database seed:', error)
    throw error
  }
}

/**
 * Execute the seed function
 */
main()
  .catch((e) => {
    console.error('💥 Seed script failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    console.log('📝 Database connection closed')
  })