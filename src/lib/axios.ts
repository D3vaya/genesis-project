/**
 * @fileoverview Axios client configuration with interceptors and error handling
 * @description Provides configured Axios instance with authentication, error handling, and response interceptors
 * @author Generated SaaS Template
 * @version 1.0.0
 */

import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { getSession } from 'next-auth/react'
import { useUIStore } from '@/stores/uiStore'
import { useDataStore } from '@/stores/dataStore'

/**
 * Base API configuration
 * @const {Object} API_CONFIG
 * @description Configuration object for API client setup
 * @property {string} baseURL - Base URL for API requests
 * @property {number} timeout - Request timeout in milliseconds
 * @property {Object} headers - Default headers for all requests
 */
const API_CONFIG = {
  baseURL: process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'https://jsonplaceholder.typicode.com',
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
}

/**
 * Main Axios instance for external API calls
 * @const {import('axios').AxiosInstance} apiClient
 * @description Configured Axios instance for making API requests to external services
 * @example
 * ```typescript
 * import { apiClient } from '@/lib/axios'
 * 
 * const response = await apiClient.get('/users')
 * console.log('Users:', response.data)
 * ```
 */
export const apiClient = axios.create(API_CONFIG)

/**
 * Internal API client for Next.js API routes
 * @const {import('axios').AxiosInstance} internalApiClient
 * @description Configured Axios instance for making requests to internal API routes
 * @example
 * ```typescript
 * import { internalApiClient } from '@/lib/axios'
 * 
 * const response = await internalApiClient.post('/api/auth/register', userData)
 * console.log('Registration:', response.data)
 * ```
 */
export const internalApiClient = axios.create({
  baseURL: typeof window !== 'undefined' ? window.location.origin : '',
  timeout: 15000, // 15 seconds for internal APIs
  headers: API_CONFIG.headers,
})

/**
 * Request interceptor for external API client
 * @function requestInterceptor
 * @description Adds authentication headers and loading states to outgoing requests
 * @param {InternalAxiosRequestConfig} config - Axios request configuration
 * @returns {Promise<InternalAxiosRequestConfig>} Modified request configuration
 * @example
 * ```typescript
 * // This interceptor automatically:
 * // 1. Adds authentication token if available
 * // 2. Sets loading state in UI store
 * // 3. Logs request details in development
 * ```
 */
const requestInterceptor = async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
  // Set loading state
  useUIStore.getState().setLoading(true)
  useDataStore.getState().setLoading('api', true)
  
  try {
    // Add authentication token if available
    const session = await getSession()
    if (session?.user) {
      config.headers.Authorization = `Bearer ${session.user.id}`
    }
  } catch (error) {
    console.warn('Failed to get session for API request:', error)
  }
  
  // Add request timestamp for debugging
  config.metadata = {
    startTime: Date.now(),
  }
  
  // Log request in development
  if (process.env.NODE_ENV === 'development') {
    console.log('🚀 API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      headers: config.headers,
    })
  }
  
  return config
}

/**
 * Request error interceptor
 * @function requestErrorInterceptor
 * @description Handles request setup errors and clears loading states
 * @param {any} error - Request setup error
 * @returns {Promise<never>} Rejected promise with error
 */
const requestErrorInterceptor = async (error: any): Promise<never> => {
  // Clear loading states
  useUIStore.getState().setLoading(false)
  useDataStore.getState().setLoading('api', false)
  
  console.error('❌ Request Setup Error:', error)
  return Promise.reject(error)
}

/**
 * Response interceptor for successful responses
 * @function responseInterceptor
 * @description Handles successful API responses and updates loading states
 * @param {AxiosResponse} response - Axios response object
 * @returns {AxiosResponse} Processed response object
 * @example
 * ```typescript
 * // This interceptor automatically:
 * // 1. Clears loading states
 * // 2. Logs response details in development
 * // 3. Calculates request duration
 * // 4. Shows success notifications for certain operations
 * ```
 */
const responseInterceptor = (response: AxiosResponse): AxiosResponse => {
  // Clear loading states
  useUIStore.getState().setLoading(false)
  useDataStore.getState().setLoading('api', false)
  useDataStore.getState().setError('api', null)
  
  // Calculate request duration
  const startTime = response.config.metadata?.startTime
  const duration = startTime ? Date.now() - startTime : 0
  
  // Log response in development
  if (process.env.NODE_ENV === 'development') {
    console.log('✅ API Response:', {
      method: response.config.method?.toUpperCase(),
      url: response.config.url,
      status: response.status,
      statusText: response.statusText,
      duration: `${duration}ms`,
      data: response.data,
    })
  }
  
  return response
}

/**
 * Response error interceptor
 * @function responseErrorInterceptor
 * @description Handles API response errors with comprehensive error handling
 * @param {AxiosError} error - Axios error object
 * @returns {Promise<never>} Rejected promise with processed error
 * @throws {Error} Throws processed error with user-friendly messages
 * @example
 * ```typescript
 * // This interceptor automatically handles:
 * // 1. Network errors
 * // 2. HTTP status errors (400, 401, 403, 404, 500, etc.)
 * // 3. Timeout errors
 * // 4. Shows appropriate error notifications
 * // 5. Updates error states in stores
 * ```
 */
const responseErrorInterceptor = async (error: AxiosError): Promise<never> => {
  // Clear loading states
  useUIStore.getState().setLoading(false)
  useDataStore.getState().setLoading('api', false)
  
  let errorMessage = 'Error desconocido'
  let errorTitle = 'Error'
  
  if (error.response) {
    // Server responded with error status
    const status = error.response.status
    const data = error.response.data as any
    
    switch (status) {
      case 400:
        errorTitle = 'Solicitud Inválida'
        errorMessage = data?.message || 'Los datos enviados no son válidos'
        break
      case 401:
        errorTitle = 'No Autorizado'
        errorMessage = data?.message || 'Credenciales inválidas o sesión expirada'
        break
      case 403:
        errorTitle = 'Prohibido'
        errorMessage = data?.message || 'No tienes permisos para realizar esta acción'
        break
      case 404:
        errorTitle = 'No Encontrado'
        errorMessage = data?.message || 'El recurso solicitado no fue encontrado'
        break
      case 409:
        errorTitle = 'Conflicto'
        errorMessage = data?.message || 'Ya existe un recurso con estos datos'
        break
      case 422:
        errorTitle = 'Datos Inválidos'
        errorMessage = data?.message || 'Los datos proporcionados no son válidos'
        break
      case 429:
        errorTitle = 'Demasiadas Solicitudes'
        errorMessage = data?.message || 'Has excedido el límite de solicitudes. Intenta más tarde'
        break
      case 500:
        errorTitle = 'Error del Servidor'
        errorMessage = data?.message || 'Error interno del servidor. Intenta más tarde'
        break
      case 502:
        errorTitle = 'Servicio No Disponible'
        errorMessage = 'El servidor no está disponible. Intenta más tarde'
        break
      case 503:
        errorTitle = 'Servicio en Mantenimiento'
        errorMessage = 'El servicio está temporalmente en mantenimiento'
        break
      default:
        errorTitle = `Error ${status}`
        errorMessage = data?.message || `Error del servidor: ${status}`
    }
    
    // Log error details in development
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ API Error Response:', {
        method: error.config?.method?.toUpperCase(),
        url: error.config?.url,
        status,
        statusText: error.response.statusText,
        data: error.response.data,
      })
    }
  } else if (error.request) {
    // Network error or no response
    errorTitle = 'Error de Conexión'
    if (error.code === 'ECONNABORTED') {
      errorMessage = 'La solicitud ha excedido el tiempo límite'
    } else if (error.code === 'ERR_NETWORK') {
      errorMessage = 'Error de red. Verifica tu conexión a internet'
    } else {
      errorMessage = 'No se pudo conectar con el servidor'
    }
    
    console.error('❌ Network Error:', error.message)
  } else {
    // Request setup error
    errorTitle = 'Error de Configuración'
    errorMessage = error.message || 'Error al configurar la solicitud'
    
    console.error('❌ Request Setup Error:', error.message)
  }
  
  // Update error state in store
  useDataStore.getState().setError('api', errorMessage)
  
  // Show error notification
  useUIStore.getState().addNotification({
    title: errorTitle,
    message: errorMessage,
    severity: 'error',
    duration: 5000, // 5 seconds
  })
  
  // Create enhanced error object
  const enhancedError = {
    ...error,
    title: errorTitle,
    message: errorMessage,
    status: error.response?.status,
    data: error.response?.data,
  }
  
  return Promise.reject(enhancedError)
}

/**
 * Apply interceptors to API client
 * @description Sets up request and response interceptors for external API client
 */
apiClient.interceptors.request.use(requestInterceptor, requestErrorInterceptor)
apiClient.interceptors.response.use(responseInterceptor, responseErrorInterceptor)

/**
 * Apply interceptors to internal API client
 * @description Sets up simplified interceptors for internal API routes
 */
internalApiClient.interceptors.request.use(
  async (config) => {
    // Add CSRF token for internal API calls if needed
    if (typeof window !== 'undefined') {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
      if (csrfToken) {
        config.headers['X-CSRF-Token'] = csrfToken
      }
    }
    
    // Log internal API requests in development
    if (process.env.NODE_ENV === 'development') {
      console.log('🔗 Internal API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
      })
    }
    
    return config
  },
  (error) => {
    console.error('❌ Internal API Request Error:', error)
    return Promise.reject(error)
  }
)

internalApiClient.interceptors.response.use(
  (response) => {
    // Log internal API responses in development
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Internal API Response:', {
        method: response.config.method?.toUpperCase(),
        url: response.config.url,
        status: response.status,
        data: response.data,
      })
    }
    
    return response
  },
  (error) => {
    console.error('❌ Internal API Error:', error)
    return Promise.reject(error)
  }
)

/**
 * Utility functions for common API operations
 * @namespace ApiUtils
 * @description Provides utility functions for common API operations
 */

/**
 * Generic GET request function
 * @function get
 * @template T - Expected response data type
 * @description Makes a GET request to the specified endpoint
 * @param {string} endpoint - API endpoint to call
 * @param {Object} config - Optional Axios request configuration
 * @returns {Promise<T>} Promise resolving to response data
 * @example
 * ```typescript
 * import { get } from '@/lib/axios'
 * 
 * interface User {
 *   id: string
 *   name: string
 *   email: string
 * }
 * 
 * const users = await get<User[]>('/users')
 * ```
 */
export const get = <T = any>(endpoint: string, config = {}): Promise<T> => {
  return apiClient.get<T>(endpoint, config).then(response => response.data)
}

/**
 * Generic POST request function
 * @function post
 * @template T - Expected response data type
 * @description Makes a POST request to the specified endpoint
 * @param {string} endpoint - API endpoint to call
 * @param {any} data - Request payload data
 * @param {Object} config - Optional Axios request configuration
 * @returns {Promise<T>} Promise resolving to response data
 * @example
 * ```typescript
 * import { post } from '@/lib/axios'
 * 
 * const newUser = await post<User>('/users', {
 *   name: 'John Doe',
 *   email: 'john@example.com'
 * })
 * ```
 */
export const post = <T = any>(endpoint: string, data: any, config = {}): Promise<T> => {
  return apiClient.post<T>(endpoint, data, config).then(response => response.data)
}

/**
 * Generic PUT request function
 * @function put
 * @template T - Expected response data type
 * @description Makes a PUT request to the specified endpoint
 * @param {string} endpoint - API endpoint to call
 * @param {any} data - Request payload data
 * @param {Object} config - Optional Axios request configuration
 * @returns {Promise<T>} Promise resolving to response data
 * @example
 * ```typescript
 * import { put } from '@/lib/axios'
 * 
 * const updatedUser = await put<User>('/users/1', {
 *   name: 'John Updated'
 * })
 * ```
 */
export const put = <T = any>(endpoint: string, data: any, config = {}): Promise<T> => {
  return apiClient.put<T>(endpoint, data, config).then(response => response.data)
}

/**
 * Generic DELETE request function
 * @function del
 * @description Makes a DELETE request to the specified endpoint
 * @param {string} endpoint - API endpoint to call
 * @param {Object} config - Optional Axios request configuration
 * @returns {Promise<void>} Promise resolving when deletion is complete
 * @example
 * ```typescript
 * import { del } from '@/lib/axios'
 * 
 * await del('/users/1')
 * console.log('User deleted')
 * ```
 */
export const del = (endpoint: string, config = {}): Promise<void> => {
  return apiClient.delete(endpoint, config).then(() => undefined)
}

/**
 * Internal API request function
 * @function internalApi
 * @template T - Expected response data type
 * @description Makes a request to internal Next.js API routes
 * @param {string} method - HTTP method
 * @param {string} endpoint - API endpoint (starting with /api)
 * @param {any} data - Request payload data (optional)
 * @param {Object} config - Optional Axios request configuration
 * @returns {Promise<T>} Promise resolving to response data
 * @example
 * ```typescript
 * import { internalApi } from '@/lib/axios'
 * 
 * // Register user
 * const result = await internalApi<{message: string, user: User}>(
 *   'POST',
 *   '/api/auth/register',
 *   { name: 'John', email: 'john@example.com', password: 'password123' }
 * )
 * ```
 */
export const internalApi = <T = any>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  endpoint: string,
  data?: any,
  config = {}
): Promise<T> => {
  const request = method.toLowerCase() === 'get' || method.toLowerCase() === 'delete'
    ? internalApiClient[method.toLowerCase() as 'get' | 'delete'](endpoint, config)
    : internalApiClient[method.toLowerCase() as 'post' | 'put'](endpoint, data, config)
    
  return request.then(response => response.data)
}

/**
 * Export configured Axios instances and utility functions
 * @description Main exports for the axios configuration module
 */
export default {
  apiClient,
  internalApiClient,
  get,
  post,
  put,
  del,
  internalApi,
}

/**
 * Type definitions for TypeScript support
 * @description Extended type definitions for Axios with metadata
 */
declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    metadata?: {
      startTime: number
    }
  }
}