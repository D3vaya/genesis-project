/**
 * @fileoverview Custom UI state management hook
 * @description Provides convenient interface for UI state management including sidebar, theme, and notifications
 * @author Generated SaaS Template
 * @version 1.0.0
 */

import { useEffect, useCallback } from 'react'
import { useUIStore, useNotifications, useSidebar, useTheme } from '@/stores/uiStore'
import type { NotificationSeverity } from '@/stores/uiStore'

/**
 * UI hook return type
 * @interface UseUIReturn
 * @description Defines the structure of the useUI hook return value
 * @property {boolean} sidebarCollapsed - Whether sidebar is collapsed
 * @property {Function} toggleSidebar - Function to toggle sidebar state
 * @property {Function} setSidebarCollapsed - Function to set sidebar collapsed state
 * @property {string} theme - Current theme mode
 * @property {Function} setTheme - Function to change theme
 * @property {boolean} isLoading - Global loading state
 * @property {Function} setLoading - Function to set loading state
 * @property {Array} notifications - Array of active notifications
 * @property {Function} addNotification - Function to add notification
 * @property {Function} removeNotification - Function to remove notification
 * @property {Function} clearNotifications - Function to clear all notifications
 * @property {boolean} isMobile - Whether current viewport is mobile
 * @property {Function} setIsMobile - Function to set mobile state
 */
interface UseUIReturn {
  sidebarCollapsed: boolean
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
  theme: 'light' | 'dark' | 'system'
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  isLoading: boolean
  setLoading: (loading: boolean) => void
  notifications: Array<{
    id: string
    title: string
    message: string
    severity: NotificationSeverity
    duration: number
    timestamp: Date
  }>
  addNotification: (notification: {
    title: string
    message: string
    severity: NotificationSeverity
    duration: number
  }) => string
  removeNotification: (id: string) => void
  clearNotifications: () => void
  isMobile: boolean
  setIsMobile: (isMobile: boolean) => void
}

/**
 * Custom UI state management hook
 * @hook useUI
 * @description Provides comprehensive UI state management and utility functions
 * @returns {UseUIReturn} UI state and actions object
 * @example
 * ```typescript
 * import { useUI } from '@/hooks/useUI'
 * 
 * function Layout() {
 *   const {
 *     sidebarCollapsed,
 *     toggleSidebar,
 *     theme,
 *     setTheme,
 *     addNotification,
 *     isLoading,
 *     isMobile
 *   } = useUI()
 *   
 *   const handleSuccess = () => {
 *     addNotification({
 *       title: 'Success!',
 *       message: 'Operation completed successfully',
 *       severity: 'success',
 *       duration: 3000
 *     })
 *   }
 *   
 *   return (
 *     <div className={`layout ${sidebarCollapsed ? 'collapsed' : 'expanded'}`}>
 *       <button onClick={toggleSidebar}>
 *         Toggle Sidebar
 *       </button>
 *       <select value={theme} onChange={(e) => setTheme(e.target.value)}>
 *         <option value="light">Light</option>
 *         <option value="dark">Dark</option>
 *         <option value="system">System</option>
 *       </select>
 *       {isLoading && <div>Loading...</div>}
 *       <button onClick={handleSuccess}>Show Success</button>
 *     </div>
 *   )
 * }
 * ```
 */
export const useUI = (): UseUIReturn => {
  const {
    sidebarCollapsed,
    toggleSidebar,
    setSidebarCollapsed,
    theme,
    setTheme,
    isLoading,
    setLoading,
    isMobile,
    setIsMobile
  } = useUIStore()

  const {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications
  } = useNotifications()

  /**
   * Handle window resize for mobile detection
   * @description Updates mobile state based on window size
   */
  const handleResize = useCallback(() => {
    const mobile = window.innerWidth < 768
    if (mobile !== isMobile) {
      setIsMobile(mobile)
      
      // Auto-collapse sidebar on mobile
      if (mobile && !sidebarCollapsed) {
        setSidebarCollapsed(true)
      }
    }
  }, [isMobile, setIsMobile, sidebarCollapsed, setSidebarCollapsed])

  /**
   * Setup window resize listener
   * @description Monitors window resize events for responsive behavior
   */
  useEffect(() => {
    // Initial check
    handleResize()
    
    // Add event listener
    window.addEventListener('resize', handleResize)
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [handleResize])

  /**
   * Enhanced notification function with toast integration
   * @function showNotification
   * @description Creates notification with additional features
   * @param {string} title - Notification title
   * @param {string} message - Notification message
   * @param {NotificationSeverity} severity - Notification severity level
   * @param {number} duration - Auto-dismiss duration (0 = no auto-dismiss)
   * @param {Object} options - Additional notification options
   * @returns {string} Notification ID
   * @example
   * ```typescript
   * const notificationId = showNotification(
   *   'Success',
   *   'Data saved successfully',
   *   'success',
   *   3000,
   *   { persistent: false }
   * )
   * ```
   */
  const showNotification = useCallback((
    title: string,
    message: string,
    severity: NotificationSeverity = 'info',
    duration: number = 4000,
    options: { persistent?: boolean } = {}
  ): string => {
    const finalDuration = options.persistent ? 0 : duration
    
    return addNotification({
      title,
      message,
      severity,
      duration: finalDuration
    })
  }, [addNotification])

  /**
   * Show success notification
   * @function showSuccess
   * @description Convenience method for success notifications
   * @param {string} message - Success message
   * @param {string} title - Optional title (defaults to 'Éxito')
   * @param {number} duration - Optional duration (defaults to 3000ms)
   * @returns {string} Notification ID
   * @example
   * ```typescript
   * showSuccess('Profile updated successfully')
   * showSuccess('Data saved', 'Great!', 2000)
   * ```
   */
  const showSuccess = useCallback((
    message: string,
    title: string = 'Éxito',
    duration: number = 3000
  ): string => {
    return showNotification(title, message, 'success', duration)
  }, [showNotification])

  /**
   * Show error notification
   * @function showError
   * @description Convenience method for error notifications
   * @param {string} message - Error message
   * @param {string} title - Optional title (defaults to 'Error')
   * @param {number} duration - Optional duration (defaults to 5000ms)
   * @returns {string} Notification ID
   * @example
   * ```typescript
   * showError('Failed to save data')
   * showError('Connection failed', 'Network Error', 6000)
   * ```
   */
  const showError = useCallback((
    message: string,
    title: string = 'Error',
    duration: number = 5000
  ): string => {
    return showNotification(title, message, 'error', duration)
  }, [showNotification])

  /**
   * Show warning notification
   * @function showWarning
   * @description Convenience method for warning notifications
   * @param {string} message - Warning message
   * @param {string} title - Optional title (defaults to 'Advertencia')
   * @param {number} duration - Optional duration (defaults to 4000ms)
   * @returns {string} Notification ID
   * @example
   * ```typescript
   * showWarning('This action cannot be undone')
   * showWarning('Low disk space', 'Warning!', 0) // Persistent
   * ```
   */
  const showWarning = useCallback((
    message: string,
    title: string = 'Advertencia',
    duration: number = 4000
  ): string => {
    return showNotification(title, message, 'warning', duration)
  }, [showNotification])

  /**
   * Show info notification
   * @function showInfo
   * @description Convenience method for info notifications
   * @param {string} message - Info message
   * @param {string} title - Optional title (defaults to 'Información')
   * @param {number} duration - Optional duration (defaults to 4000ms)
   * @returns {string} Notification ID
   * @example
   * ```typescript
   * showInfo('New features available')
   * showInfo('Maintenance scheduled', 'Notice', 7000)
   * ```
   */
  const showInfo = useCallback((
    message: string,
    title: string = 'Información',
    duration: number = 4000
  ): string => {
    return showNotification(title, message, 'info', duration)
  }, [showNotification])

  /**
   * Toggle theme between light and dark
   * @function toggleTheme
   * @description Switches between light and dark themes
   * @example
   * ```typescript
   * toggleTheme() // Switches from light to dark or vice versa
   * ```
   */
  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
  }, [theme, setTheme])

  /**
   * Get responsive sidebar behavior
   * @function shouldCollapseSidebar
   * @description Determines if sidebar should be collapsed based on screen size
   * @returns {boolean} Whether sidebar should be collapsed
   * @example
   * ```typescript
   * const shouldCollapse = shouldCollapseSidebar()
   * if (shouldCollapse && !sidebarCollapsed) {
   *   setSidebarCollapsed(true)
   * }
   * ```
   */
  const shouldCollapseSidebar = useCallback((): boolean => {
    return isMobile
  }, [isMobile])

  /**
   * Set loading state with optional timeout
   * @function setLoadingWithTimeout
   * @description Sets loading state with automatic timeout
   * @param {boolean} loading - Loading state
   * @param {number} timeout - Optional timeout in milliseconds
   * @example
   * ```typescript
   * setLoadingWithTimeout(true, 5000) // Auto-clear after 5 seconds
   * ```
   */
  const setLoadingWithTimeout = useCallback((
    loading: boolean,
    timeout?: number
  ) => {
    setLoading(loading)
    
    if (loading && timeout) {
      setTimeout(() => {
        setLoading(false)
      }, timeout)
    }
  }, [setLoading])

  return {
    // Core UI state
    sidebarCollapsed,
    toggleSidebar,
    setSidebarCollapsed,
    theme,
    setTheme,
    isLoading,
    setLoading,
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
    isMobile,
    setIsMobile,
    
    // Enhanced functions
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    toggleTheme,
    shouldCollapseSidebar,
    setLoadingWithTimeout,
  } as UseUIReturn & {
    showNotification: (title: string, message: string, severity?: NotificationSeverity, duration?: number, options?: { persistent?: boolean }) => string
    showSuccess: (message: string, title?: string, duration?: number) => string
    showError: (message: string, title?: string, duration?: number) => string
    showWarning: (message: string, title?: string, duration?: number) => string
    showInfo: (message: string, title?: string, duration?: number) => string
    toggleTheme: () => void
    shouldCollapseSidebar: () => boolean
    setLoadingWithTimeout: (loading: boolean, timeout?: number) => void
  }
}

/**
 * Hook for sidebar state only
 * @hook useSidebarState
 * @description Lightweight hook for sidebar state management
 * @returns {Object} Sidebar state and controls
 * @example
 * ```typescript
 * import { useSidebarState } from '@/hooks/useUI'
 * 
 * function SidebarToggle() {
 *   const { sidebarCollapsed, toggleSidebar } = useSidebarState()
 *   
 *   return (
 *     <button onClick={toggleSidebar}>
 *       {sidebarCollapsed ? 'Expand' : 'Collapse'} Sidebar
 *     </button>
 *   )
 * }
 * ```
 */
export const useSidebarState = () => {
  const { sidebarCollapsed, toggleSidebar, setSidebarCollapsed } = useSidebar()
  
  return {
    sidebarCollapsed,
    toggleSidebar,
    setSidebarCollapsed
  }
}

/**
 * Hook for theme state only
 * @hook useThemeState
 * @description Lightweight hook for theme state management
 * @returns {Object} Theme state and controls
 * @example
 * ```typescript
 * import { useThemeState } from '@/hooks/useUI'
 * 
 * function ThemeToggle() {
 *   const { theme, setTheme } = useThemeState()
 *   
 *   return (
 *     <select value={theme} onChange={(e) => setTheme(e.target.value)}>
 *       <option value="light">Light</option>
 *       <option value="dark">Dark</option>
 *       <option value="system">System</option>
 *     </select>
 *   )
 * }
 * ```
 */
export const useThemeState = () => {
  const { theme, setTheme } = useTheme()
  
  return {
    theme,
    setTheme
  }
}

/**
 * Hook for notifications only
 * @hook useNotificationState
 * @description Lightweight hook for notification management
 * @returns {Object} Notification state and controls
 * @example
 * ```typescript
 * import { useNotificationState } from '@/hooks/useUI'
 * 
 * function NotificationDemo() {
 *   const { notifications, addNotification, removeNotification } = useNotificationState()
 *   
 *   const showDemo = () => {
 *     addNotification({
 *       title: 'Demo',
 *       message: 'This is a demo notification',
 *       severity: 'info',
 *       duration: 3000
 *     })
 *   }
 *   
 *   return (
 *     <div>
 *       <button onClick={showDemo}>Show Notification</button>
 *       <div>Active notifications: {notifications.length}</div>
 *     </div>
 *   )
 * }
 * ```
 */
export const useNotificationState = () => {
  const {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications
  } = useNotifications()
  
  return {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications
  }
}