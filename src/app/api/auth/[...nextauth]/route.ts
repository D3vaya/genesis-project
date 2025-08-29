/**
 * @fileoverview NextAuth.js API route handler
 * @description Handles all NextAuth API routes for authentication
 * @author Generated SaaS Template
 * @version 1.0.0
 */

import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

/**
 * NextAuth handler instance
 * @description Creates NextAuth handler with configured options
 * @const {Object} handler
 * @example
 * ```typescript
 * // This handler automatically handles:
 * // GET /api/auth/signin
 * // POST /api/auth/signin
 * // GET /api/auth/signout
 * // POST /api/auth/signout
 * // GET /api/auth/session
 * // GET /api/auth/providers
 * // GET /api/auth/csrf
 * ```
 */
const handler = NextAuth(authOptions)

/**
 * Export GET handler for NextAuth API routes
 * @description Handles GET requests to NextAuth endpoints
 * @function GET
 * @param {Request} request - Incoming HTTP GET request
 * @returns {Response} NextAuth response for GET requests
 */
export { handler as GET }

/**
 * Export POST handler for NextAuth API routes
 * @description Handles POST requests to NextAuth endpoints
 * @function POST
 * @param {Request} request - Incoming HTTP POST request
 * @returns {Response} NextAuth response for POST requests
 */
export { handler as POST }
