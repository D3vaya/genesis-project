/**
 * @fileoverview Global providers component for the SaaS application
 * @description Combines all global providers including NextAuth SessionProvider, theme provider, and notification system
 * @author Generated SaaS Template
 * @version 1.0.0
 */

'use client'

import React, { useState, useEffect, ReactNode } from 'react'
import { SessionProvider } from 'next-auth/react'
import { useUIStore, useNotifications } from '@/stores/uiStore'
import { useAuthStore } from '@/stores/authStore'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { X, CheckCircle, AlertTriangle, Info, AlertCircle } from 'lucide-react'

/**
 * Notification display component
 * @component NotificationDisplay
 * @description Renders active notifications with appropriate styling and dismiss functionality
 * @returns {React.JSX.Element} Notification display component
 * @example
 * ```typescript
 * <NotificationDisplay />
 * ```
 */
function NotificationDisplay(): React.JSX.Element {
  const { notifications, removeNotification } = useNotifications()

  if (notifications.length === 0) return <></>

  /**
   * Get notification icon based on severity
   * @function getNotificationIcon
   * @description Returns appropriate icon component for notification severity
   * @param {'success' | 'error' | 'warning' | 'info'} severity - Notification severity
   * @returns {React.JSX.Element} Icon component
   */
  const getNotificationIcon = (severity: 'success' | 'error' | 'warning' | 'info'): React.JSX.Element => {
    switch (severity) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case 'info':
        return <Info className="h-4 w-4 text-blue-600" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  /**
   * Get notification variant for Alert component
   * @function getNotificationVariant
   * @description Returns appropriate Alert variant for notification severity
   * @param {'success' | 'error' | 'warning' | 'info'} severity - Notification severity
   * @returns {'default' | 'destructive'} Alert variant
   */
  const getNotificationVariant = (severity: 'success' | 'error' | 'warning' | 'info'): 'default' | 'destructive' => {
    return severity === 'error' ? 'destructive' : 'default'
  }

  return (
    <div 
      className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full pointer-events-none"
      role="region"
      aria-label="Notifications"
      aria-live="polite"
    >
      {notifications.map((notification) => (
        <Alert
          key={notification.id}
          variant={getNotificationVariant(notification.severity)}
          className="pointer-events-auto shadow-lg border animate-in slide-in-from-right"
        >
          <div className="flex items-start space-x-2">
            {getNotificationIcon(notification.severity)}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-sm">{notification.title}</h4>
                  <AlertDescription className="text-sm mt-1">
                    {notification.message}
                  </AlertDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeNotification(notification.id)}
                  className="h-auto p-1 ml-2 text-muted-foreground hover:text-foreground"
                  aria-label="Dismiss notification"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </Alert>
      ))}
    </div>
  )
}

/**
 * Theme provider component
 * @component ThemeProvider
 * @description Manages theme state and applies theme classes to document
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components
 * @returns {React.JSX.Element} Theme provider component
 * @example
 * ```typescript
 * <ThemeProvider>
 *   <App />
 * </ThemeProvider>
 * ```
 */
function ThemeProvider({ children }: { children: ReactNode }): React.JSX.Element {
  const { theme, setTheme } = useUIStore()
  const [mounted, setMounted] = useState(false)

  /**
   * Apply theme to document on theme change
   * @description Updates document classes and handles system theme preference
   */
  useEffect(() => {
    setMounted(true)
    
    const applyTheme = () => {
      const root = document.documentElement
      
      // Remove existing theme classes
      root.classList.remove('light', 'dark')
      
      if (theme === 'system') {
        // Use system preference
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        root.classList.add(systemTheme)
      } else {
        // Use explicit theme
        root.classList.add(theme)
      }
    }

    applyTheme()

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme()
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme])

  /**
   * Initialize theme from localStorage on mount
   * @description Restores saved theme preference from localStorage
   */
  useEffect(() => {
    const savedTheme = localStorage.getItem('ui-store')
    if (savedTheme) {
      try {
        const parsed = JSON.parse(savedTheme)
        if (parsed.state?.theme) {
          setTheme(parsed.state.theme)
        }
      } catch (error) {
        console.warn('Failed to parse saved theme:', error)
      }
    }
  }, [setTheme])

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return <>{children}</>
  }

  return <>{children}</>
}

/**
 * Authentication state synchronizer component
 * @component AuthStateSynchronizer
 * @description Synchronizes authentication state between NextAuth and Zustand store
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components
 * @returns {React.JSX.Element} Auth state synchronizer component
 * @example
 * ```typescript
 * <AuthStateSynchronizer>
 *   <App />
 * </AuthStateSynchronizer>
 * ```
 */
function AuthStateSynchronizer({ children }: { children: ReactNode }): React.JSX.Element {
  const { checkSession } = useAuthStore()

  /**
   * Check session on component mount
   * @description Verifies current authentication session when app loads
   */
  useEffect(() => {
    checkSession()
  }, [checkSession])

  return <>{children}</>
}

/**
 * UI state initializer component
 * @component UIStateInitializer
 * @description Initializes UI state based on browser environment
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components
 * @returns {React.JSX.Element} UI state initializer component
 * @example
 * ```typescript
 * <UIStateInitializer>
 *   <App />
 * </UIStateInitializer>
 * ```
 */
function UIStateInitializer({ children }: { children: ReactNode }): React.JSX.Element {
  const { setIsMobile } = useUIStore()

  /**
   * Initialize mobile state and setup resize listener
   * @description Detects mobile viewport and sets up responsive behavior
   */
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Initial check
    checkMobile()

    // Add resize listener
    window.addEventListener('resize', checkMobile)
    
    return () => {
      window.removeEventListener('resize', checkMobile)
    }
  }, [setIsMobile])

  return <>{children}</>
}

/**
 * Error boundary component
 * @component ErrorBoundary
 * @description Catches and displays React errors gracefully
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components
 * @returns {React.JSX.Element} Error boundary component
 * @example
 * ```typescript
 * <ErrorBoundary>
 *   <App />
 * </ErrorBoundary>
 * ```
 */
function ErrorBoundary({ children }: { children: ReactNode }): React.JSX.Element {
  const [hasError, setHasError] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  /**
   * Set up global error handlers
   * @description Catches unhandled errors and promise rejections
   */
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Global error caught:', event.error)
      setError(event.error)
      setHasError(true)
    }

    const handleRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason)
      setError(new Error(event.reason))
      setHasError(true)
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleRejection)

    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleRejection)
    }
  }, [])

  /**
   * Reset error state
   * @function resetError
   * @description Clears error state and reloads the page
   */
  const resetError = () => {
    setHasError(false)
    setError(null)
    window.location.reload()
  }

  if (hasError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="space-y-2">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
            <h1 className="text-2xl font-bold text-foreground">
              ¡Ups! Algo salió mal
            </h1>
            <p className="text-muted-foreground">
              Ocurrió un error inesperado en la aplicación.
            </p>
          </div>
          
          {process.env.NODE_ENV === 'development' && error && (
            <div className="bg-muted p-4 rounded-md text-left">
              <p className="text-sm font-mono text-red-600">
                {error.message}
              </p>
              {error.stack && (
                <pre className="text-xs text-muted-foreground mt-2 overflow-x-auto">
                  {error.stack}
                </pre>
              )}
            </div>
          )}
          
          <div className="space-y-2">
            <Button onClick={resetError} className="w-full">
              Recargar Aplicación
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/'}
              className="w-full"
            >
              Ir al Inicio
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

/**
 * Main providers component
 * @component Providers
 * @description Combines all global providers for the application
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components to wrap with providers
 * @returns {React.JSX.Element} Combined providers component
 * @example
 * ```typescript
 * import { Providers } from '@/components/providers/Providers'
 * 
 * export default function RootLayout({ children }) {
 *   return (
 *     <html lang="es">
 *       <body>
 *         <Providers>
 *           {children}
 *         </Providers>
 *       </body>
 *     </html>
 *   )
 * }
 * ```
 */
export function Providers({ children }: { children: ReactNode }): React.JSX.Element {
  return (
    <ErrorBoundary>
      <SessionProvider
        // Optional: Add session configuration
        refetchInterval={5 * 60} // 5 minutes
        refetchOnWindowFocus={true}
      >
        <ThemeProvider>
          <AuthStateSynchronizer>
            <UIStateInitializer>
              {children}
              <NotificationDisplay />
            </UIStateInitializer>
          </AuthStateSynchronizer>
        </ThemeProvider>
      </SessionProvider>
    </ErrorBoundary>
  )
}

/**
 * Export individual provider components for testing or custom usage
 * @description Individual providers available for more granular control
 */
export {
  ErrorBoundary,
  ThemeProvider,
  AuthStateSynchronizer,
  UIStateInitializer,
  NotificationDisplay
}