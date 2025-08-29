/**
 * @fileoverview NextAuth.js configuration for authentication
 * @description Configures NextAuth with credentials provider and Prisma adapter
 * @author Generated SaaS Template
 * @version 1.0.0
 */

import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { compare } from 'bcryptjs'
import { prisma } from './prisma'

/**
 * NextAuth configuration options
 * @description Complete configuration for NextAuth with Prisma adapter and credentials provider
 * @type {NextAuthOptions}
 * @example
 * ```typescript
 * import { authOptions } from '@/lib/auth'
 * import NextAuth from 'next-auth'
 * 
 * export default NextAuth(authOptions)
 * ```
 */
export const authOptions: NextAuthOptions = {
  /**
   * Database adapter for NextAuth
   * @description Uses Prisma adapter to store sessions and users in database
   */
  adapter: PrismaAdapter(prisma) as any,
  
  /**
   * Authentication providers configuration
   * @description Configures credentials provider for email/password authentication
   */
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { 
          label: 'Email', 
          type: 'email',
          placeholder: 'usuario@ejemplo.com'
        },
        password: { 
          label: 'Password', 
          type: 'password',
          placeholder: 'Tu contraseña'
        }
      },
      /**
       * Authorize function for credentials provider
       * @description Validates user credentials against database
       * @param {Object} credentials - User credentials from login form
       * @param {string} credentials.email - User's email address
       * @param {string} credentials.password - User's password
       * @returns {Promise<Object|null>} User object if credentials are valid, null otherwise
       * @throws {Error} Throws error if database query fails
       * @example
       * ```typescript
       * const user = await authorize({
       *   email: 'user@example.com',
       *   password: 'password123'
       * })
       * ```
       */
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Find user by email
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email
            }
          })

          if (!user) {
            return null
          }

          // Verify password
          const isPasswordValid = await compare(credentials.password, user.password)

          if (!isPasswordValid) {
            return null
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          }
        } catch (error) {
          console.error('Authentication error:', error)
          return null
        }
      }
    })
  ],
  
  /**
   * Session configuration
   * @description Configures session strategy and maximum age
   */
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  /**
   * JWT configuration
   * @description Configures JWT token handling
   */
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  /**
   * Custom pages configuration
   * @description Overrides default NextAuth pages with custom ones
   */
  pages: {
    signIn: '/login',
  },
  
  /**
   * Callback functions for customizing NextAuth behavior
   * @description Customizes JWT and session handling
   */
  callbacks: {
    /**
     * JWT callback for customizing JWT token
     * @description Adds additional user information to JWT token
     * @param {Object} params - JWT callback parameters
     * @param {Object} params.token - Current JWT token
     * @param {Object} params.user - User object (only available on sign in)
     * @returns {Object} Modified JWT token
     * @example
     * ```typescript
     * // Token will include user ID and email
     * const token = {
     *   sub: user.id,
     *   email: user.email,
     *   name: user.name
     * }
     * ```
     */
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    
    /**
     * Session callback for customizing session object
     * @description Adds user ID to session object from JWT token
     * @param {Object} params - Session callback parameters
     * @param {Object} params.session - Current session object
     * @param {Object} params.token - Current JWT token
     * @returns {Object} Modified session object
     * @example
     * ```typescript
     * // Session will include user ID
     * const session = {
     *   user: {
     *     id: 'user-id',
     *     email: 'user@example.com',
     *     name: 'User Name'
     *   }
     * }
     * ```
     */
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
      }
      return session
    }
  },
  
  /**
   * Debug mode configuration
   * @description Enables debug mode in development
   */
  debug: process.env.NODE_ENV === 'development',
}

/**
 * Extended NextAuth user type
 * @description Extends the default NextAuth user type to include id
 * @interface ExtendedUser
 * @property {string} id - User's unique identifier
 * @property {string} email - User's email address
 * @property {string} name - User's display name
 * @property {string} image - User's profile image URL
 */
declare module 'next-auth' {
  interface User {
    id: string
  }
  
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
    }
  }
}