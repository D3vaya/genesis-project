/**
 * @fileoverview UI state management with Zustand
 * @description Manages global UI state including sidebar, theme, loading states, and notifications
 * @author Generated SaaS Template
 * @version 1.0.0
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/**
 * Theme options for the application
 * @typedef {'light' | 'dark' | 'system'} Theme
 * @description Available theme modes for the application
 */
type Theme = "light" | "dark" | "system";

/**
 * Notification severity levels
 * @typedef {'success' | 'error' | 'warning' | 'info'} NotificationSeverity
 * @description Available severity levels for notifications
 */
type NotificationSeverity = "success" | "error" | "warning" | "info";

/**
 * Notification interface
 * @interface Notification
 * @description Structure for system notifications
 * @property {string} id - Unique notification identifier
 * @property {string} title - Notification title
 * @property {string} message - Notification message content
 * @property {NotificationSeverity} severity - Notification severity level
 * @property {number} duration - Auto-dismiss duration in milliseconds (0 = no auto-dismiss)
 * @property {Date} timestamp - When the notification was created
 */
interface Notification {
  id: string;
  title: string;
  message: string;
  severity: NotificationSeverity;
  duration: number;
  timestamp: Date;
}

/**
 * UI store state interface
 * @interface UIState
 * @description Defines the structure of the UI store state
 * @property {boolean} sidebarCollapsed - Whether the sidebar is collapsed
 * @property {Theme} theme - Current theme mode
 * @property {boolean} isLoading - Global loading state
 * @property {Notification[]} notifications - Array of active notifications
 * @property {boolean} isMobile - Whether the current viewport is mobile
 */
interface UIState {
  // Sidebar state
  sidebarCollapsed: boolean;

  // Theme state
  theme: Theme;

  // Loading states
  isLoading: boolean;

  // Notifications
  notifications: Notification[];

  // Responsive state
  isMobile: boolean;

  // Actions
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setTheme: (theme: Theme) => void;
  setLoading: (loading: boolean) => void;
  addNotification: (
    notification: Omit<Notification, "id" | "timestamp">
  ) => string;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  setIsMobile: (isMobile: boolean) => void;
}

/**
 * UI store using Zustand
 * @description Global state management for UI components and interactions
 * @type {import('zustand').StoreApi<UIState>}
 * @example
 * ```typescript
 * import { useUIStore } from '@/stores/uiStore'
 *
 * function SidebarToggle() {
 *   const { sidebarCollapsed, toggleSidebar } = useUIStore()
 *
 *   return (
 *     <button onClick={toggleSidebar}>
 *       {sidebarCollapsed ? 'Expand' : 'Collapse'}
 *     </button>
 *   )
 * }
 * ```
 */
export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      sidebarCollapsed: false,
      theme: "system",
      isLoading: false,
      notifications: [],
      isMobile: false,

      /**
       * Toggles sidebar collapsed state
       * @function toggleSidebar
       * @description Toggles the sidebar between collapsed and expanded states
       * @example
       * ```typescript
       * const { toggleSidebar } = useUIStore()
       * toggleSidebar() // Switches sidebar state
       * ```
       */
      toggleSidebar: () => {
        set((state) => ({
          sidebarCollapsed: !state.sidebarCollapsed,
        }));
      },

      /**
       * Sets sidebar collapsed state
       * @function setSidebarCollapsed
       * @description Directly sets the sidebar collapsed state
       * @param {boolean} collapsed - Whether sidebar should be collapsed
       * @example
       * ```typescript
       * const { setSidebarCollapsed } = useUIStore()
       * setSidebarCollapsed(true) // Collapse sidebar
       * setSidebarCollapsed(false) // Expand sidebar
       * ```
       */
      setSidebarCollapsed: (collapsed: boolean) => {
        set({ sidebarCollapsed: collapsed });
      },

      /**
       * Sets the application theme
       * @function setTheme
       * @description Updates the current theme mode
       * @param {Theme} theme - Theme mode to set ('light', 'dark', or 'system')
       * @example
       * ```typescript
       * const { setTheme } = useUIStore()
       * setTheme('dark') // Switch to dark mode
       * setTheme('system') // Follow system preference
       * ```
       */
      setTheme: (theme: Theme) => {
        set({ theme });

        // Apply theme to document
        if (typeof window !== "undefined") {
          if (theme === "dark") {
            document.documentElement.classList.add("dark");
          } else if (theme === "light") {
            document.documentElement.classList.remove("dark");
          } else {
            // System theme
            const prefersDark = window.matchMedia(
              "(prefers-color-scheme: dark)"
            ).matches;
            if (prefersDark) {
              document.documentElement.classList.add("dark");
            } else {
              document.documentElement.classList.remove("dark");
            }
          }
        }
      },

      /**
       * Sets global loading state
       * @function setLoading
       * @description Updates the global loading state for the application
       * @param {boolean} loading - Loading state value
       * @example
       * ```typescript
       * const { setLoading } = useUIStore()
       * setLoading(true) // Show global loading indicator
       * setLoading(false) // Hide global loading indicator
       * ```
       */
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      /**
       * Adds a new notification
       * @function addNotification
       * @description Adds a notification to the notifications array
       * @param {Omit<Notification, 'id' | 'timestamp'>} notification - Notification data without id and timestamp
       * @returns {string} The generated notification ID
       * @example
       * ```typescript
       * const { addNotification } = useUIStore()
       * addNotification({
       *   title: 'Success',
       *   message: 'Operation completed successfully',
       *   severity: 'success',
       *   duration: 3000
       * })
       * ```
       */
      addNotification: (
        notification: Omit<Notification, "id" | "timestamp">
      ) => {
        const id = crypto.randomUUID();
        const newNotification: Notification = {
          ...notification,
          id,
          timestamp: new Date(),
        };

        set((state) => ({
          notifications: [...state.notifications, newNotification],
        }));

        // Auto-remove notification after duration
        if (notification.duration > 0) {
          setTimeout(() => {
            get().removeNotification(id);
          }, notification.duration);
        }

        return id;
      },

      /**
       * Removes a notification by ID
       * @function removeNotification
       * @description Removes a specific notification from the notifications array
       * @param {string} id - Notification ID to remove
       * @example
       * ```typescript
       * const { removeNotification } = useUIStore()
       * removeNotification('notification-id-123')
       * ```
       */
      removeNotification: (id: string) => {
        set((state) => ({
          notifications: state.notifications.filter(
            (notification) => notification.id !== id
          ),
        }));
      },

      /**
       * Clears all notifications
       * @function clearNotifications
       * @description Removes all notifications from the notifications array
       * @example
       * ```typescript
       * const { clearNotifications } = useUIStore()
       * clearNotifications() // Removes all notifications
       * ```
       */
      clearNotifications: () => {
        set({ notifications: [] });
      },

      /**
       * Sets mobile viewport state
       * @function setIsMobile
       * @description Updates the mobile viewport state for responsive behavior
       * @param {boolean} isMobile - Whether the current viewport is mobile
       * @example
       * ```typescript
       * const { setIsMobile } = useUIStore()
       * setIsMobile(window.innerWidth < 768) // Set based on viewport width
       * ```
       */
      setIsMobile: (isMobile: boolean) => {
        set({ isMobile });
      },
    }),
    {
      name: "ui-store",
      storage: createJSONStorage(() => 
        typeof window !== 'undefined' ? localStorage : {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        }
      ),
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        theme: state.theme,
      }),
    }
  )
);

/**
 * Selector hook for sidebar state
 * @function useSidebar
 * @description Custom hook to get sidebar state and actions
 * @returns {Object} Sidebar state and toggle function
 * @example
 * ```typescript
 * import { useSidebar } from '@/stores/uiStore'
 *
 * function SidebarComponent() {
 *   const { sidebarCollapsed, toggleSidebar } = useSidebar()
 *
 *   return (
 *     <div className={sidebarCollapsed ? 'collapsed' : 'expanded'}>
 *       <button onClick={toggleSidebar}>Toggle</button>
 *     </div>
 *   )
 * }
 * ```
 */
export const useSidebar = () =>
  useUIStore((state) => ({
    sidebarCollapsed: state.sidebarCollapsed,
    toggleSidebar: state.toggleSidebar,
    setSidebarCollapsed: state.setSidebarCollapsed,
  }));

/**
 * Selector hook for theme state
 * @function useTheme
 * @description Custom hook to get current theme and theme setter
 * @returns {Object} Current theme and setter function
 * @example
 * ```typescript
 * import { useTheme } from '@/stores/uiStore'
 *
 * function ThemeToggle() {
 *   const { theme, setTheme } = useTheme()
 *
 *   return (
 *     <select value={theme} onChange={(e) => setTheme(e.target.value as Theme)}>
 *       <option value="light">Light</option>
 *       <option value="dark">Dark</option>
 *       <option value="system">System</option>
 *     </select>
 *   )
 * }
 * ```
 */
export const useTheme = () =>
  useUIStore((state) => ({
    theme: state.theme,
    setTheme: state.setTheme,
  }));

/**
 * Selector hook for notifications
 * @function useNotifications
 * @description Custom hook to get notifications and notification actions
 * @returns {Object} Notifications array and management functions
 * @example
 * ```typescript
 * import { useNotifications } from '@/stores/uiStore'
 *
 * function NotificationCenter() {
 *   const { notifications, addNotification, removeNotification } = useNotifications()
 *
 *   const showSuccess = () => {
 *     addNotification({
 *       title: 'Success!',
 *       message: 'Task completed',
 *       severity: 'success',
 *       duration: 3000
 *     })
 *   }
 *
 *   return (
 *     <div>
 *       {notifications.map(notification => (
 *         <div key={notification.id}>
 *           <h3>{notification.title}</h3>
 *           <p>{notification.message}</p>
 *           <button onClick={() => removeNotification(notification.id)}>
 *             Close
 *           </button>
 *         </div>
 *       ))}
 *     </div>
 *   )
 * }
 * ```
 */
const notificationsSelector = (state: UIState) => state.notifications
const addNotificationSelector = (state: UIState) => state.addNotification
const removeNotificationSelector = (state: UIState) => state.removeNotification
const clearNotificationsSelector = (state: UIState) => state.clearNotifications

export const useNotifications = () => {
  const notifications = useUIStore(notificationsSelector)
  const addNotification = useUIStore(addNotificationSelector)
  const removeNotification = useUIStore(removeNotificationSelector)
  const clearNotifications = useUIStore(clearNotificationsSelector)
  
  return {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
  }
};

/**
 * Export notification types for external use
 * @type {NotificationSeverity}
 * @description Export notification severity type for use in components
 */
export type { NotificationSeverity, Notification };
