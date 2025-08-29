/**
 * @fileoverview Script to verify test user credentials
 * @description Checks if the test user exists and validates password hashing
 */

import { PrismaClient } from '../src/generated/prisma'
import { compare } from 'bcryptjs'

const prisma = new PrismaClient()

async function verifyUser() {
  console.log('🔍 Verificando usuario de prueba...')
  
  try {
    // Find the test user
    const user = await prisma.user.findUnique({
      where: { email: 'usuario@ejemplo.com' }
    })

    if (!user) {
      console.log('❌ Usuario no encontrado')
      return
    }

    console.log('✅ Usuario encontrado:')
    console.log('   ID:', user.id)
    console.log('   Email:', user.email)
    console.log('   Name:', user.name)
    console.log('   Created:', user.createdAt.toISOString())
    
    // Verify password
    const testPassword = 'password123'
    const isPasswordValid = await compare(testPassword, user.password)
    
    if (isPasswordValid) {
      console.log('✅ Password verification: OK')
      console.log('\n🎉 Credenciales válidas para login!')
      console.log('   Email: usuario@ejemplo.com')
      console.log('   Password: password123')
    } else {
      console.log('❌ Password verification: FAILED')
    }

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

verifyUser()