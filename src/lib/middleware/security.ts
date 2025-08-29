import { NextRequest, NextResponse } from 'next/server'
import DOMPurify from 'isomorphic-dompurify'

export interface SecurityHeaders {
  'X-Content-Type-Options': string
  'X-Frame-Options': string
  'X-XSS-Protection': string
  'Referrer-Policy': string
  'Permissions-Policy': string
  'Strict-Transport-Security': string
  'Content-Security-Policy': string
}

export const defaultSecurityHeaders: SecurityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // Next.js needs these for dev
    "style-src 'self' 'unsafe-inline'", // Tailwind needs unsafe-inline
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self' https:",
    "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    'upgrade-insecure-requests',
  ].join('; '),
}

export function addSecurityHeaders(
  response: NextResponse,
  customHeaders?: Partial<SecurityHeaders>
): NextResponse {
  const headers = { ...defaultSecurityHeaders, ...customHeaders }

  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  return response
}

export function sanitizeObject(obj: any): any {
  if (typeof obj !== 'object' || obj === null) {
    return typeof obj === 'string' ? DOMPurify.sanitize(obj) : obj
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject)
  }

  const sanitized: any = {}
  for (const [key, value] of Object.entries(obj)) {
    sanitized[key] = sanitizeObject(value)
  }

  return sanitized
}

export function validateCSRF(request: NextRequest): boolean {
  if (['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
    return true // CSRF not needed for safe methods
  }

  const token =
    request.headers.get('x-csrf-token') ||
    request.headers.get('X-CSRF-Token') ||
    request.cookies.get('csrf-token')?.value

  const sessionToken =
    request.cookies.get('next-auth.session-token')?.value ||
    request.cookies.get('__Secure-next-auth.session-token')?.value

  if (!token || !sessionToken) {
    return false
  }

  // In a real implementation, you'd verify the CSRF token
  // For now, we just check that both exist
  return true
}

export async function securityMiddleware(
  request: NextRequest,
  handler: (request: NextRequest) => Promise<NextResponse> | NextResponse,
  options: {
    enableCSRF?: boolean
    sanitizeInput?: boolean
    customHeaders?: Partial<SecurityHeaders>
  } = {}
): Promise<NextResponse> {
  const {
    enableCSRF = false,
    sanitizeInput = true,
    customHeaders = {},
  } = options

  try {
    // CSRF validation for state-changing requests
    if (enableCSRF && !validateCSRF(request)) {
      return NextResponse.json(
        {
          message: 'Token CSRF inválido o faltante',
          success: false,
          error: 'CSRF_TOKEN_INVALID',
        },
        { status: 403 }
      )
    }

    // Sanitize request body if needed
    if (sanitizeInput && ['POST', 'PUT', 'PATCH'].includes(request.method)) {
      try {
        const body = await request.json().catch(() => null)
        if (body) {
          const sanitizedBody = sanitizeObject(body)
          // Create new request with sanitized body
          const newRequest = new NextRequest(request.url, {
            method: request.method,
            headers: request.headers,
            body: JSON.stringify(sanitizedBody),
          })
          const response = await handler(newRequest)
          return addSecurityHeaders(response, customHeaders)
        }
      } catch (error) {
        // If body parsing fails, continue with original request
      }
    }

    const response = await handler(request)
    return addSecurityHeaders(response, customHeaders)
  } catch (error) {
    console.error('Security middleware error:', error)
    const errorResponse = NextResponse.json(
      {
        message: 'Error de seguridad interno',
        success: false,
      },
      { status: 500 }
    )
    return addSecurityHeaders(errorResponse, customHeaders)
  }
}

export function withSecurity(
  handler: (request: NextRequest) => Promise<NextResponse> | NextResponse,
  options?: {
    enableCSRF?: boolean
    sanitizeInput?: boolean
    customHeaders?: Partial<SecurityHeaders>
  }
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    return securityMiddleware(request, handler, options)
  }
}

export function generateCSRFToken(): string {
  return crypto.randomUUID()
}

export function checkUserAgent(request: NextRequest): boolean {
  const userAgent = request.headers.get('user-agent') || ''

  // Block known bad user agents
  const blockedPatterns = [
    /curl/i,
    /wget/i,
    /python-requests/i,
    /bot/i, // Be careful with this one
  ]

  return !blockedPatterns.some(pattern => pattern.test(userAgent))
}

export function detectSuspiciousActivity(request: NextRequest): {
  suspicious: boolean
  reasons: string[]
} {
  const reasons: string[] = []

  // Check for suspicious headers
  const suspiciousHeaders = [
    'x-forwarded-for',
    'x-real-ip',
    'x-original-forwarded-for',
  ]
  suspiciousHeaders.forEach(header => {
    const value = request.headers.get(header)
    if (value && value.split(',').length > 3) {
      reasons.push(`Multiple forwarded IPs in ${header}`)
    }
  })

  // Check request size
  const contentLength = request.headers.get('content-length')
  if (contentLength && parseInt(contentLength) > 10 * 1024 * 1024) {
    // 10MB
    reasons.push('Request size too large')
  }

  // Check for SQL injection patterns in URL
  const url = request.url.toLowerCase()
  const sqlPatterns = [
    'union select',
    'drop table',
    'delete from',
    '1=1',
    'or 1=1',
    'and 1=1',
  ]

  if (sqlPatterns.some(pattern => url.includes(pattern))) {
    reasons.push('Potential SQL injection in URL')
  }

  return {
    suspicious: reasons.length > 0,
    reasons,
  }
}
