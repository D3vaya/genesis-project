import { POST } from '../../app/api/auth/register/route'
import { NextRequest } from 'next/server'
import { hash } from 'bcryptjs'
import { prisma } from '../../lib/prisma'
import { registerSchema } from '../../lib/validations'

// Mock external dependencies
jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
}))

jest.mock('../../lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}))

jest.mock('../../lib/validations', () => ({
  registerSchema: {
    safeParse: jest.fn(),
  },
}))

const mockHash = hash as jest.MockedFunction<typeof hash>
const mockPrisma = prisma as jest.Mocked<typeof prisma>
const mockRegisterSchema = registerSchema as jest.Mocked<typeof registerSchema>

describe('/api/auth/register', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('creates a new user successfully', async () => {
    const requestBody = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123',
    }

    const mockUser = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      createdAt: new Date(),
    }

    // Mock successful validation
    mockRegisterSchema.safeParse.mockReturnValue({
      success: true,
      data: requestBody,
    } as any)

    // Mock user doesn't exist
    mockPrisma.user.findUnique.mockResolvedValue(null)

    // Mock password hashing
    mockHash.mockResolvedValue('hashedPassword' as never)

    // Mock user creation
    mockPrisma.user.create.mockResolvedValue(mockUser as any)

    const request = new NextRequest('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(201)
    expect(data.message).toBe('Usuario creado exitosamente')
    expect(data.user).toMatchObject({
      id: mockUser.id,
      name: mockUser.name,
      email: mockUser.email,
    })
    expect(mockPrisma.user.create).toHaveBeenCalledWith({
      data: {
        name: requestBody.name,
        email: requestBody.email,
        password: 'hashedPassword',
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    })
  })

  it('returns 400 for invalid data', async () => {
    const requestBody = {
      email: 'invalid-email',
      password: '123',
    }

    // Mock validation failure
    mockRegisterSchema.safeParse.mockReturnValue({
      success: false,
      error: {
        format: () => ({
          email: { _errors: ['Invalid email'] },
          password: { _errors: ['Password too short'] },
        }),
      },
    } as any)

    const request = new NextRequest('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.message).toBe('Datos de registro inválidos')
    expect(data.errors).toBeDefined()
  })

  it('returns 409 for existing user', async () => {
    const requestBody = {
      name: 'Test User',
      email: 'existing@example.com',
      password: 'password123',
      confirmPassword: 'password123',
    }

    // Mock successful validation
    mockRegisterSchema.safeParse.mockReturnValue({
      success: true,
      data: requestBody,
    } as any)

    // Mock existing user
    mockPrisma.user.findUnique.mockResolvedValue({
      id: '1',
      email: 'existing@example.com',
    } as any)

    const request = new NextRequest('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(409)
    expect(data.message).toBe('Un usuario con este email ya existe')
    expect(mockPrisma.user.create).not.toHaveBeenCalled()
  })

  it('returns 500 for server errors', async () => {
    const requestBody = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123',
    }

    // Mock successful validation
    mockRegisterSchema.safeParse.mockReturnValue({
      success: true,
      data: requestBody,
    } as any)

    // Mock database error
    mockPrisma.user.findUnique.mockRejectedValue(new Error('Database error'))

    const request = new NextRequest('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.message).toBe('Error interno del servidor')
  })

  it('handles JSON parsing errors gracefully', async () => {
    const request = new NextRequest('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: 'invalid json',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.message).toBe('Error interno del servidor')
  })

  it('validates password requirements', async () => {
    const requestBody = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'weak', // weak password
      confirmPassword: 'weak',
    }

    // Mock validation failure for weak password
    mockRegisterSchema.safeParse.mockReturnValue({
      success: false,
      error: {
        format: () => ({
          password: { _errors: ['Password must be at least 8 characters'] },
        }),
      },
    } as any)

    const request = new NextRequest('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.message).toBe('Datos de registro inválidos')
    expect(mockPrisma.user.create).not.toHaveBeenCalled()
  })

  it('validates email format', async () => {
    const requestBody = {
      name: 'Test User',
      email: 'not-an-email', // invalid email
      password: 'password123',
      confirmPassword: 'password123',
    }

    // Mock validation failure for invalid email
    mockRegisterSchema.safeParse.mockReturnValue({
      success: false,
      error: {
        format: () => ({
          email: { _errors: ['Please enter a valid email'] },
        }),
      },
    } as any)

    const request = new NextRequest('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.message).toBe('Datos de registro inválidos')
  })

  it('validates password confirmation match', async () => {
    const requestBody = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'differentpassword', // passwords don't match
    }

    // Mock validation failure for password mismatch
    mockRegisterSchema.safeParse.mockReturnValue({
      success: false,
      error: {
        format: () => ({
          confirmPassword: { _errors: ['Passwords do not match'] },
        }),
      },
    } as any)

    const request = new NextRequest('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.message).toBe('Datos de registro inválidos')
  })
})
