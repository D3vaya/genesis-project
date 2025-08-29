/**
 * @fileoverview Custom UI state management hook
 * @description Provides convenient interface for UI state management including sidebar and theme
 * @author Generated SaaS Template
 * @version 1.0.0
 */

import { useEffect, useCallback } from 'react'
import {
  useUIStore,
  useSidebar,
  useTheme,
} from '@/modules/shared/stores/uiStore'

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
 *     isLoading,
 *     isMobile
 *   } = useUI()
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
    setIsMobile,
  } = useUIStore()

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
  const setLoadingWithTimeout = useCallback(
    (loading: boolean, timeout?: number) => {
      setLoading(loading)

      if (loading && timeout) {
        setTimeout(() => {
          setLoading(false)
        }, timeout)
      }
    },
    [setLoading]
  )

  return {
    // Core UI state
    sidebarCollapsed,
    toggleSidebar,
    setSidebarCollapsed,
    theme,
    setTheme,
    isLoading,
    setLoading,
    isMobile,
    setIsMobile,

    // Enhanced functions
    toggleTheme,
    shouldCollapseSidebar,
    setLoadingWithTimeout,
  } as UseUIReturn & {
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
    setSidebarCollapsed,
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
    setTheme,
  }
}
