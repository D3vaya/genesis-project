/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @fileoverview Custom data management hook with caching and API integration
 * @description Provides convenient interface for data management using both Prisma and external API calls
 * @author Generated SaaS Template
 * @version 1.0.0
 */

import { useCallback, useEffect } from "react";
import { useDataStore, useUsers, useCache } from "@/stores/dataStore";
import { get, post, put, del, internalApi } from "@/lib/axios";
import { prisma } from "@/lib/prisma";
import type { User } from "@/lib/validations";

/**
 * Data hook return type
 * @interface UseDataReturn
 * @description Defines the structure of the useData hook return value
 * @property {Array} users - Array of user data
 * @property {Object} apiData - Key-value store for API data
 * @property {Object} loading - Loading states for different operations
 * @property {Object} errors - Error states for different operations
 * @property {Function} fetchUsers - Function to fetch users from API
 * @property {Function} fetchUsersFromDB - Function to fetch users from database
 * @property {Function} createUser - Function to create new user
 * @property {Function} updateUser - Function to update existing user
 * @property {Function} deleteUser - Function to delete user
 * @property {Function} fetchApiData - Function to fetch data from external API
 * @property {Function} clearCache - Function to clear all cached data
 * @property {Function} invalidateCache - Function to invalidate specific cache
 * @property {Function} refreshData - Function to refresh all data
 */
interface UseDataReturn {
  users: any[];
  apiData: Record<string, any>;
  loading: {
    users: boolean;
    api: boolean;
    cache: boolean;
  };
  errors: {
    users: string | null;
    api: string | null;
    cache: string | null;
  };
  fetchUsers: () => Promise<any[]>;
  fetchUsersFromDB: () => Promise<User[]>;
  createUser: (userData: Partial<User>) => Promise<User>;
  updateUser: (id: string, userData: Partial<User>) => Promise<User>;
  deleteUser: (id: string) => Promise<void>;
  fetchApiData: (endpoint: string, cacheKey?: string) => Promise<any>;
  clearCache: () => void;
  invalidateCache: (key: string) => void;
  refreshData: () => Promise<void>;
}

/**
 * Custom data management hook
 * @hook useData
 * @description Provides comprehensive data management with caching and API integration
 * @returns {UseDataReturn} Data state and management functions
 * @example
 * ```typescript
 * import { useData } from '@/hooks/useData'
 *
 * function UserManagement() {
 *   const {
 *     users,
 *     loading,
 *     errors,
 *     fetchUsers,
 *     createUser,
 *     updateUser,
 *     deleteUser,
 *     refreshData
 *   } = useData()
 *
 *   useEffect(() => {
 *     fetchUsers()
 *   }, [fetchUsers])
 *
 *   const handleCreateUser = async (userData) => {
 *     try {
 *       const newUser = await createUser(userData)
 *       console.log('User created:', newUser)
 *     } catch (error) {
 *       console.error('Failed to create user:', error)
 *     }
 *   }
 *
 *   if (loading.users) return <div>Loading users...</div>
 *   if (errors.users) return <div>Error: {errors.users}</div>
 *
 *   return (
 *     <div>
 *       <button onClick={refreshData}>Refresh Data</button>
 *       <ul>
 *         {users.map(user => (
 *           <li key={user.id}>
 *             {user.name} ({user.email})
 *             <button onClick={() => updateUser(user.id, { name: 'Updated' })}>
 *               Update
 *             </button>
 *             <button onClick={() => deleteUser(user.id)}>
 *               Delete
 *             </button>
 *           </li>
 *         ))}
 *       </ul>
 *     </div>
 *   )
 * }
 * ```
 */
export const useData = (): UseDataReturn => {
  const {
    users,
    apiData,
    loading,
    errors,
    setUsers,
    addUser,
    updateUser: updateUserInStore,
    removeUser,
    setApiData,
    getApiData,
    setLoading,
    setError,
    clearErrors,
  } = useDataStore();

  const { getCache, setCache, removeCache, clearCache, isValidCache } =
    useCache();

  /**
   * Fetch users from external API with caching
   * @function fetchUsers
   * @description Fetches users from external API with automatic caching
   * @returns {Promise<any[]>} Promise resolving to users array
   * @example
   * ```typescript
   * const users = await fetchUsers()
   * console.log('Fetched users:', users)
   * ```
   */
  const fetchUsers = useCallback(async (): Promise<any[]> => {
    const cacheKey = "external-users";

    // Check cache first
    if (isValidCache(cacheKey)) {
      const cachedUsers = getCache(cacheKey);
      setUsers(cachedUsers);
      return cachedUsers;
    }

    setLoading("api", true);
    setError("api", null);

    try {
      const fetchedUsers = await get<any[]>("/users");

      // Update store and cache
      setUsers(fetchedUsers);
      setCache(cacheKey, fetchedUsers, 5 * 60 * 1000); // 5 minutes cache
      setApiData("users", fetchedUsers);

      return fetchedUsers;
    } catch (error: any) {
      console.error("Error fetching users:", error);
      const errorMessage = error?.message || "Failed to fetch users";
      setError("api", errorMessage);

      // Try to return cached data if available
      const cachedUsers = getCache(cacheKey);
      if (cachedUsers) {
        setUsers(cachedUsers);
        return cachedUsers;
      }

      throw error;
    } finally {
      setLoading("api", false);
    }
  }, [
    getCache,
    setCache,
    isValidCache,
    setUsers,
    setLoading,
    setError,
    setApiData,
  ]);

  /**
   * Fetch users from database using Prisma
   * @function fetchUsersFromDB
   * @description Fetches users from local database using Prisma
   * @returns {Promise<User[]>} Promise resolving to users array from database
   * @example
   * ```typescript
   * const dbUsers = await fetchUsersFromDB()
   * console.log('Database users:', dbUsers)
   * ```
   */
  const fetchUsersFromDB = useCallback(async (): Promise<User[]> => {
    const cacheKey = "db-users";

    // Check cache first
    if (isValidCache(cacheKey)) {
      const cachedUsers = getCache(cacheKey);
      return cachedUsers;
    }

    setLoading("users", true);
    setError("users", null);

    try {
      const dbUsers = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          image: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      // Cache the results
      setCache(cacheKey, dbUsers, 2 * 60 * 1000); // 2 minutes cache for DB data

      return dbUsers;
    } catch (error: any) {
      console.error("Error fetching users from DB:", error);
      const errorMessage =
        error?.message || "Failed to fetch users from database";
      setError("users", errorMessage);
      throw error;
    } finally {
      setLoading("users", false);
    }
  }, [getCache, setCache, isValidCache, setLoading, setError]);

  /**
   * Create new user
   * @function createUser
   * @description Creates a new user using internal API
   * @param {Partial<User>} userData - User data for creation
   * @returns {Promise<User>} Promise resolving to created user
   * @example
   * ```typescript
   * const newUser = await createUser({
   *   name: 'John Doe',
   *   email: 'john@example.com',
   *   password: 'password123'
   * })
   * ```
   */
  const createUser = useCallback(
    async (userData: Partial<User>): Promise<User> => {
      setLoading("users", true);
      setError("users", null);

      try {
        const response = await internalApi<{ user: User; message: string }>(
          "POST",
          "/api/auth/register",
          userData
        );

        const newUser = response.user;

        // Add to store
        addUser(newUser);

        // Invalidate cache
        removeCache("db-users");

        return newUser;
      } catch (error: any) {
        console.error("Error creating user:", error);
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          "Failed to create user";
        setError("users", errorMessage);
        throw error;
      } finally {
        setLoading("users", false);
      }
    },
    [addUser, removeCache, setLoading, setError]
  );

  /**
   * Update existing user
   * @function updateUser
   * @description Updates an existing user's data
   * @param {string} id - User ID to update
   * @param {Partial<User>} userData - Partial user data to update
   * @returns {Promise<User>} Promise resolving to updated user
   * @example
   * ```typescript
   * const updatedUser = await updateUser('user-id', {
   *   name: 'John Updated'
   * })
   * ```
   */
  const updateUser = useCallback(
    async (id: string, userData: Partial<User>): Promise<User> => {
      setLoading("users", true);
      setError("users", null);

      try {
        // This would typically call an API endpoint
        // For now, we'll simulate with Prisma direct update
        const updatedUser = await prisma.user.update({
          where: { id },
          data: userData,
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
            createdAt: true,
            updatedAt: true,
          },
        });

        // Update store
        updateUserInStore(id, updatedUser);

        // Invalidate cache
        removeCache("db-users");

        return updatedUser;
      } catch (error: any) {
        console.error("Error updating user:", error);
        const errorMessage = error?.message || "Failed to update user";
        setError("users", errorMessage);
        throw error;
      } finally {
        setLoading("users", false);
      }
    },
    [updateUserInStore, removeCache, setLoading, setError]
  );

  /**
   * Delete user
   * @function deleteUser
   * @description Deletes a user by ID
   * @param {string} id - User ID to delete
   * @returns {Promise<void>} Promise that resolves when user is deleted
   * @example
   * ```typescript
   * await deleteUser('user-id')
   * console.log('User deleted')
   * ```
   */
  const deleteUser = useCallback(
    async (id: string): Promise<void> => {
      setLoading("users", true);
      setError("users", null);

      try {
        // Delete from database
        await prisma.user.delete({
          where: { id },
        });

        // Remove from store
        removeUser(id);

        // Invalidate cache
        removeCache("db-users");
      } catch (error: any) {
        console.error("Error deleting user:", error);
        const errorMessage = error?.message || "Failed to delete user";
        setError("users", errorMessage);
        throw error;
      } finally {
        setLoading("users", false);
      }
    },
    [removeUser, removeCache, setLoading, setError]
  );

  /**
   * Fetch data from external API with caching
   * @function fetchApiData
   * @description Generic function to fetch data from external API with caching
   * @param {string} endpoint - API endpoint to fetch from
   * @param {string} cacheKey - Optional cache key (defaults to endpoint)
   * @param {number} cacheTTL - Optional cache TTL in milliseconds (defaults to 5 minutes)
   * @returns {Promise<any>} Promise resolving to fetched data
   * @example
   * ```typescript
   * const posts = await fetchApiData('/posts', 'posts-cache')
   * const comments = await fetchApiData('/comments', 'comments', 2 * 60 * 1000) // 2 min cache
   * ```
   */
  const fetchApiData = useCallback(
    async (
      endpoint: string,
      cacheKey?: string,
      cacheTTL: number = 5 * 60 * 1000
    ): Promise<any> => {
      const key = cacheKey || endpoint.replace(/\//g, "-");

      // Check cache first
      if (isValidCache(key)) {
        const cachedData = getCache(key);
        setApiData(key, cachedData);
        return cachedData;
      }

      setLoading("api", true);
      setError("api", null);

      try {
        const data = await get(endpoint);

        // Update store and cache
        setApiData(key, data);
        setCache(key, data, cacheTTL);

        return data;
      } catch (error: any) {
        console.error(`Error fetching data from ${endpoint}:`, error);
        const errorMessage =
          error?.message || `Failed to fetch data from ${endpoint}`;
        setError("api", errorMessage);

        // Try to return cached data if available
        const cachedData = getCache(key);
        if (cachedData) {
          setApiData(key, cachedData);
          return cachedData;
        }

        throw error;
      } finally {
        setLoading("api", false);
      }
    },
    [getCache, setCache, isValidCache, setApiData, setLoading, setError]
  );

  /**
   * Invalidate specific cache entry
   * @function invalidateCache
   * @description Removes a specific cache entry and refreshes related data
   * @param {string} key - Cache key to invalidate
   * @example
   * ```typescript
   * invalidateCache('users-cache')
   * ```
   */
  const invalidateCache = useCallback(
    (key: string): void => {
      removeCache(key);

      // Clear related API data
      if (apiData[key]) {
        const { [key]: _, ...rest } = apiData;
        // This would need to be implemented in the store
      }
    },
    [removeCache, apiData]
  );

  /**
   * Refresh all data
   * @function refreshData
   * @description Clears all caches and refetches all data
   * @returns {Promise<void>} Promise that resolves when all data is refreshed
   * @example
   * ```typescript
   * await refreshData()
   * console.log('All data refreshed')
   * ```
   */
  const refreshData = useCallback(async (): Promise<void> => {
    // Clear all caches
    clearCache();
    clearErrors();

    try {
      // Refetch key data
      await Promise.all([
        fetchUsers(),
        fetchUsersFromDB().catch(console.error), // Don't fail if DB is not accessible
      ]);
    } catch (error) {
      console.error("Error refreshing data:", error);
      throw error;
    }
  }, [clearCache, clearErrors, fetchUsers, fetchUsersFromDB]);

  /**
   * Auto-refresh data on mount
   * @description Automatically refreshes stale data when component mounts
   */
  useEffect(() => {
    // Check if we need to refresh data
    const lastFetch = getApiData("last-fetch-timestamp");
    const now = Date.now();
    const fiveMinutesAgo = now - 5 * 60 * 1000;

    if (!lastFetch || lastFetch < fiveMinutesAgo) {
      refreshData().catch(console.error);
      setApiData("last-fetch-timestamp", now);
    }
  }, []); // Empty dependency array for mount-only effect

  return {
    users,
    apiData,
    loading,
    errors,
    fetchUsers,
    fetchUsersFromDB,
    createUser,
    updateUser,
    deleteUser,
    fetchApiData,
    clearCache,
    invalidateCache,
    refreshData,
  };
};

/**
 * Hook for users data only
 * @hook useUsersData
 * @description Lightweight hook for user data management
 * @returns {Object} Users data and management functions
 * @example
 * ```typescript
 * import { useUsersData } from '@/hooks/useData'
 *
 * function UsersList() {
 *   const { users, loading, errors, fetchUsers, refreshUsers } = useUsersData()
 *
 *   useEffect(() => {
 *     fetchUsers()
 *   }, [fetchUsers])
 *
 *   if (loading.users) return <div>Loading...</div>
 *   if (errors.users) return <div>Error: {errors.users}</div>
 *
 *   return (
 *     <div>
 *       <button onClick={refreshUsers}>Refresh</button>
 *       <ul>
 *         {users.map(user => (
 *           <li key={user.id}>{user.name}</li>
 *         ))}
 *       </ul>
 *     </div>
 *   )
 * }
 * ```
 */
export const useUsersData = () => {
  const { users, loading, errors, fetchUsers, fetchUsersFromDB } = useData();

  const refreshUsers = useCallback(async () => {
    try {
      await Promise.all([
        fetchUsers(),
        fetchUsersFromDB().catch(console.error),
      ]);
    } catch (error) {
      console.error("Error refreshing users:", error);
    }
  }, [fetchUsers, fetchUsersFromDB]);

  return {
    users,
    loading,
    errors,
    fetchUsers,
    fetchUsersFromDB,
    refreshUsers,
  };
};

/**
 * Hook for API data only
 * @hook useApiData
 * @description Lightweight hook for external API data management
 * @returns {Object} API data and management functions
 * @example
 * ```typescript
 * import { useApiData } from '@/hooks/useData'
 *
 * function PostsList() {
 *   const { fetchApiData, apiData, loading } = useApiData()
 *
 *   useEffect(() => {
 *     fetchApiData('/posts', 'posts')
 *   }, [fetchApiData])
 *
 *   const posts = apiData['posts'] || []
 *
 *   if (loading.api) return <div>Loading posts...</div>
 *
 *   return (
 *     <ul>
 *       {posts.map(post => (
 *         <li key={post.id}>{post.title}</li>
 *       ))}
 *     </ul>
 *   )
 * }
 * ```
 */
export const useApiData = () => {
  const {
    apiData,
    loading,
    errors,
    fetchApiData,
    clearCache,
    invalidateCache,
  } = useData();

  return {
    apiData,
    loading,
    errors,
    fetchApiData,
    clearCache,
    invalidateCache,
  };
};
