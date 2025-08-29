/**
 * @fileoverview API service layer for external API operations using Axios
 * @description Provides comprehensive external API management functions with caching, error handling, and retry logic
 * @author Generated SaaS Template
 * @version 1.0.0
 */

import { apiClient, get, post, put, del } from '@/lib/axios'
import { useDataStore } from '@/stores/dataStore'
import { useUIStore } from '@/stores/uiStore'

/**
 * API service error class
 * @class ApiServiceError
 * @description Custom error class for API service operations
 * @extends Error
 * @property {string} code - Error code for programmatic handling
 * @property {number} status - HTTP status code if available
 * @property {any} response - Full response data if available
 */
export class ApiServiceError extends Error {
  constructor(
    message: string,
    public code: string,
    public status?: number,
    public response?: any
  ) {
    super(message)
    this.name = 'ApiServiceError'
  }
}

/**
 * API response wrapper interface
 * @interface ApiResponse
 * @template T - Type of the response data
 * @description Standardized response wrapper for API calls
 * @property {T} data - Response data payload
 * @property {boolean} success - Whether the request was successful
 * @property {string} message - Response message
 * @property {number} timestamp - Response timestamp
 * @property {any} meta - Additional metadata (pagination, etc.)
 */
interface ApiResponse<T = any> {
  data: T
  success: boolean
  message: string
  timestamp: number
  meta?: any
}

/**
 * Pagination parameters interface
 * @interface PaginationParams
 * @description Parameters for paginated API requests
 * @property {number} page - Page number (1-based)
 * @property {number} limit - Number of items per page
 * @property {string} sortBy - Field to sort by
 * @property {string} sortOrder - Sort order ('asc' or 'desc')
 */
interface PaginationParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

/**
 * Request retry options interface
 * @interface RetryOptions
 * @description Configuration for request retry behavior
 * @property {number} maxRetries - Maximum number of retry attempts
 * @property {number} retryDelay - Delay between retries in milliseconds
 * @property {number[]} retryStatusCodes - HTTP status codes to retry on
 */
interface RetryOptions {
  maxRetries: number
  retryDelay: number
  retryStatusCodes: number[]
}

/**
 * Cache options interface
 * @interface CacheOptions
 * @description Configuration for response caching
 * @property {number} ttl - Time to live in milliseconds
 * @property {boolean} useCache - Whether to use cached response if available
 * @property {boolean} updateCache - Whether to update cache with new response
 * @property {string} customKey - Custom cache key (optional)
 */
interface CacheOptions {
  ttl?: number
  useCache?: boolean
  updateCache?: boolean
  customKey?: string
}

/**
 * External API service class with comprehensive API management operations
 * @class ApiService
 * @description Provides all external API-related operations with caching, retry logic, and error handling
 * @example
 * ```typescript
 * import { apiService } from '@/services/apiService'
 * 
 * // Fetch users from external API
 * const users = await apiService.getUsers()
 * 
 * // Fetch posts with caching
 * const posts = await apiService.getPosts({ useCache: true, ttl: 300000 })
 * 
 * // Create new resource
 * const newPost = await apiService.createPost({
 *   title: 'New Post',
 *   body: 'Post content',
 *   userId: 1
 * })
 * ```
 */
class ApiService {
  private readonly defaultRetryOptions: RetryOptions = {
    maxRetries: 3,
    retryDelay: 1000, // 1 second
    retryStatusCodes: [408, 429, 500, 502, 503, 504]
  }

  private readonly defaultCacheOptions: CacheOptions = {
    ttl: 5 * 60 * 1000, // 5 minutes
    useCache: true,
    updateCache: true
  }

  /**
   * Execute API request with retry logic and error handling
   * @function executeRequest
   * @description Executes API request with automatic retry on failure
   * @template T - Expected response data type
   * @param {Function} requestFn - Function that makes the API request
   * @param {RetryOptions} retryOptions - Retry configuration options
   * @returns {Promise<T>} Promise resolving to API response data
   * @throws {ApiServiceError} Throws error after all retry attempts fail
   * @example
   * ```typescript
   * const data = await this.executeRequest(
   *   () => get<User[]>('/users'),
   *   { maxRetries: 2, retryDelay: 500, retryStatusCodes: [500, 502] }
   * )
   * ```
   */
  private async executeRequest<T>(
    requestFn: () => Promise<T>,
    retryOptions: Partial<RetryOptions> = {}
  ): Promise<T> {
    const options = { ...this.defaultRetryOptions, ...retryOptions }
    let lastError: any

    for (let attempt = 0; attempt <= options.maxRetries; attempt++) {
      try {
        return await requestFn()
      } catch (error: any) {
        lastError = error
        
        // Check if we should retry
        const shouldRetry = 
          attempt < options.maxRetries &&
          error.response?.status &&
          options.retryStatusCodes.includes(error.response.status)

        if (!shouldRetry) {
          break
        }

        // Wait before retry with exponential backoff
        const delay = options.retryDelay * Math.pow(2, attempt)
        await new Promise(resolve => setTimeout(resolve, delay))
        
        console.log(`Retrying API request (attempt ${attempt + 1}/${options.maxRetries})`)
      }
    }

    // All retries failed, throw error
    const status = lastError?.response?.status || 0
    const message = lastError?.response?.data?.message || lastError?.message || 'API request failed'
    
    throw new ApiServiceError(
      message,
      'REQUEST_FAILED',
      status,
      lastError?.response?.data
    )
  }

  /**
   * Get cached response or execute request with caching
   * @function executeWithCache
   * @description Executes request with intelligent caching
   * @template T - Expected response data type
   * @param {string} cacheKey - Cache key for storing/retrieving data
   * @param {Function} requestFn - Function that makes the API request
   * @param {CacheOptions} cacheOptions - Cache configuration options
   * @returns {Promise<T>} Promise resolving to API response data
   * @example
   * ```typescript
   * const data = await this.executeWithCache(
   *   'users-list',
   *   () => get<User[]>('/users'),
   *   { ttl: 600000, useCache: true }
   * )
   * ```
   */
  private async executeWithCache<T>(
    cacheKey: string,
    requestFn: () => Promise<T>,
    cacheOptions: Partial<CacheOptions> = {}
  ): Promise<T> {
    const options = { ...this.defaultCacheOptions, ...cacheOptions }
    const dataStore = useDataStore.getState()
    
    const finalCacheKey = options.customKey || cacheKey

    // Try to get from cache first
    if (options.useCache && dataStore.isValidCache(finalCacheKey)) {
      const cachedData = dataStore.getCache(finalCacheKey)
      if (cachedData) {
        console.log(`Using cached data for key: ${finalCacheKey}`)
        return cachedData
      }
    }

    // Execute request
    const data = await this.executeRequest(requestFn)

    // Update cache if requested
    if (options.updateCache && options.ttl) {
      dataStore.setCache(finalCacheKey, data, options.ttl)
    }

    return data
  }

  /**
   * Fetch all users from external API
   * @function getUsers
   * @description Retrieves list of users from JSONPlaceholder API
   * @param {PaginationParams} params - Pagination parameters
   * @param {CacheOptions} cacheOptions - Cache configuration
   * @returns {Promise<any[]>} Promise resolving to users array
   * @throws {ApiServiceError} Throws error for API issues
   * @example
   * ```typescript
   * const users = await apiService.getUsers()
   * const paginatedUsers = await apiService.getUsers(
   *   { page: 1, limit: 10 },
   *   { ttl: 300000 }
   * )
   * ```
   */
  async getUsers(
    params: PaginationParams = {},
    cacheOptions: Partial<CacheOptions> = {}
  ): Promise<any[]> {
    try {
      const queryParams = new URLSearchParams()
      
      if (params.page) queryParams.append('_page', params.page.toString())
      if (params.limit) queryParams.append('_limit', params.limit.toString())
      if (params.sortBy) queryParams.append('_sort', params.sortBy)
      if (params.sortOrder) queryParams.append('_order', params.sortOrder)
      
      const endpoint = `/users${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
      const cacheKey = `users-${queryParams.toString() || 'all'}`

      return await this.executeWithCache(
        cacheKey,
        () => get<any[]>(endpoint),
        cacheOptions
      )

    } catch (error) {
      console.error('Error fetching users:', error)
      throw new ApiServiceError(
        'Failed to fetch users from external API',
        'GET_USERS_FAILED',
        error instanceof Error ? undefined : (error as any)?.status
      )
    }
  }

  /**
   * Fetch single user by ID
   * @function getUserById
   * @description Retrieves specific user by ID from external API
   * @param {number} id - User ID to fetch
   * @param {CacheOptions} cacheOptions - Cache configuration
   * @returns {Promise<any>} Promise resolving to user object
   * @throws {ApiServiceError} Throws error for API issues
   * @example
   * ```typescript
   * const user = await apiService.getUserById(1)
   * const cachedUser = await apiService.getUserById(1, { ttl: 600000 })
   * ```
   */
  async getUserById(
    id: number,
    cacheOptions: Partial<CacheOptions> = {}
  ): Promise<any> {
    try {
      return await this.executeWithCache(
        `user-${id}`,
        () => get<any>(`/users/${id}`),
        cacheOptions
      )
    } catch (error) {
      console.error(`Error fetching user ${id}:`, error)
      throw new ApiServiceError(
        `Failed to fetch user with ID ${id}`,
        'GET_USER_FAILED',
        error instanceof Error ? undefined : (error as any)?.status
      )
    }
  }

  /**
   * Fetch all posts from external API
   * @function getPosts
   * @description Retrieves list of posts from JSONPlaceholder API
   * @param {PaginationParams & { userId?: number }} params - Query parameters
   * @param {CacheOptions} cacheOptions - Cache configuration
   * @returns {Promise<any[]>} Promise resolving to posts array
   * @throws {ApiServiceError} Throws error for API issues
   * @example
   * ```typescript
   * const posts = await apiService.getPosts()
   * const userPosts = await apiService.getPosts({ userId: 1, limit: 5 })
   * ```
   */
  async getPosts(
    params: PaginationParams & { userId?: number } = {},
    cacheOptions: Partial<CacheOptions> = {}
  ): Promise<any[]> {
    try {
      const queryParams = new URLSearchParams()
      
      if (params.userId) queryParams.append('userId', params.userId.toString())
      if (params.page) queryParams.append('_page', params.page.toString())
      if (params.limit) queryParams.append('_limit', params.limit.toString())
      if (params.sortBy) queryParams.append('_sort', params.sortBy)
      if (params.sortOrder) queryParams.append('_order', params.sortOrder)
      
      const endpoint = `/posts${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
      const cacheKey = `posts-${queryParams.toString() || 'all'}`

      return await this.executeWithCache(
        cacheKey,
        () => get<any[]>(endpoint),
        cacheOptions
      )

    } catch (error) {
      console.error('Error fetching posts:', error)
      throw new ApiServiceError(
        'Failed to fetch posts from external API',
        'GET_POSTS_FAILED',
        error instanceof Error ? undefined : (error as any)?.status
      )
    }
  }

  /**
   * Fetch single post by ID
   * @function getPostById
   * @description Retrieves specific post by ID from external API
   * @param {number} id - Post ID to fetch
   * @param {CacheOptions} cacheOptions - Cache configuration
   * @returns {Promise<any>} Promise resolving to post object
   * @throws {ApiServiceError} Throws error for API issues
   * @example
   * ```typescript
   * const post = await apiService.getPostById(1)
   * ```
   */
  async getPostById(
    id: number,
    cacheOptions: Partial<CacheOptions> = {}
  ): Promise<any> {
    try {
      return await this.executeWithCache(
        `post-${id}`,
        () => get<any>(`/posts/${id}`),
        cacheOptions
      )
    } catch (error) {
      console.error(`Error fetching post ${id}:`, error)
      throw new ApiServiceError(
        `Failed to fetch post with ID ${id}`,
        'GET_POST_FAILED',
        error instanceof Error ? undefined : (error as any)?.status
      )
    }
  }

  /**
   * Create new post
   * @function createPost
   * @description Creates a new post via external API
   * @param {Object} postData - Post data to create
   * @param {string} postData.title - Post title
   * @param {string} postData.body - Post content
   * @param {number} postData.userId - User ID of post author
   * @returns {Promise<any>} Promise resolving to created post object
   * @throws {ApiServiceError} Throws error for API issues
   * @example
   * ```typescript
   * const newPost = await apiService.createPost({
   *   title: 'My New Post',
   *   body: 'This is the content of my post.',
   *   userId: 1
   * })
   * ```
   */
  async createPost(postData: {
    title: string
    body: string
    userId: number
  }): Promise<any> {
    try {
      const createdPost = await this.executeRequest(
        () => post<any>('/posts', postData)
      )

      // Invalidate posts cache
      const dataStore = useDataStore.getState()
      dataStore.removeCache('posts-all')
      dataStore.removeCache(`posts-userId=${postData.userId}`)

      // Show success notification
      const uiStore = useUIStore.getState()
      uiStore.addNotification({
        title: 'Post Creado',
        message: 'El post se ha creado exitosamente',
        severity: 'success',
        duration: 3000
      })

      return createdPost

    } catch (error) {
      console.error('Error creating post:', error)
      
      // Show error notification
      const uiStore = useUIStore.getState()
      uiStore.addNotification({
        title: 'Error al Crear Post',
        message: 'No se pudo crear el post. Intenta de nuevo.',
        severity: 'error',
        duration: 5000
      })

      throw new ApiServiceError(
        'Failed to create post',
        'CREATE_POST_FAILED',
        error instanceof Error ? undefined : (error as any)?.status
      )
    }
  }

  /**
   * Update existing post
   * @function updatePost
   * @description Updates an existing post via external API
   * @param {number} id - Post ID to update
   * @param {Partial<Object>} postData - Post data to update
   * @returns {Promise<any>} Promise resolving to updated post object
   * @throws {ApiServiceError} Throws error for API issues
   * @example
   * ```typescript
   * const updatedPost = await apiService.updatePost(1, {
   *   title: 'Updated Post Title'
   * })
   * ```
   */
  async updatePost(id: number, postData: {
    title?: string
    body?: string
    userId?: number
  }): Promise<any> {
    try {
      const updatedPost = await this.executeRequest(
        () => put<any>(`/posts/${id}`, postData)
      )

      // Invalidate related caches
      const dataStore = useDataStore.getState()
      dataStore.removeCache('posts-all')
      dataStore.removeCache(`post-${id}`)
      if (postData.userId) {
        dataStore.removeCache(`posts-userId=${postData.userId}`)
      }

      return updatedPost

    } catch (error) {
      console.error(`Error updating post ${id}:`, error)
      throw new ApiServiceError(
        `Failed to update post with ID ${id}`,
        'UPDATE_POST_FAILED',
        error instanceof Error ? undefined : (error as any)?.status
      )
    }
  }

  /**
   * Delete post
   * @function deletePost
   * @description Deletes a post via external API
   * @param {number} id - Post ID to delete
   * @returns {Promise<void>} Promise that resolves when post is deleted
   * @throws {ApiServiceError} Throws error for API issues
   * @example
   * ```typescript
   * await apiService.deletePost(1)
   * console.log('Post deleted successfully')
   * ```
   */
  async deletePost(id: number): Promise<void> {
    try {
      await this.executeRequest(
        () => del(`/posts/${id}`)
      )

      // Invalidate related caches
      const dataStore = useDataStore.getState()
      dataStore.removeCache('posts-all')
      dataStore.removeCache(`post-${id}`)

      // Show success notification
      const uiStore = useUIStore.getState()
      uiStore.addNotification({
        title: 'Post Eliminado',
        message: 'El post se ha eliminado exitosamente',
        severity: 'success',
        duration: 3000
      })

    } catch (error) {
      console.error(`Error deleting post ${id}:`, error)
      
      // Show error notification
      const uiStore = useUIStore.getState()
      uiStore.addNotification({
        title: 'Error al Eliminar Post',
        message: 'No se pudo eliminar el post. Intenta de nuevo.',
        severity: 'error',
        duration: 5000
      })

      throw new ApiServiceError(
        `Failed to delete post with ID ${id}`,
        'DELETE_POST_FAILED',
        error instanceof Error ? undefined : (error as any)?.status
      )
    }
  }

  /**
   * Fetch comments for a post
   * @function getPostComments
   * @description Retrieves comments for a specific post
   * @param {number} postId - Post ID to get comments for
   * @param {CacheOptions} cacheOptions - Cache configuration
   * @returns {Promise<any[]>} Promise resolving to comments array
   * @throws {ApiServiceError} Throws error for API issues
   * @example
   * ```typescript
   * const comments = await apiService.getPostComments(1)
   * ```
   */
  async getPostComments(
    postId: number,
    cacheOptions: Partial<CacheOptions> = {}
  ): Promise<any[]> {
    try {
      return await this.executeWithCache(
        `post-${postId}-comments`,
        () => get<any[]>(`/posts/${postId}/comments`),
        cacheOptions
      )
    } catch (error) {
      console.error(`Error fetching comments for post ${postId}:`, error)
      throw new ApiServiceError(
        `Failed to fetch comments for post ${postId}`,
        'GET_COMMENTS_FAILED',
        error instanceof Error ? undefined : (error as any)?.status
      )
    }
  }

  /**
   * Search across multiple resource types
   * @function search
   * @description Performs search across users and posts
   * @param {string} query - Search query string
   * @param {string[]} resources - Resource types to search ['users', 'posts']
   * @param {CacheOptions} cacheOptions - Cache configuration
   * @returns {Promise<Object>} Promise resolving to search results object
   * @throws {ApiServiceError} Throws error for API issues
   * @example
   * ```typescript
   * const results = await apiService.search('john', ['users', 'posts'])
   * console.log('Users found:', results.users)
   * console.log('Posts found:', results.posts)
   * ```
   */
  async search(
    query: string,
    resources: ('users' | 'posts')[] = ['users', 'posts'],
    cacheOptions: Partial<CacheOptions> = {}
  ): Promise<{ users?: any[], posts?: any[] }> {
    try {
      const results: { users?: any[], posts?: any[] } = {}
      
      const searchPromises = resources.map(async (resource) => {
        switch (resource) {
          case 'users':
            const users = await this.getUsers({}, cacheOptions)
            results.users = users.filter(user => 
              user.name?.toLowerCase().includes(query.toLowerCase()) ||
              user.email?.toLowerCase().includes(query.toLowerCase()) ||
              user.username?.toLowerCase().includes(query.toLowerCase())
            )
            break
            
          case 'posts':
            const posts = await this.getPosts({}, cacheOptions)
            results.posts = posts.filter(post =>
              post.title?.toLowerCase().includes(query.toLowerCase()) ||
              post.body?.toLowerCase().includes(query.toLowerCase())
            )
            break
        }
      })

      await Promise.all(searchPromises)
      return results

    } catch (error) {
      console.error('Error performing search:', error)
      throw new ApiServiceError(
        'Failed to perform search',
        'SEARCH_FAILED',
        error instanceof Error ? undefined : (error as any)?.status
      )
    }
  }

  /**
   * Clear all cached data
   * @function clearCache
   * @description Clears all cached API responses
   * @example
   * ```typescript
   * apiService.clearCache()
   * console.log('All API cache cleared')
   * ```
   */
  clearCache(): void {
    const dataStore = useDataStore.getState()
    dataStore.clearCache()
    
    // Show notification
    const uiStore = useUIStore.getState()
    uiStore.addNotification({
      title: 'Cache Limpiado',
      message: 'Se ha limpiado toda la cache de API',
      severity: 'info',
      duration: 2000
    })
  }

  /**
   * Get API health status
   * @function getHealthStatus
   * @description Checks if external API is accessible and responsive
   * @returns {Promise<Object>} Promise resolving to health status object
   * @throws {ApiServiceError} Throws error if API is not accessible
   * @example
   * ```typescript
   * const health = await apiService.getHealthStatus()
   * console.log('API Status:', health.status)
   * console.log('Response Time:', health.responseTime)
   * ```
   */
  async getHealthStatus(): Promise<{
    status: 'healthy' | 'unhealthy'
    responseTime: number
    timestamp: number
  }> {
    const startTime = Date.now()
    
    try {
      await this.executeRequest(() => get('/users?_limit=1'), { maxRetries: 1 })
      
      const responseTime = Date.now() - startTime
      
      return {
        status: 'healthy',
        responseTime,
        timestamp: Date.now()
      }
    } catch (error) {
      const responseTime = Date.now() - startTime
      
      return {
        status: 'unhealthy',
        responseTime,
        timestamp: Date.now()
      }
    }
  }
}

/**
 * Singleton API service instance
 * @const {ApiService} apiService
 * @description Exported singleton instance of ApiService for application use
 * @example
 * ```typescript
 * import { apiService } from '@/services/apiService'
 * 
 * // Use the service instance
 * const users = await apiService.getUsers()
 * const posts = await apiService.getPosts({ limit: 10 })
 * ```
 */
export const apiService = new ApiService()

/**
 * Export service class for testing or custom instantiation
 * @export ApiService
 * @description Export the ApiService class itself for testing purposes
 */
export { ApiService }

/**
 * Export all interfaces and types
 * @description Export all type definitions for use in other modules
 */
export type {
  ApiResponse,
  PaginationParams,
  RetryOptions,
  CacheOptions
}