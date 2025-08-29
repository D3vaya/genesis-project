/**
 * @fileoverview Navigation configuration for dashboard layouts
 * @description Centralized navigation configuration for reuse across dashboard pages
 * @author Generated SaaS Template
 * @version 1.0.0
 */

import { LucideIcon } from "lucide-react";
import {
  Home,
  Users,
  BarChart3,
  Activity,
  Calendar,
  Settings,
  User,
  FileText,
  CreditCard,
  Bell,
  Shield,
  Database,
  Zap,
} from "lucide-react";

/**
 * Navigation item interface
 * @interface NavigationItem
 * @description Structure for navigation menu items
 */
export interface NavigationItem {
  title: string;
  url: string;
  icon: LucideIcon;
  isActive?: boolean;
  badge?: string;
  disabled?: boolean;
}

/**
 * Navigation group interface
 * @interface NavigationGroup
 * @description Structure for grouping navigation items
 */
export interface NavigationGroup {
  label: string;
  items: NavigationItem[];
}

/**
 * Default main navigation items
 * @const {NavigationItem[]} DEFAULT_NAVIGATION_ITEMS
 * @description Default navigation items for dashboard
 */
export const DEFAULT_NAVIGATION_ITEMS: NavigationItem[] = [
  {
    title: "Inicio",
    url: "/dashboard",
    icon: Home,
    isActive: true,
  },
  {
    title: "Usuarios",
    url: "/dashboard/users",
    icon: Users,
  },
  {
    title: "Estadísticas",
    url: "/dashboard/stats",
    icon: BarChart3,
  },
  {
    title: "Actividad",
    url: "/dashboard/activity",
    icon: Activity,
  },
  {
    title: "Calendario",
    url: "/dashboard/calendar",
    icon: Calendar,
  },
];

/**
 * Default settings navigation items
 * @const {NavigationItem[]} DEFAULT_SETTINGS_ITEMS
 * @description Default settings navigation items
 */
export const DEFAULT_SETTINGS_ITEMS: NavigationItem[] = [
  {
    title: "Configuración",
    url: "/dashboard/settings",
    icon: Settings,
  },
  {
    title: "Perfil",
    url: "/dashboard/profile",
    icon: User,
  },
];

/**
 * Admin navigation items
 * @const {NavigationItem[]} ADMIN_NAVIGATION_ITEMS
 * @description Navigation items for admin pages
 */
export const ADMIN_NAVIGATION_ITEMS: NavigationItem[] = [
  {
    title: "Panel Admin",
    url: "/admin",
    icon: Shield,
    isActive: true,
  },
  {
    title: "Base de Datos",
    url: "/admin/database",
    icon: Database,
  },
  {
    title: "Sistema",
    url: "/admin/system",
    icon: Zap,
  },
  {
    title: "Logs",
    url: "/admin/logs",
    icon: FileText,
  },
];

/**
 * Billing navigation items
 * @const {NavigationItem[]} BILLING_NAVIGATION_ITEMS
 * @description Navigation items for billing pages
 */
export const BILLING_NAVIGATION_ITEMS: NavigationItem[] = [
  {
    title: "Facturación",
    url: "/billing",
    icon: CreditCard,
    isActive: true,
  },
  {
    title: "Suscripciones",
    url: "/billing/subscriptions",
    icon: FileText,
  },
  {
    title: "Historial",
    url: "/billing/history",
    icon: Activity,
  },
];

/**
 * Navigation configuration presets
 * @const {Object} NAVIGATION_PRESETS
 * @description Pre-configured navigation setups for different layouts
 */
export const NAVIGATION_PRESETS = {
  dashboard: {
    main: DEFAULT_NAVIGATION_ITEMS,
    settings: DEFAULT_SETTINGS_ITEMS,
  },
  admin: {
    main: ADMIN_NAVIGATION_ITEMS,
    settings: DEFAULT_SETTINGS_ITEMS,
  },
  billing: {
    main: BILLING_NAVIGATION_ITEMS,
    settings: DEFAULT_SETTINGS_ITEMS,
  },
} as const;

/**
 * Application branding configuration
 * @interface AppBranding
 * @description Branding configuration for the sidebar header
 */
export interface AppBranding {
  name: string;
  subtitle: string;
  icon: LucideIcon;
}

/**
 * Default app branding
 * @const {AppBranding} DEFAULT_APP_BRANDING
 * @description Default branding for SaaS template
 */
export const DEFAULT_APP_BRANDING: AppBranding = {
  name: "SaaS Template",
  subtitle: "Dashboard",
  icon: BarChart3,
};

/**
 * Utility function to mark active navigation item
 * @function setActiveNavigation
 * @description Sets the active navigation item based on current path
 * @param {NavigationItem[]} items - Navigation items
 * @param {string} currentPath - Current path
 * @returns {NavigationItem[]} Navigation items with updated active state
 */
export function setActiveNavigation(
  items: NavigationItem[],
  currentPath: string
): NavigationItem[] {
  return items.map((item) => ({
    ...item,
    isActive:
      currentPath === item.url || currentPath.startsWith(`${item.url}/`),
  }));
}

/**
 * Utility function to create navigation groups
 * @function createNavigationGroups
 * @description Creates grouped navigation structure
 * @param {Object} config - Navigation configuration
 * @returns {NavigationGroup[]} Grouped navigation structure
 */
export function createNavigationGroups(config: {
  main: NavigationItem[];
  settings?: NavigationItem[];
  custom?: { label: string; items: NavigationItem[] }[];
}): NavigationGroup[] {
  const groups: NavigationGroup[] = [
    {
      label: "Navegación",
      items: config.main,
    },
  ];

  if (config.settings && config.settings.length > 0) {
    groups.push({
      label: "Configuración",
      items: config.settings,
    });
  }

  if (config.custom) {
    groups.push(...config.custom);
  }

  return groups;
}
