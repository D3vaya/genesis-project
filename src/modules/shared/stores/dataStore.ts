/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @fileoverview Data management store with Zustand
 * @description Manages application data, caching, and API state with support for both Prisma and REST APIs
 * @author Generated SaaS Template
 * @version 1.0.0
 */

import { create } from 'zustand'

/**
 * Generic API response interface
 * @interface ApiResponse
 * @template T - Type of the response data
 * @description Structure for API response objects
 * @property {T} data - Response data payload
 * @property {string} message - Response message
 * @property {boolean} success - Whether the request was successful
 * @property {number} timestamp - Response timestamp
 */
interface ApiResponse<T = any> {
  data: T
  message: string
  success: boolean
  timestamp: number
}

/**
 * Cache entry interface
 * @interface CacheEntry
 * @template T - Type of the cached data
 * @description Structure for cached data entries
 * @property {T} data - Cached data payload
 * @property {number} timestamp - When the data was cached
 * @property {number} ttl - Time to live in milliseconds
 * @property {string} key - Cache key identifier
 */
interface CacheEntry<T = any> {
  data: T
  timestamp: number
  ttl: number
  key: string
}

/**
 * Loading state for different operations
 * @interface LoadingState
 * @description Tracks loading state for various data operations
 * @property {boolean} users - Loading state for user operations
 * @property {boolean} api - Loading state for API operations
 * @property {boolean} cache - Loading state for cache operations
 */
interface LoadingState {
  users: boolean
  api: boolean
  cache: boolean
}

/**
 * Error state for different operations
 * @interface ErrorState
 * @description Tracks error state for various data operations
 * @property {string | null} users - Error message for user operations
 * @property {string | null} api - Error message for API operations
 * @property {string | null} cache - Error message for cache operations
 */
interface ErrorState {
  users: string | null
  api: string | null
  cache: string | null
}

/**
 * Data store state interface
 * @interface DataState
 * @description Defines the structure of the data store state
 * @property {any[]} users - Array of cached user data
 * @property {Record<string, any>} apiData - Key-value store for API response data
 * @property {Map<string, CacheEntry>} cache - Cache storage for various data
 * @property {LoadingState} loading - Loading states for different operations
 * @property {ErrorState} errors - Error states for different operations
 * @property {number} lastFetch - Timestamp of last data fetch
 */
interface DataState {
  // Data storage
  users: any[]
  apiData: Record<string, any>
  cache: Map<string, CacheEntry>

  // State management
  loading: LoadingState
  errors: ErrorState
  lastFetch: number

  // Actions
  setUsers: (users: any[]) => void
  addUser: (user: any) => void
  updateUser: (id: string, userData: any) => void
  removeUser: (id: string) => void
  setApiData: (key: string, data: any) => void
  getApiData: (key: string) => any
  removeApiData: (key: string) => void
  setCache: (key: string, data: any, ttl?: number) => void
  getCache: (key: string) => any
  removeCache: (key: string) => void
  clearCache: () => void
  isValidCache: (key: string) => boolean
  setLoading: (operation: keyof LoadingState, loading: boolean) => void
  setError: (operation: keyof ErrorState, error: string | null) => void
  clearErrors: () => void
  clearAll: () => void
}

/**
 * Default TTL for cache entries (5 minutes)
 * @const {number} DEFAULT_TTL
 * @description Default cache time-to-live in milliseconds
 */
const DEFAULT_TTL = 5 * 60 * 1000

/**
 * Data store using Zustand
 * @description Global state management for application data and caching
 * @type {import('zustand').StoreApi<DataState>}
 * @example
 * ```typescript
 * import { useDataStore } from '@/stores/dataStore'
 *
 * function UserList() {
 *   const { users, setUsers, loading } = useDataStore()
 *
 *   useEffect(() => {
 *     // Load users from API or Prisma
 *     fetchUsers().then(setUsers)
 *   }, [setUsers])
 *
 *   if (loading.users) return <div>Loading...</div>
 *
 *   return (
 *     <ul>
 *       {users.map(user => (
 *         <li key={user.id}>{user.name}</li>
 *       ))}
 *     </ul>
 *   )
 * }
 * ```
 */
export const useDataStore = create<DataState>((set, get) => ({
  users: [],
  apiData: {},
  cache: new Map(),
  loading: {
    users: false,
    api: false,
    cache: false,
  },
  errors: {
    users: null,
    api: null,
    cache: null,
  },
  lastFetch: 0,

  /**
   * Sets the users array
   * @function setUsers
   * @description Replaces the entire users array with new data
   * @param {any[]} users - Array of user objects to set
   * @example
   * ```typescript
   * const { setUsers } = useDataStore()
   * setUsers([
   *   { id: '1', name: 'John', email: 'john@example.com' },
   *   { id: '2', name: 'Jane', email: 'jane@example.com' }
   * ])
   * ```
   */
  setUsers: (users: any[]) => {
    set({
      users,
      lastFetch: Date.now(),
    })
  },

  /**
   * Adds a new user to the users array
   * @function addUser
   * @description Adds a single user to the existing users array
   * @param {any} user - User object to add
   * @example
   * ```typescript
   * const { addUser } = useDataStore()
   * addUser({ id: '3', name: 'Bob', email: 'bob@example.com' })
   * ```
   */
  addUser: (user: any) => {
    set(state => ({
      users: [...state.users, user],
    }))
  },

  /**
   * Updates an existing user by ID
   * @function updateUser
   * @description Updates user data for a specific user ID
   * @param {string} id - User ID to update
   * @param {any} userData - Partial user data to merge
   * @example
   * ```typescript
   * const { updateUser } = useDataStore()
   * updateUser('1', { name: 'John Updated' })
   * ```
   */
  updateUser: (id: string, userData: any) => {
    set(state => ({
      users: state.users.map(user =>
        user.id === id ? { ...user, ...userData } : user
      ),
    }))
  },

  /**
   * Removes a user by ID
   * @function removeUser
   * @description Removes a user from the users array by ID
   * @param {string} id - User ID to remove
   * @example
   * ```typescript
   * const { removeUser } = useDataStore()
   * removeUser('1')
   * ```
   */
  removeUser: (id: string) => {
    set(state => ({
      users: state.users.filter(user => user.id !== id),
    }))
  },

  /**
   * Sets API data by key
   * @function setApiData
   * @description Stores API response data with a specific key
   * @param {string} key - Key to store the data under
   * @param {any} data - Data to store
   * @example
   * ```typescript
   * const { setApiData } = useDataStore()
   * setApiData('user-stats', { totalUsers: 150, activeUsers: 120 })
   * ```
   */
  setApiData: (key: string, data: any) => {
    set(state => ({
      apiData: { ...state.apiData, [key]: data },
    }))
  },

  /**
   * Gets API data by key
   * @function getApiData
   * @description Retrieves stored API data by key
   * @param {string} key - Key to retrieve data for
   * @returns {any} Stored data or undefined if not found
   * @example
   * ```typescript
   * const { getApiData } = useDataStore()
   * const stats = getApiData('user-stats')
   * console.log(stats?.totalUsers)
   * ```
   */
  getApiData: (key: string) => {
    return get().apiData[key]
  },

  /**
   * Removes API data by key
   * @function removeApiData
   * @description Removes stored API data for a specific key
   * @param {string} key - Key to remove data for
   * @example
   * ```typescript
   * const { removeApiData } = useDataStore()
   * removeApiData('user-stats')
   * ```
   */
  removeApiData: (key: string) => {
    set(state => {
      const { [key]: _, ...rest } = state.apiData
      return { apiData: rest }
    })
  },

  /**
   * Sets cache entry with TTL
   * @function setCache
   * @description Stores data in cache with optional time-to-live
   * @param {string} key - Cache key
   * @param {any} data - Data to cache
   * @param {number} ttl - Time to live in milliseconds (default: 5 minutes)
   * @example
   * ```typescript
   * const { setCache } = useDataStore()
   * setCache('expensive-calculation', result, 10 * 60 * 1000) // Cache for 10 minutes
   * ```
   */
  setCache: (key: string, data: any, ttl: number = DEFAULT_TTL) => {
    set(state => {
      const newCache = new Map(state.cache)
      newCache.set(key, {
        data,
        timestamp: Date.now(),
        ttl,
        key,
      })
      return { cache: newCache }
    })
  },

  /**
   * Gets cache entry by key
   * @function getCache
   * @description Retrieves cached data by key if still valid
   * @param {string} key - Cache key to retrieve
   * @returns {any} Cached data or undefined if expired/not found
   * @example
   * ```typescript
   * const { getCache } = useDataStore()
   * const cachedResult = getCache('expensive-calculation')
   * if (cachedResult) {
   *   console.log('Using cached data:', cachedResult)
   * }
   * ```
   */
  getCache: (key: string) => {
    const state = get()
    const entry = state.cache.get(key)

    if (!entry) return undefined

    if (state.isValidCache(key)) {
      return entry.data
    } else {
      // Remove expired cache entry
      state.removeCache(key)
      return undefined
    }
  },

  /**
   * Removes cache entry by key
   * @function removeCache
   * @description Removes a specific cache entry
   * @param {string} key - Cache key to remove
   * @example
   * ```typescript
   * const { removeCache } = useDataStore()
   * removeCache('expensive-calculation')
   * ```
   */
  removeCache: (key: string) => {
    set(state => {
      const newCache = new Map(state.cache)
      newCache.delete(key)
      return { cache: newCache }
    })
  },

  /**
   * Clears all cache entries
   * @function clearCache
   * @description Removes all cached data
   * @example
   * ```typescript
   * const { clearCache } = useDataStore()
   * clearCache() // Clears all cached data
   * ```
   */
  clearCache: () => {
    set({ cache: new Map() })
  },

  /**
   * Checks if cache entry is still valid
   * @function isValidCache
   * @description Checks if a cache entry exists and hasn't expired
   * @param {string} key - Cache key to check
   * @returns {boolean} True if cache entry is valid, false otherwise
   * @example
   * ```typescript
   * const { isValidCache } = useDataStore()
   * if (isValidCache('user-data')) {
   *   // Use cached data
   * } else {
   *   // Fetch fresh data
   * }
   * ```
   */
  isValidCache: (key: string) => {
    const entry = get().cache.get(key)
    if (!entry) return false

    const now = Date.now()
    return now - entry.timestamp < entry.ttl
  },

  /**
   * Sets loading state for a specific operation
   * @function setLoading
   * @description Updates loading state for a specific operation type
   * @param {keyof LoadingState} operation - Operation type to set loading for
   * @param {boolean} loading - Loading state value
   * @example
   * ```typescript
   * const { setLoading } = useDataStore()
   * setLoading('users', true) // Show loading for user operations
   * ```
   */
  setLoading: (operation: keyof LoadingState, loading: boolean) => {
    set(state => ({
      loading: { ...state.loading, [operation]: loading },
    }))
  },

  /**
   * Sets error state for a specific operation
   * @function setError
   * @description Updates error state for a specific operation type
   * @param {keyof ErrorState} operation - Operation type to set error for
   * @param {string | null} error - Error message or null to clear
   * @example
   * ```typescript
   * const { setError } = useDataStore()
   * setError('api', 'Failed to fetch data from server')
   * ```
   */
  setError: (operation: keyof ErrorState, error: string | null) => {
    set(state => ({
      errors: { ...state.errors, [operation]: error },
    }))
  },

  /**
   * Clears all error states
   * @function clearErrors
   * @description Resets all error states to null
   * @example
   * ```typescript
   * const { clearErrors } = useDataStore()
   * clearErrors() // Clear all error messages
   * ```
   */
  clearErrors: () => {
    set({
      errors: {
        users: null,
        api: null,
        cache: null,
      },
    })
  },

  /**
   * Clears all store data
   * @function clearAll
   * @description Resets the entire data store to initial state
   * @example
   * ```typescript
   * const { clearAll } = useDataStore()
   * clearAll() // Reset all data store state
   * ```
   */
  clearAll: () => {
    set({
      users: [],
      apiData: {},
      cache: new Map(),
      loading: {
        users: false,
        api: false,
        cache: false,
      },
      errors: {
        users: null,
        api: null,
        cache: null,
      },
      lastFetch: 0,
    })
  },
}))

/**
 * Selector hook for users data
 * @function useUsers
 * @description Custom hook to get users data and related actions
 * @returns {Object} Users data and management functions
 * @example
 * ```typescript
 * import { useUsers } from '@/stores/dataStore'
 *
 * function UsersList() {
 *   const { users, addUser, updateUser, loading, errors } = useUsers()
 *
 *   if (loading.users) return <div>Loading users...</div>
 *   if (errors.users) return <div>Error: {errors.users}</div>
 *
 *   return (
 *     <ul>
 *       {users.map(user => (
 *         <li key={user.id}>{user.name}</li>
 *       ))}
 *     </ul>
 *   )
 * }
 * ```
 */
export const useUsers = () =>
  useDataStore(state => ({
    users: state.users,
    setUsers: state.setUsers,
    addUser: state.addUser,
    updateUser: state.updateUser,
    removeUser: state.removeUser,
    loading: state.loading,
    errors: state.errors,
  }))

/**
 * Selector hook for cache operations
 * @function useCache
 * @description Custom hook to get cache management functions
 * @returns {Object} Cache management functions
 * @example
 * ```typescript
 * import { useCache } from '@/stores/dataStore'
 *
 * function ExpensiveComponent() {
 *   const { getCache, setCache, isValidCache } = useCache()
 *
 *   const computeExpensiveValue = () => {
 *     if (isValidCache('expensive-result')) {
 *       return getCache('expensive-result')
 *     }
 *
 *     const result = performExpensiveCalculation()
 *     setCache('expensive-result', result, 60000) // Cache for 1 minute
 *     return result
 *   }
 * }
 * ```
 */
export const useCache = () =>
  useDataStore(state => ({
    getCache: state.getCache,
    setCache: state.setCache,
    removeCache: state.removeCache,
    clearCache: state.clearCache,
    isValidCache: state.isValidCache,
  }))

/**
 * Export types for external use
 * @type {ApiResponse}
 * @description Export API response type for use in components
 */
export type { ApiResponse, CacheEntry, LoadingState, ErrorState }
