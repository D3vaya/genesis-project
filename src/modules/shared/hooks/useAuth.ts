/**
 * @fileoverview Custom authentication hook with comprehensive auth state management
 * @description Provides a convenient interface for authentication state and actions using Zustand store
 * @author Generated SaaS Template
 * @version 1.0.0
 */

import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { useAuthStore } from '@/modules/shared/stores/authStore'

/**
 * Authentication hook return type
 * @interface UseAuthReturn
 * @description Defines the structure of the useAuth hook return value
 * @property {Object} user - Current authenticated user object or null
 * @property {boolean} isAuthenticated - Whether user is currently authenticated
 * @property {boolean} isLoading - Whether authentication operation is in progress
 * @property {string | null} error - Current error message or null
 * @property {Function} login - Function to authenticate user with email and password
 * @property {Function} logout - Function to sign out current user
 * @property {Function} updateUser - Function to update user profile information
 * @property {Function} clearError - Function to clear current error state
 * @property {Function} checkSession - Function to verify current session status
 */
interface UseAuthReturn {
  user: {
    id: string
    email: string
    name?: string | null
    image?: string | null
  } | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  updateUser: (userData: any) => void // eslint-disable-line @typescript-eslint/no-explicit-any
  clearError: () => void
  checkSession: () => Promise<void>
}

/**
 * Custom authentication hook
 * @hook useAuth
 * @description Provides comprehensive authentication state management and actions
 * @returns {UseAuthReturn} Authentication state and actions object
 * @example
 * ```typescript
 * import { useAuth } from '@/hooks/useAuth'
 *
 * function LoginComponent() {
 *   const { user, isAuthenticated, isLoading, error, login, logout } = useAuth()
 *
 *   const handleLogin = async (email: string, password: string) => {
 *     const success = await login(email, password)
 *     if (success) {
 *       console.log('Login successful!')
 *     }
 *   }
 *
 *   if (isLoading) return <div>Loading...</div>
 *
 *   if (isAuthenticated) {
 *     return (
 *       <div>
 *         <h1>Welcome, {user?.name}!</h1>
 *         <button onClick={logout}>Logout</button>
 *       </div>
 *     )
 *   }
 *
 *   return (
 *     <div>
 *       {error && <p style={{ color: 'red' }}>{error}</p>}
 *       <button onClick={() => handleLogin('user@example.com', 'password')}>
 *         Login
 *       </button>
 *     </div>
 *   )
 * }
 * ```
 */
export const useAuth = (): UseAuthReturn => {
  const { data: session, status } = useSession()
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    updateUser,
    clearError,
    checkSession,
    setUser,
    setLoading,
  } = useAuthStore()

  /**
   * Synchronize NextAuth session with Zustand store
   * @description Updates Zustand auth store when NextAuth session changes
   * @effect
   * @example
   * ```typescript
   * // This effect automatically:
   * // 1. Updates store when session changes
   * // 2. Sets loading state during session checks
   * // 3. Clears user data when session expires
   * ```
   */
  useEffect(() => {
    if (status === 'loading') {
      setLoading(true)
      return
    }

    setLoading(false)

    if (status === 'authenticated' && session?.user) {
      // Update store with session user data
      setUser({
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        image: session.user.image,
      })
    } else if (status === 'unauthenticated') {
      // Clear user data when not authenticated
      setUser(null)
    }
  }, [session, status, setUser, setLoading])

  /**
   * Enhanced login function with session management
   * @function enhancedLogin
   * @description Wraps store login with additional session management
   * @param {string} email - User's email address
   * @param {string} password - User's password
   * @returns {Promise<boolean>} Promise resolving to login success status
   * @example
   * ```typescript
   * const success = await enhancedLogin('user@example.com', 'password123')
   * if (success) {
   *   console.log('User logged in successfully')
   * }
   * ```
   */
  const enhancedLogin = async (
    email: string,
    password: string
  ): Promise<boolean> => {
    const success = await login(email, password)

    // Additional login logic could be added here
    if (success) {
      // Could trigger additional actions like analytics tracking
      console.log('Login successful for user:', email)
    }

    return success
  }

  /**
   * Enhanced logout function with cleanup
   * @function enhancedLogout
   * @description Wraps store logout with additional cleanup logic
   * @returns {Promise<void>} Promise resolving when logout is complete
   * @example
   * ```typescript
   * await enhancedLogout()
   * console.log('User logged out and cleanup completed')
   * ```
   */
  const enhancedLogout = async (): Promise<void> => {
    await logout()

    // Additional cleanup logic could be added here
    // For example: clear cached data, analytics tracking, etc.
    console.log('Logout completed with cleanup')
  }

  /**
   * Check if user has specific permission (placeholder for future implementation)
   * @function hasPermission
   * @description Checks if current user has specific permission
   * @param {string} permission - Permission to check
   * @returns {boolean} Whether user has the permission
   * @example
   * ```typescript
   * const canDelete = hasPermission('delete_user')
   * if (canDelete) {
   *   // Show delete button
   * }
   * ```
   */
  const hasPermission = (permission: string): boolean => {
    console.log('hasPermission', permission)
    // This is a placeholder - implement based on your permission system
    // For now, return true for authenticated users
    return isAuthenticated
  }

  /**
   * Check if user has specific role (placeholder for future implementation)
   * @function hasRole
   * @description Checks if current user has specific role
   * @param {string} role - Role to check
   * @returns {boolean} Whether user has the role
   * @example
   * ```typescript
   * const isAdmin = hasRole('admin')
   * if (isAdmin) {
   *   // Show admin panel
   * }
   * ```
   */
  const hasRole = (role: string): boolean => {
    console.log('hasRole', role)
    // This is a placeholder - implement based on your role system
    // For now, return true for authenticated users
    return isAuthenticated
  }

  /**
   * Get user display name
   * @function getUserDisplayName
   * @description Returns appropriate display name for user
   * @returns {string} User's display name or fallback
   * @example
   * ```typescript
   * const displayName = getUserDisplayName()
   * console.log(`Hello, ${displayName}!`)
   * ```
   */
  const getUserDisplayName = (): string => {
    if (!user) return 'Usuario'
    return user.name || user.email.split('@')[0] || 'Usuario'
  }

  /**
   * Check if current session is valid
   * @function isSessionValid
   * @description Checks if the current session is still valid
   * @returns {boolean} Whether session is valid
   * @example
   * ```typescript
   * if (!isSessionValid()) {
   *   // Redirect to login or refresh session
   * }
   * ```
   */
  const isSessionValid = (): boolean => {
    return status === 'authenticated' && !!session?.user
  }

  return {
    user,
    isAuthenticated,
    isLoading: isLoading || status === 'loading',
    error,
    login: enhancedLogin,
    logout: enhancedLogout,
    updateUser,
    clearError,
    checkSession,

    // Additional utility functions
    hasPermission,
    hasRole,
    getUserDisplayName,
    isSessionValid,
  } as UseAuthReturn & {
    hasPermission: (permission: string) => boolean
    hasRole: (role: string) => boolean
    getUserDisplayName: () => string
    isSessionValid: () => boolean
  }
}

/**
 * Hook for checking authentication status only
 * @hook useAuthStatus
 * @description Lightweight hook that only returns authentication status
 * @returns {boolean} Whether user is authenticated
 * @example
 * ```typescript
 * import { useAuthStatus } from '@/hooks/useAuth'
 *
 * function ProtectedComponent() {
 *   const isAuthenticated = useAuthStatus()
 *
 *   if (!isAuthenticated) {
 *     return <div>Please login to view this content</div>
 *   }
 *
 *   return <div>Protected content here</div>
 * }
 * ```
 */
export const useAuthStatus = (): boolean => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  const { status } = useSession()

  return isAuthenticated && status === 'authenticated'
}

/**
 * Hook for getting current user only
 * @hook useCurrentUser
 * @description Lightweight hook that only returns current user data
 * @returns {Object | null} Current user object or null
 * @example
 * ```typescript
 * import { useCurrentUser } from '@/hooks/useAuth'
 *
 * function UserProfile() {
 *   const user = useCurrentUser()
 *
 *   if (!user) {
 *     return <div>No user data available</div>
 *   }
 *
 *   return (
 *     <div>
 *       <h2>{user.name}</h2>
 *       <p>{user.email}</p>
 *     </div>
 *   )
 * }
 * ```
 */
export const useCurrentUser = () => {
  const user = useAuthStore(state => state.user)
  const { data: session } = useSession()

  return user || session?.user || null
}

/**
 * Hook for authentication loading state
 * @hook useAuthLoading
 * @description Lightweight hook that only returns loading state
 * @returns {boolean} Whether authentication is loading
 * @example
 * ```typescript
 * import { useAuthLoading } from '@/hooks/useAuth'
 *
 * function App() {
 *   const isLoading = useAuthLoading()
 *
 *   if (isLoading) {
 *     return <div>Loading authentication...</div>
 *   }
 *
 *   return <MainApp />
 * }
 * ```
 */
export const useAuthLoading = (): boolean => {
  const isLoading = useAuthStore(state => state.isLoading)
  const { status } = useSession()

  return isLoading || status === 'loading'
}
