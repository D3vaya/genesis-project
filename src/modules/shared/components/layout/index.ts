/**
 * @fileoverview Layout components barrel export
 * @description Central export file for all layout components
 * @author Generated SaaS Template
 * @version 1.0.0
 */

// Main layout components
export { AppSidebar } from './AppSidebar'
export type { AppSidebarProps } from './AppSidebar'

export { DashboardHeader } from './DashboardHeader'
export type { DashboardHeaderProps, HeaderAction } from './DashboardHeader'

export {
  DashboardLayout,
  AdminDashboardLayout,
  MinimalDashboardLayout,
  FullPageDashboardLayout,
} from './DashboardLayout'
export type { DashboardLayoutProps } from './DashboardLayout'

// Navigation configuration
export {
  DEFAULT_NAVIGATION_ITEMS,
  DEFAULT_SETTINGS_ITEMS,
  ADMIN_NAVIGATION_ITEMS,
  BILLING_NAVIGATION_ITEMS,
  NAVIGATION_PRESETS,
  DEFAULT_APP_BRANDING,
  setActiveNavigation,
  createNavigationGroups,
} from '../../config/navigation'

export type {
  NavigationItem,
  NavigationGroup,
  AppBranding,
} from '../../config/navigation'
