/**
 * @fileoverview Next.js middleware for route protection and authentication
 * @description Provides route protection, authentication checks, and request/response handling using NextAuth
 * @author Generated SaaS Template
 * @version 1.0.0
 */

import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Protected routes configuration
 * @const {string[]} PROTECTED_ROUTES
 * @description Array of route patterns that require authentication
 */
const PROTECTED_ROUTES = [
  '/dashboard',
  '/dashboard/:path*',
  '/profile',
  '/settings',
  '/api/protected/:path*',
]

/**
 * Public routes that don't require authentication
 * @const {string[]} PUBLIC_ROUTES
 * @description Array of route patterns that are publicly accessible
 */
const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/register',
  '/api/auth/:path*',
  '/api/health',
  '/_next/:path*',
  '/favicon.ico',
]

/**
 * Admin-only routes
 * @const {string[]} ADMIN_ROUTES
 * @description Array of route patterns that require admin privileges
 */
const ADMIN_ROUTES = ['/admin', '/admin/:path*', '/api/admin/:path*']

/**
 * Route matching utility function
 * @function matchRoute
 * @description Checks if a given pathname matches any route pattern
 * @param {string} pathname - The pathname to check
 * @param {string[]} routes - Array of route patterns to match against
 * @returns {boolean} True if pathname matches any route pattern
 * @example
 * ```typescript
 * const isProtected = matchRoute('/dashboard/users', PROTECTED_ROUTES)
 * const isPublic = matchRoute('/login', PUBLIC_ROUTES)
 * ```
 */
function matchRoute(pathname: string, routes: string[]): boolean {
  return routes.some(route => {
    // Convert route pattern to regex
    const pattern = route
      .replace(/:[^/]+/g, '[^/]+') // Replace :param with [^/]+
      .replace(/\*/g, '.*') // Replace * with .*
      .replace(/\//g, '\\/') // Escape forward slashes

    const regex = new RegExp(`^${pattern}$`)
    return regex.test(pathname)
  })
}

/**
 * Check if route is public (doesn't require authentication)
 * @function isPublicRoute
 * @description Determines if a route is publicly accessible
 * @param {string} pathname - The pathname to check
 * @returns {boolean} True if route is public
 * @example
 * ```typescript
 * if (isPublicRoute('/login')) {
 *   // Allow access without authentication
 * }
 * ```
 */
function isPublicRoute(pathname: string): boolean {
  return matchRoute(pathname, PUBLIC_ROUTES)
}

/**
 * Check if route is protected (requires authentication)
 * @function isProtectedRoute
 * @description Determines if a route requires authentication
 * @param {string} pathname - The pathname to check
 * @returns {boolean} True if route is protected
 * @example
 * ```typescript
 * if (isProtectedRoute('/dashboard')) {
 *   // Require authentication
 * }
 * ```
 */
function isProtectedRoute(pathname: string): boolean {
  return matchRoute(pathname, PROTECTED_ROUTES)
}

/**
 * Check if route requires admin privileges
 * @function isAdminRoute
 * @description Determines if a route requires admin privileges
 * @param {string} pathname - The pathname to check
 * @returns {boolean} True if route requires admin privileges
 * @example
 * ```typescript
 * if (isAdminRoute('/admin/users')) {
 *   // Require admin privileges
 * }
 * ```
 */
function isAdminRoute(pathname: string): boolean {
  return matchRoute(pathname, ADMIN_ROUTES)
}

/**
 * Custom middleware function for additional logic
 * @function customMiddleware
 * @description Handles custom middleware logic before NextAuth middleware
 * @param {NextRequest} request - The incoming request
 * @returns {NextResponse | undefined} Response or undefined to continue
 * @example
 * ```typescript
 * // This function runs before authentication checks
 * // Can be used for logging, rate limiting, etc.
 * ```
 */
function customMiddleware(request: NextRequest): NextResponse | undefined {
  const { pathname, origin } = request.nextUrl

  // Add security headers
  const response = NextResponse.next()

  // Add security headers to all responses
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('X-XSS-Protection', '1; mode=block')

  // Add CSP header for better security
  const cspHeader = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self'",
    "connect-src 'self'",
    "frame-ancestors 'none'",
  ].join('; ')

  response.headers.set('Content-Security-Policy', cspHeader)

  // Log requests in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`🔒 Middleware: ${request.method} ${pathname}`)
  }

  // Handle CORS for API routes
  if (pathname.startsWith('/api/')) {
    response.headers.set('Access-Control-Allow-Origin', origin)
    response.headers.set(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, OPTIONS'
    )
    response.headers.set(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization'
    )

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, { status: 200, headers: response.headers })
    }
  }

  // Rate limiting (simple implementation)
  const ip =
    request.headers.get('x-forwarded-for') ??
    request.headers.get('x-real-ip') ??
    'unknown'
  const now = Date.now()

  // In a real application, you'd want to use Redis or a database for this
  // This is just a demonstration
  if (pathname.startsWith('/api/auth/register')) {
    // Add rate limiting logic here if needed
    console.log(
      `Registration attempt from IP: ${ip} at ${new Date(now).toISOString()}`
    )
  }

  return response
}

/**
 * NextAuth middleware configuration with custom logic
 * @description Main middleware function that combines NextAuth with custom logic
 * @param {NextRequest} request - The incoming request
 * @returns {Promise<NextResponse>} The response after middleware processing
 */
export default withAuth(
  function middleware(request) {
    const { pathname, origin } = request.nextUrl
    const token = request.nextauth.token

    // Run custom middleware first
    const customResponse = customMiddleware(request)
    if (customResponse) {
      return customResponse
    }

    // Handle public routes - allow access
    if (isPublicRoute(pathname)) {
      // If user is authenticated and trying to access login/register, redirect to dashboard
      if (token && (pathname === '/login' || pathname === '/register')) {
        return NextResponse.redirect(new URL('/dashboard', origin))
      }

      return NextResponse.next()
    }

    // Handle admin routes
    if (isAdminRoute(pathname)) {
      // Check if user has admin role (this would come from your user data)
      // For now, we'll assume no admin role system is implemented
      // You can extend this by adding role information to the JWT token

      if (!token) {
        // Redirect to login if not authenticated
        const loginUrl = new URL('/login', origin)
        loginUrl.searchParams.set('callbackUrl', pathname)
        return NextResponse.redirect(loginUrl)
      }

      // In a real app, check for admin role here
      // if (!token.role === 'admin') {
      //   return NextResponse.redirect(new URL('/dashboard', origin))
      // }

      return NextResponse.next()
    }

    // Handle protected routes
    if (isProtectedRoute(pathname)) {
      if (!token) {
        // Redirect to login if not authenticated
        const loginUrl = new URL('/login', origin)
        loginUrl.searchParams.set('callbackUrl', pathname)
        return NextResponse.redirect(loginUrl)
      }

      return NextResponse.next()
    }

    // For any other route, allow access
    return NextResponse.next()
  },
  {
    callbacks: {
      /**
       * Authorization callback for NextAuth middleware
       * @function authorized
       * @description Determines if user is authorized to access the route
       * @param {Object} params - Authorization parameters
       * @param {Object} params.token - NextAuth JWT token
       * @param {NextRequest} params.req - The incoming request
       * @returns {boolean} True if user is authorized
       * @example
       * ```typescript
       * // This callback is called for every request
       * // Return true to allow access, false to deny
       * ```
       */
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl

        // Always allow access to public routes
        if (isPublicRoute(pathname)) {
          return true
        }

        // For protected routes, require authentication
        if (isProtectedRoute(pathname) || isAdminRoute(pathname)) {
          return !!token
        }

        // For all other routes, allow access
        return true
      },
    },
    pages: {
      signIn: '/login',
      signOut: '/login',
      error: '/login',
    },
  }
)

/**
 * Middleware configuration object
 * @const {Object} config
 * @description Defines which paths the middleware should run on
 * @property {string[]} matcher - Array of path patterns to match
 * @example
 * ```typescript
 * // Middleware will run on all routes except static files and Next.js internals
 * export const config = {
 *   matcher: [
 *     '/((?!_next/static|_next/image|favicon.ico).*)',
 *   ],
 * }
 * ```
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
    '/api/protected/:path*',
    '/api/admin/:path*',
  ],
}
