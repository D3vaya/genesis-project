/**
 * @fileoverview Authentication state management with Zustand
 * @description Manages user authentication state, login/logout functionality, and user profile updates
 * @author Generated SaaS Template
 * @version 1.0.0
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { signIn, signOut, getSession } from 'next-auth/react'

/**
 * User interface for type safety
 * @interface User
 * @description Defines the structure of a user object
 * @property {string} id - Unique user identifier
 * @property {string} email - User's email address
 * @property {string} name - User's display name (optional)
 * @property {string} image - User's profile image URL (optional)
 */
interface User {
  id: string
  email: string
  name?: string | null
  image?: string | null
}

/**
 * Authentication store state interface
 * @interface AuthState
 * @description Defines the structure of the authentication store state
 * @property {User | null} user - Current authenticated user or null
 * @property {boolean} isAuthenticated - Whether user is currently authenticated
 * @property {boolean} isLoading - Whether authentication operation is in progress
 * @property {string | null} error - Current error message or null
 */
interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  
  // Actions
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  updateUser: (userData: Partial<User>) => void
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
  checkSession: () => Promise<void>
}

/**
 * Authentication store using Zustand
 * @description Global state management for user authentication
 * @type {import('zustand').StoreApi<AuthState>}
 * @example
 * ```typescript
 * import { useAuthStore } from '@/stores/authStore'
 * 
 * function LoginComponent() {
 *   const { login, isLoading, error } = useAuthStore()
 *   
 *   const handleLogin = async () => {
 *     const success = await login('user@example.com', 'password')
 *     if (success) {
 *       router.push('/dashboard')
 *     }
 *   }
 * }
 * ```
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      /**
       * Authenticates user with email and password
       * @function login
       * @description Attempts to sign in user using NextAuth credentials provider
       * @param {string} email - User's email address
       * @param {string} password - User's password
       * @returns {Promise<boolean>} Promise that resolves to true if login successful, false otherwise
       * @throws {Error} Sets error state if authentication fails
       * @example
       * ```typescript
       * const { login } = useAuthStore()
       * const success = await login('user@example.com', 'password123')
       * if (success) {
       *   console.log('Login successful!')
       * }
       * ```
       */
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null })

        try {
          const result = await signIn('credentials', {
            email,
            password,
            redirect: false,
          })

          if (result?.error) {
            set({ 
              error: 'Credenciales inválidas. Por favor, verifica tu email y contraseña.',
              isLoading: false 
            })
            return false
          }

          // Get session after successful sign in
          const session = await getSession()
          if (session?.user) {
            set({
              user: session.user as User,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            })
            return true
          }

          set({ 
            error: 'Error al obtener la sesión del usuario',
            isLoading: false 
          })
          return false

        } catch (error) {
          console.error('Login error:', error)
          set({ 
            error: 'Error de conexión. Por favor, intenta de nuevo.',
            isLoading: false 
          })
          return false
        }
      },

      /**
       * Signs out the current user
       * @function logout
       * @description Signs out user using NextAuth and clears authentication state
       * @returns {Promise<void>} Promise that resolves when logout is complete
       * @example
       * ```typescript
       * const { logout } = useAuthStore()
       * await logout()
       * console.log('User logged out')
       * ```
       */
      logout: async () => {
        set({ isLoading: true })
        
        try {
          await signOut({ redirect: false })
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          })
        } catch (error) {
          console.error('Logout error:', error)
          set({ isLoading: false })
        }
      },

      /**
       * Updates user profile information
       * @function updateUser
       * @description Updates the current user's profile data in the store
       * @param {Partial<User>} userData - Partial user data to update
       * @example
       * ```typescript
       * const { updateUser } = useAuthStore()
       * updateUser({ name: 'New Name', image: 'new-image-url.jpg' })
       * ```
       */
      updateUser: (userData: Partial<User>) => {
        const currentUser = get().user
        if (currentUser) {
          set({
            user: { ...currentUser, ...userData }
          })
        }
      },

      /**
       * Sets the current user
       * @function setUser
       * @description Directly sets the user state (used internally)
       * @param {User | null} user - User object or null to clear
       * @example
       * ```typescript
       * const { setUser } = useAuthStore()
       * setUser({ id: '1', email: 'user@example.com', name: 'User' })
       * ```
       */
      setUser: (user: User | null) => {
        set({
          user,
          isAuthenticated: !!user,
        })
      },

      /**
       * Sets loading state
       * @function setLoading
       * @description Updates the loading state of authentication operations
       * @param {boolean} loading - Loading state value
       * @example
       * ```typescript
       * const { setLoading } = useAuthStore()
       * setLoading(true) // Show loading spinner
       * ```
       */
      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },

      /**
       * Sets error message
       * @function setError
       * @description Sets an error message in the authentication state
       * @param {string | null} error - Error message or null to clear
       * @example
       * ```typescript
       * const { setError } = useAuthStore()
       * setError('Something went wrong')
       * ```
       */
      setError: (error: string | null) => {
        set({ error })
      },

      /**
       * Clears current error message
       * @function clearError
       * @description Clears the current error state
       * @example
       * ```typescript
       * const { clearError } = useAuthStore()
       * clearError() // Removes any error message
       * ```
       */
      clearError: () => {
        set({ error: null })
      },

      /**
       * Checks current session status
       * @function checkSession
       * @description Verifies current authentication session and updates state accordingly
       * @returns {Promise<void>} Promise that resolves when session check is complete
       * @example
       * ```typescript
       * const { checkSession } = useAuthStore()
       * await checkSession() // Updates auth state based on current session
       * ```
       */
      checkSession: async () => {
        set({ isLoading: true })
        
        try {
          const session = await getSession()
          
          if (session?.user) {
            set({
              user: session.user as User,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            })
          } else {
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: null,
            })
          }
        } catch (error) {
          console.error('Session check error:', error)
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: 'Error al verificar la sesión',
          })
        }
      },
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

/**
 * Selector hook for authenticated user
 * @function useUser
 * @description Custom hook to get current authenticated user
 * @returns {User | null} Current user or null if not authenticated
 * @example
 * ```typescript
 * import { useUser } from '@/stores/authStore'
 * 
 * function UserProfile() {
 *   const user = useUser()
 *   
 *   if (!user) return <div>Not authenticated</div>
 *   return <div>Hello, {user.name}!</div>
 * }
 * ```
 */
export const useUser = () => useAuthStore((state) => state.user)

/**
 * Selector hook for authentication status
 * @function useIsAuthenticated
 * @description Custom hook to check if user is authenticated
 * @returns {boolean} True if user is authenticated, false otherwise
 * @example
 * ```typescript
 * import { useIsAuthenticated } from '@/stores/authStore'
 * 
 * function ProtectedComponent() {
 *   const isAuthenticated = useIsAuthenticated()
 *   
 *   if (!isAuthenticated) {
 *     return <div>Please log in</div>
 *   }
 *   
 *   return <div>Welcome to protected content!</div>
 * }
 * ```
 */
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated)