/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @fileoverview Reusable application sidebar component
 * @description Configurable sidebar component for dashboard layouts with navigation and user profile
 * @author Generated SaaS Template
 * @version 1.0.0
 */

'use client'

import React from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Settings, LogOut, User, Bell } from 'lucide-react'

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/modules/shared/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/modules/shared/components/ui/dropdown-menu'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/modules/shared/components/ui/sidebar'

import { useAuthStore, useUser } from '@/modules/shared/stores/authStore'
import { toast } from 'sonner'
import {
  NavigationItem,
  NavigationGroup,
  AppBranding,
  DEFAULT_APP_BRANDING,
  setActiveNavigation,
  createNavigationGroups,
} from '@/modules/shared/config/navigation'

/**
 * AppSidebar component props
 * @interface AppSidebarProps
 * @description Props for the AppSidebar component
 */
export interface AppSidebarProps {
  /**
   * Navigation items configuration
   * Can be a simple array or grouped navigation
   */
  navigation?: NavigationItem[] | NavigationGroup[]

  /**
   * App branding configuration for header
   */
  branding?: AppBranding

  /**
   * Custom logout handler (optional)
   */
  onLogout?: () => Promise<void>

  /**
   * Show/hide user dropdown menu
   */
  showUserMenu?: boolean

  /**
   * Additional menu items for user dropdown
   */
  customMenuItems?: Array<{
    label: string
    icon: React.ComponentType<any>
    onClick: () => void
    className?: string
  }>

  /**
   * Sidebar variant
   */
  variant?: 'default' | 'inset' | 'floating'
}

/**
 * Reusable Application Sidebar Component
 * @component AppSidebar
 * @description Configurable sidebar component with navigation and user profile
 * @param {AppSidebarProps} props - Component props
 * @returns {React.JSX.Element} Sidebar component
 * @example
 * ```typescript
 * import { AppSidebar } from '@/modules/shared/components/layout/AppSidebar'
 * import { DEFAULT_NAVIGATION_ITEMS, DEFAULT_SETTINGS_ITEMS } from '@/modules/shared/config/navigation'
 *
 * // Simple usage
 * <AppSidebar navigation={DEFAULT_NAVIGATION_ITEMS} />
 *
 * // Grouped navigation
 * <AppSidebar
 *   navigation={[
 *     { label: "Main", items: DEFAULT_NAVIGATION_ITEMS },
 *     { label: "Settings", items: DEFAULT_SETTINGS_ITEMS }
 *   ]}
 *   branding={{ name: "My App", subtitle: "Admin Panel", icon: Shield }}
 * />
 * ```
 */
export function AppSidebar({
  navigation = [],
  branding = DEFAULT_APP_BRANDING,
  onLogout,
  showUserMenu = true,
  customMenuItems = [],
  variant = 'inset',
}: AppSidebarProps): React.JSX.Element {
  const user = useUser()
  const { logout } = useAuthStore()
  const router = useRouter()
  const pathname = usePathname()

  /**
   * Handle user logout
   * @function handleLogout
   * @description Logs out the current user and shows confirmation notification
   */
  const handleLogout = async (): Promise<void> => {
    try {
      if (onLogout) {
        await onLogout()
      } else {
        await logout()
      }

      toast.info('Sesión Cerrada', {
        description: 'Has cerrado sesión exitosamente',
      })
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Error', {
        description: 'Error al cerrar sesión',
      })
    }
  }

  /**
   * Get user initials for avatar fallback
   * @function getUserInitials
   * @description Generates user initials from name for avatar fallback
   * @param {string} name - User's full name
   * @returns {string} User initials (max 2 characters)
   */
  const getUserInitials = (name: string): string => {
    return name
      .split(' ')
      .map(part => part.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('')
  }

  /**
   * Handle navigation click
   * @function handleNavigation
   * @description Handles navigation clicks with router push
   * @param {string} url - URL to navigate to
   */
  const handleNavigation = (url: string): void => {
    router.push(url)
  }

  /**
   * Process navigation items to add active states
   * @function processNavigation
   * @description Processes navigation items and adds active states based on current path
   * @returns {NavigationGroup[]} Processed navigation groups
   */
  const processNavigation = (): NavigationGroup[] => {
    // If it's already grouped navigation
    if (
      Array.isArray(navigation) &&
      navigation.length > 0 &&
      'label' in navigation[0]
    ) {
      return (navigation as NavigationGroup[]).map(group => ({
        ...group,
        items: setActiveNavigation(group.items, pathname),
      }))
    }

    // If it's simple navigation items, create default groups
    const items = navigation as NavigationItem[]
    if (items.length === 0) return []

    return createNavigationGroups({
      main: setActiveNavigation(items, pathname),
    })
  }

  const navigationGroups = processNavigation()

  return (
    <Sidebar variant={variant as 'inset' | 'floating' | 'sidebar' | undefined}>
      {/* Header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div
                className="flex cursor-pointer items-center"
                onClick={() => handleNavigation('/dashboard')}
              >
                <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <branding.icon className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {branding.name}
                  </span>
                  <span className="truncate text-xs">{branding.subtitle}</span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent>
        {navigationGroups.map(group => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map(item => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={item.isActive}
                      disabled={item.disabled}
                    >
                      <button
                        onClick={() => handleNavigation(item.url)}
                        className="flex w-full items-center text-left"
                        disabled={item.disabled}
                      >
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                        {item.badge && (
                          <span className="bg-primary text-primary-foreground ml-auto rounded-full px-1.5 py-0.5 text-xs">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* Footer with User Menu */}
      {showUserMenu && (
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        src={user?.image || ''}
                        alt={user?.name || ''}
                      />
                      <AvatarFallback className="rounded-lg">
                        {user?.name ? getUserInitials(user.name) : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {user?.name || 'Usuario'}
                      </span>
                      <span className="truncate text-xs">{user?.email}</span>
                    </div>
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                  side="bottom"
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage
                          src={user?.image || ''}
                          alt={user?.name || ''}
                        />
                        <AvatarFallback className="rounded-lg">
                          {user?.name ? getUserInitials(user.name) : 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                          {user?.name || 'Usuario'}
                        </span>
                        <span className="truncate text-xs">{user?.email}</span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  {/* Default menu items */}
                  <DropdownMenuItem
                    onClick={() => handleNavigation('/dashboard/profile')}
                  >
                    <User className="size-4" />
                    Perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleNavigation('/dashboard/settings')}
                  >
                    <Settings className="size-4" />
                    Configuración
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleNavigation('/dashboard/notifications')}
                  >
                    <Bell className="size-4" />
                    Notificaciones
                  </DropdownMenuItem>

                  {/* Custom menu items */}
                  {customMenuItems.length > 0 && (
                    <>
                      <DropdownMenuSeparator />
                      {customMenuItems.map((item, index) => (
                        <DropdownMenuItem
                          key={index}
                          onClick={item.onClick}
                          className={item.className}
                        >
                          <item.icon className="size-4" />
                          {item.label}
                        </DropdownMenuItem>
                      ))}
                    </>
                  )}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600 focus:text-red-600"
                  >
                    <LogOut className="size-4" />
                    Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      )}

      <SidebarRail />
    </Sidebar>
  )
}
