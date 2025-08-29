import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { formatValidationErrors } from '@/lib/validations'

export interface ApiError {
  message: string
  errors?: Record<string, string>
  code?: string
}

export class ValidationError extends Error {
  public errors: Record<string, string>
  public code: string

  constructor(errors: Record<string, string>, message = 'Validation failed') {
    super(message)
    this.errors = errors
    this.code = 'VALIDATION_ERROR'
    this.name = 'ValidationError'
  }
}

export function createValidationMiddleware<T>(schema: z.ZodSchema<T>) {
  return async (
    request: NextRequest,
    handler: (data: T) => Promise<NextResponse> | NextResponse
  ): Promise<NextResponse> => {
    try {
      const body = await request.json().catch(() => ({}))

      const result = schema.safeParse(body)

      if (!result.success) {
        const errors = formatValidationErrors(result.error)
        return NextResponse.json(
          {
            message: 'Datos inválidos',
            errors,
            success: false,
          } as ApiError & { success: boolean },
          { status: 400 }
        )
      }

      return await handler(result.data)
    } catch (error) {
      if (error instanceof ValidationError) {
        return NextResponse.json(
          {
            message: error.message,
            errors: error.errors,
            success: false,
          } as ApiError & { success: boolean },
          { status: 400 }
        )
      }

      console.error('Validation middleware error:', error)
      return NextResponse.json(
        {
          message: 'Error interno del servidor',
          success: false,
        } as ApiError & { success: boolean },
        { status: 500 }
      )
    }
  }
}

export function withValidation<T>(
  schema: z.ZodSchema<T>,
  handler: (
    data: T,
    request: NextRequest
  ) => Promise<NextResponse> | NextResponse
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const middleware = createValidationMiddleware(schema)
    return middleware(request, data => handler(data, request))
  }
}

export function validateSearchParams(
  request: NextRequest,
  schema: z.ZodSchema
): { data: any; error: NextResponse | null } {
  const searchParams = request.nextUrl.searchParams
  const params: Record<string, string> = {}

  searchParams.forEach((value, key) => {
    params[key] = value
  })

  const result = schema.safeParse(params)

  if (!result.success) {
    const errors = formatValidationErrors(result.error)
    return {
      data: null,
      error: NextResponse.json(
        {
          message: 'Parámetros de consulta inválidos',
          errors,
          success: false,
        } as ApiError & { success: boolean },
        { status: 400 }
      ),
    }
  }

  return { data: result.data, error: null }
}

export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim()
}
