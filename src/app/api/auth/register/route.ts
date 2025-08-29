/**
 * @fileoverview User registration API route
 * @description Handles user registration with password hashing and validation
 * @author Generated SaaS Template
 * @version 1.0.0
 */

import { NextRequest, NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { registerSchema } from '@/lib/validations'

/**
 * POST handler for user registration
 * @description Creates a new user account with hashed password
 * @function POST
 * @param {NextRequest} request - Incoming HTTP POST request
 * @returns {Promise<NextResponse>} JSON response with success/error message
 * @throws {Error} Returns 400 for validation errors, 409 for existing users, 500 for server errors
 * @example
 * ```typescript
 * // Request body:
 * {
 *   "name": "Juan Pérez",
 *   "email": "juan@ejemplo.com",
 *   "password": "contraseña123",
 *   "confirmPassword": "contraseña123"
 * }
 *
 * // Success response:
 * {
 *   "message": "Usuario creado exitosamente",
 *   "user": {
 *     "id": "user-id",
 *     "name": "Juan Pérez",
 *     "email": "juan@ejemplo.com"
 *   }
 * }
 * ```
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate request body
    const result = registerSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        {
          message: 'Datos de registro inválidos',
          errors: result.error.format(),
        },
        { status: 400 }
      )
    }

    const { name, email, password } = result.data

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { message: 'Un usuario con este email ya existe' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    })

    return NextResponse.json(
      {
        message: 'Usuario creado exitosamente',
        user,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
