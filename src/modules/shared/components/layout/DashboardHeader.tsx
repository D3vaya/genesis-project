/**
 * @fileoverview Reusable dashboard header component
 * @description Configurable header component for dashboard layouts with search and actions
 * @author Generated SaaS Template
 * @version 1.0.0
 */

"use client";

import React from "react";
import { Search, Plus } from "lucide-react";

import { Button } from "@/modules/shared/components/ui/button";
import { Input } from "@/modules/shared/components/ui/input";
import { SidebarTrigger } from "@/modules/shared/components/ui/sidebar";

/**
 * Header action interface
 * @interface HeaderAction
 * @description Structure for header action buttons
 */
export interface HeaderAction {
  label: string;
  icon?: React.ComponentType<any>;
  onClick: () => void;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

/**
 * DashboardHeader component props
 * @interface DashboardHeaderProps
 * @description Props for the DashboardHeader component
 */
export interface DashboardHeaderProps {
  /**
   * Whether to show the sidebar trigger button
   */
  showSidebarTrigger?: boolean;
  
  /**
   * Whether to show the search input
   */
  showSearch?: boolean;
  
  /**
   * Search input placeholder
   */
  searchPlaceholder?: string;
  
  /**
   * Search input value (controlled)
   */
  searchValue?: string;
  
  /**
   * Search change handler
   */
  onSearchChange?: (value: string) => void;
  
  /**
   * Search submit handler
   */
  onSearchSubmit?: (value: string) => void;
  
  /**
   * Action buttons to display on the right
   */
  actions?: HeaderAction[];
  
  /**
   * Custom content to render in the header
   */
  children?: React.ReactNode;
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * Header height variant
   */
  height?: "default" | "compact" | "large";
}

/**
 * Reusable Dashboard Header Component
 * @component DashboardHeader
 * @description Configurable header component for dashboard layouts
 * @param {DashboardHeaderProps} props - Component props
 * @returns {React.JSX.Element} Header component
 * @example
 * ```typescript
 * import { DashboardHeader } from '@/modules/shared/components/layout/DashboardHeader'
 * 
 * // Simple usage
 * <DashboardHeader />
 * 
 * // With search and actions
 * <DashboardHeader
 *   showSearch={true}
 *   searchPlaceholder="Buscar usuarios..."
 *   onSearchChange={(value) => console.log(value)}
 *   actions={[
 *     {
 *       label: "Nuevo Usuario",
 *       icon: Plus,
 *       onClick: () => handleNewUser(),
 *     }
 *   ]}
 * />
 * 
 * // Custom content
 * <DashboardHeader>
 *   <div className="flex items-center gap-4">
 *     <h1>Custom Title</h1>
 *     <Button>Custom Action</Button>
 *   </div>
 * </DashboardHeader>
 * ```
 */
export function DashboardHeader({
  showSidebarTrigger = true,
  showSearch = true,
  searchPlaceholder = "Buscar...",
  searchValue,
  onSearchChange,
  onSearchSubmit,
  actions = [],
  children,
  className = "",
  height = "default",
}: DashboardHeaderProps): React.JSX.Element {
  const [internalSearchValue, setInternalSearchValue] = React.useState("");
  
  // Use controlled or uncontrolled search value
  const currentSearchValue = searchValue !== undefined ? searchValue : internalSearchValue;

  /**
   * Handle search input change
   * @function handleSearchChange
   * @description Handles search input changes
   * @param {React.ChangeEvent<HTMLInputElement>} event - Input change event
   */
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.value;
    
    if (searchValue === undefined) {
      setInternalSearchValue(value);
    }
    
    onSearchChange?.(value);
  };

  /**
   * Handle search form submission
   * @function handleSearchSubmit
   * @description Handles search form submission
   * @param {React.FormEvent} event - Form submission event
   */
  const handleSearchSubmit = (event: React.FormEvent): void => {
    event.preventDefault();
    onSearchSubmit?.(currentSearchValue);
  };

  /**
   * Get header height classes
   * @function getHeightClasses
   * @description Returns appropriate height classes based on variant
   * @returns {string} CSS classes for header height
   */
  const getHeightClasses = (): string => {
    switch (height) {
      case "compact":
        return "h-12";
      case "large":
        return "h-20";
      default:
        return "h-16";
    }
  };

  // If children is provided, render custom header content
  if (children) {
    return (
      <header className={`flex items-center gap-4 border-b bg-background px-4 md:px-6 ${getHeightClasses()} ${className}`}>
        {showSidebarTrigger && <SidebarTrigger className="-ml-1" />}
        <div className="w-full flex-1">{children}</div>
      </header>
    );
  }

  return (
    <header className={`flex items-center gap-4 border-b bg-background px-4 md:px-6 ${getHeightClasses()} ${className}`}>
      {showSidebarTrigger && <SidebarTrigger className="-ml-1" />}
      
      <div className="w-full flex-1">
        {showSearch && (
          <form 
            className="ml-auto flex-1 sm:flex-initial" 
            onSubmit={handleSearchSubmit}
          >
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 text-muted-foreground transform -translate-y-1/2" />
              <Input
                type="search"
                placeholder={searchPlaceholder}
                value={currentSearchValue}
                onChange={handleSearchChange}
                className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
              />
            </div>
          </form>
        )}
      </div>

      {/* Action buttons */}
      {actions.length > 0 && (
        <div className="flex items-center gap-2">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant || "default"}
              size={action.size || "sm"}
              onClick={action.onClick}
              disabled={action.disabled || action.loading}
              className={`gap-1.5 text-sm ${action.className || ""}`}
            >
              {action.loading ? (
                <div className="size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                action.icon && <action.icon className="size-3.5" />
              )}
              {action.label}
            </Button>
          ))}
        </div>
      )}
    </header>
  );
}