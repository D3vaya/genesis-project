/**
 * @fileoverview Reusable dashboard layout component
 * @description Complete dashboard layout wrapper with sidebar and header
 * @author Generated SaaS Template
 * @version 1.0.0
 */

"use client";

import React from "react";
import { SidebarProvider } from "@/modules/shared/components/ui/sidebar";
import { AppSidebar, AppSidebarProps } from "./AppSidebar";
import { DashboardHeader, DashboardHeaderProps } from "./DashboardHeader";
import {
  NavigationItem,
  NavigationGroup,
  AppBranding,
  DEFAULT_NAVIGATION_ITEMS,
  DEFAULT_SETTINGS_ITEMS,
  DEFAULT_APP_BRANDING,
  createNavigationGroups,
} from "@/modules/shared/config/navigation";

/**
 * DashboardLayout component props
 * @interface DashboardLayoutProps
 * @description Props for the DashboardLayout component
 */
export interface DashboardLayoutProps {
  /**
   * Content to render in the main area
   */
  children: React.ReactNode;
  
  /**
   * Navigation configuration for sidebar
   */
  navigation?: NavigationItem[] | NavigationGroup[];
  
  /**
   * App branding configuration
   */
  branding?: AppBranding;
  
  /**
   * Header configuration
   */
  headerProps?: DashboardHeaderProps;
  
  /**
   * Sidebar configuration
   */
  sidebarProps?: Omit<AppSidebarProps, 'navigation' | 'branding'>;
  
  /**
   * Whether to show the header
   */
  showHeader?: boolean;
  
  /**
   * Whether to show the sidebar
   */
  showSidebar?: boolean;
  
  /**
   * Custom header component
   */
  customHeader?: React.ReactNode;
  
  /**
   * Custom sidebar component
   */
  customSidebar?: React.ReactNode;
  
  /**
   * Container padding
   */
  containerPadding?: "none" | "sm" | "default" | "lg";
  
  /**
   * Main content area classes
   */
  contentClassName?: string;
  
  /**
   * Full height layout
   */
  fullHeight?: boolean;
}

/**
 * Reusable Dashboard Layout Component
 * @component DashboardLayout
 * @description Complete dashboard layout with sidebar and header
 * @param {DashboardLayoutProps} props - Component props
 * @returns {React.JSX.Element} Dashboard layout
 * @example
 * ```typescript
 * import { DashboardLayout } from '@/modules/shared/components/layout/DashboardLayout'
 * import { DEFAULT_NAVIGATION_ITEMS, DEFAULT_SETTINGS_ITEMS } from '@/modules/shared/config/navigation'
 * 
 * // Simple usage
 * <DashboardLayout>
 *   <h1>Dashboard Content</h1>
 * </DashboardLayout>
 * 
 * // Custom navigation
 * <DashboardLayout
 *   navigation={[
 *     { label: "Main", items: DEFAULT_NAVIGATION_ITEMS },
 *     { label: "Settings", items: DEFAULT_SETTINGS_ITEMS }
 *   ]}
 *   branding={{ name: "My App", subtitle: "Admin", icon: Shield }}
 *   headerProps={{
 *     actions: [
 *       {
 *         label: "New Item",
 *         icon: Plus,
 *         onClick: () => handleNewItem(),
 *       }
 *     ]
 *   }}
 * >
 *   <MyDashboardContent />
 * </DashboardLayout>
 * 
 * // Custom header and sidebar
 * <DashboardLayout
 *   customHeader={<MyCustomHeader />}
 *   customSidebar={<MyCustomSidebar />}
 * >
 *   <MyContent />
 * </DashboardLayout>
 * ```
 */
export function DashboardLayout({
  children,
  navigation,
  branding = DEFAULT_APP_BRANDING,
  headerProps = {},
  sidebarProps = {},
  showHeader = true,
  showSidebar = true,
  customHeader,
  customSidebar,
  containerPadding = "default",
  contentClassName = "",
  fullHeight = true,
}: DashboardLayoutProps): React.JSX.Element {
  
  /**
   * Get container padding classes
   * @function getPaddingClasses
   * @description Returns appropriate padding classes based on variant
   * @returns {string} CSS classes for container padding
   */
  const getPaddingClasses = (): string => {
    switch (containerPadding) {
      case "none":
        return "";
      case "sm":
        return "p-2";
      case "lg":
        return "p-6 md:p-8";
      default:
        return "p-4 md:p-6";
    }
  };

  /**
   * Process navigation configuration
   * @function processNavigation
   * @description Processes navigation to ensure proper format
   * @returns {NavigationItem[] | NavigationGroup[]} Processed navigation
   */
  const processNavigation = (): NavigationItem[] | NavigationGroup[] => {
    if (navigation) {
      return navigation;
    }

    // Default navigation setup
    return createNavigationGroups({
      main: DEFAULT_NAVIGATION_ITEMS,
      settings: DEFAULT_SETTINGS_ITEMS,
    });
  };

  const processedNavigation = processNavigation();

  return (
    <SidebarProvider>
      {/* Sidebar */}
      {showSidebar && (
        customSidebar || (
          <AppSidebar
            navigation={processedNavigation}
            branding={branding}
            {...sidebarProps}
          />
        )
      )}
      
      {/* Main Content Area */}
      <main className={`flex flex-1 flex-col gap-4 pt-0 ${fullHeight ? 'min-h-screen' : ''} ${getPaddingClasses()}`}>
        {/* Header */}
        {showHeader && (
          customHeader || <DashboardHeader {...headerProps} />
        )}
        
        {/* Content */}
        <div className={`flex-1 ${contentClassName}`}>
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}

/**
 * Pre-configured dashboard layout variants
 * @namespace DashboardLayoutVariants
 * @description Pre-configured layout variants for common use cases
 */

/**
 * Admin Dashboard Layout
 * @function AdminDashboardLayout
 * @description Pre-configured layout for admin pages
 * @param {Omit<DashboardLayoutProps, 'navigation' | 'branding'>} props - Layout props
 * @returns {React.JSX.Element} Admin dashboard layout
 */
export function AdminDashboardLayout({
  children,
  ...props
}: Omit<DashboardLayoutProps, 'navigation' | 'branding'>): React.JSX.Element {
  const { Shield, Users, Settings } = require("lucide-react");
  
  return (
    <DashboardLayout
      navigation={createNavigationGroups({
        main: [
          { title: "Panel Admin", url: "/admin", icon: Shield, isActive: true },
          { title: "Usuarios", url: "/admin/users", icon: Users },
          { title: "Sistema", url: "/admin/system", icon: Settings },
        ],
        settings: DEFAULT_SETTINGS_ITEMS,
      })}
      branding={{ name: "Admin Panel", subtitle: "Sistema", icon: Shield }}
      {...props}
    >
      {children}
    </DashboardLayout>
  );
}

/**
 * Minimal Dashboard Layout
 * @function MinimalDashboardLayout
 * @description Minimal layout with just content area
 * @param {Omit<DashboardLayoutProps, 'showSidebar' | 'showHeader'>} props - Layout props
 * @returns {React.JSX.Element} Minimal dashboard layout
 */
export function MinimalDashboardLayout({
  children,
  ...props
}: Omit<DashboardLayoutProps, 'showSidebar' | 'showHeader'>): React.JSX.Element {
  return (
    <DashboardLayout
      showSidebar={false}
      showHeader={false}
      containerPadding="lg"
      {...props}
    >
      {children}
    </DashboardLayout>
  );
}

/**
 * Full Page Dashboard Layout
 * @function FullPageDashboardLayout
 * @description Layout that takes full viewport height
 * @param {DashboardLayoutProps} props - Layout props
 * @returns {React.JSX.Element} Full page dashboard layout
 */
export function FullPageDashboardLayout({
  children,
  containerPadding = "none",
  ...props
}: DashboardLayoutProps): React.JSX.Element {
  return (
    <DashboardLayout
      containerPadding={containerPadding}
      contentClassName="h-full"
      fullHeight={true}
      {...props}
    >
      {children}
    </DashboardLayout>
  );
}