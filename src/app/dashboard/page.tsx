/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @fileoverview Dashboard page component with sidebar layout and data visualization
 * @description Main dashboard page showing user data, statistics, and navigation using shadcn/ui sidebar components
 * @author Generated SaaS Template
 * @version 1.0.0
 */

"use client";

import React, { useEffect, useState } from "react";
import {
  Users,
  BarChart3,
  TrendingUp,
  Activity,
  Calendar,
  Settings,
  LogOut,
  Home,
  User,
  Bell,
  Search,
  Plus,
} from "lucide-react";

import { Button } from "@/modules/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/modules/shared/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/modules/shared/components/ui/avatar";
import { Badge } from "@/modules/shared/components/ui/badge";
import { Input } from "@/modules/shared/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/modules/shared/components/ui/dropdown-menu";
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
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/modules/shared/components/ui/sidebar";

import { useAuthStore, useUser } from "@/modules/shared/stores/authStore";
import { useUIStore } from "@/modules/shared/stores/uiStore";
import { useDataStore } from "@/modules/shared/stores/dataStore";
import { toast } from "sonner";
import { get } from "@/lib/axios";

/**
 * Navigation menu items configuration
 * @const {Array} navigationItems
 * @description Configuration for sidebar navigation menu items
 */
const navigationItems = [
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
 * Settings menu items configuration
 * @const {Array} settingsItems
 * @description Configuration for settings section in sidebar
 */
const settingsItems = [
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
 * Dashboard statistics interface
 * @interface DashboardStats
 * @description Structure for dashboard statistics data
 * @property {number} totalUsers - Total number of users
 * @property {number} activeUsers - Number of active users
 * @property {number} totalPosts - Total number of posts
 * @property {number} engagement - Engagement rate percentage
 */
interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalPosts: number;
  engagement: number;
}

/**
 * App Sidebar Component
 * @component
 * @description Sidebar component with navigation menu and user profile
 * @returns {React.JSX.Element} Sidebar with navigation and user profile
 * @example
 * ```typescript
 * <AppSidebar />
 * ```
 */
function AppSidebar(): React.JSX.Element {
  const user = useUser();
  const { logout } = useAuthStore();

  /**
   * Handle user logout
   * @function handleLogout
   * @description Logs out the current user and shows confirmation notification
   * @returns {Promise<void>} Promise that resolves when logout is complete
   * @example
   * ```typescript
   * await handleLogout()
   * ```
   */
  const handleLogout = async (): Promise<void> => {
    try {
      await logout();
      toast.info("Sesión Cerrada", {
        description: "Has cerrado sesión exitosamente",
      });
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Error", {
        description: "Error al cerrar sesión",
      });
    }
  };

  /**
   * Get user initials for avatar fallback
   * @function getUserInitials
   * @description Generates user initials from name for avatar fallback
   * @param {string} name - User's full name
   * @returns {string} User initials (max 2 characters)
   * @example
   * ```typescript
   * const initials = getUserInitials('Juan Pérez') // Returns 'JP'
   * ```
   */
  const getUserInitials = (name: string): string => {
    return name
      .split(" ")
      .map((part) => part.charAt(0).toUpperCase())
      .slice(0, 2)
      .join("");
  };

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div className="flex items-center">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <TrendingUp className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">SaaS Template</span>
                  <span className="truncate text-xs">Dashboard</span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegación</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={item.isActive}>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Configuración</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

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
                      src={user?.image || ""}
                      alt={user?.name || ""}
                    />
                    <AvatarFallback className="rounded-lg">
                      {user?.name ? getUserInitials(user.name) : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {user?.name || "Usuario"}
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
                        src={user?.image || ""}
                        alt={user?.name || ""}
                      />
                      <AvatarFallback className="rounded-lg">
                        {user?.name ? getUserInitials(user.name) : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {user?.name || "Usuario"}
                      </span>
                      <span className="truncate text-xs">{user?.email}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User />
                  Perfil
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings />
                  Configuración
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bell />
                  Notificaciones
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600"
                >
                  <LogOut />
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

/**
 * Dashboard Page Component
 * @component
 * @description Main dashboard page component with sidebar layout and data visualization
 * @returns {React.JSX.Element} Complete dashboard with sidebar, header, and content
 * @example
 * ```typescript
 * // This component is automatically rendered at /dashboard route
 * // Shows user statistics, recent activity, and navigation options
 * // Includes sidebar with navigation menu and user profile
 * ```
 */
export default function DashboardPage(): React.JSX.Element {
  const user = useUser();
  const { apiData, setApiData, loading, setLoading, setError } = useDataStore();

  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalPosts: 0,
    engagement: 0,
  });

  /**
   * Load dashboard data on component mount
   * @description Fetches dashboard statistics and user data from external API
   */
  useEffect(() => {
    loadDashboardData();
  }, []);

  /**
   * Load dashboard data from API
   * @function loadDashboardData
   * @description Fetches dashboard statistics from external API and local data
   * @returns {Promise<void>} Promise that resolves when data is loaded
   * @example
   * ```typescript
   * await loadDashboardData()
   * // Updates dashboard statistics and user data
   * ```
   */
  const loadDashboardData = async (): Promise<void> => {
    setLoading("api", true);
    setError("api", null);

    try {
      // Fetch users from external API (JSONPlaceholder)
      const users = await get<any[]>("/users");

      // Fetch posts for engagement calculation
      const posts = await get<any[]>("/posts");

      // Calculate statistics
      const totalUsers = users?.length || 0;
      const activeUsers = Math.floor(totalUsers * 0.8); // 80% active simulation
      const totalPosts = posts?.length || 0;
      const engagement =
        totalPosts > 0 ? Math.floor((totalPosts / totalUsers) * 100) : 0;

      const calculatedStats: DashboardStats = {
        totalUsers,
        activeUsers,
        totalPosts,
        engagement: Math.min(engagement, 100),
      };

      setStats(calculatedStats);
      setApiData("dashboard-stats", calculatedStats);
      setApiData("users", users);
      setApiData("posts", posts);

      toast.success("Datos Actualizados", {
        description: "Los datos del dashboard se han actualizado correctamente",
      });
    } catch (error) {
      console.error("Error loading dashboard data:", error);

      // Load cached data if available
      const cachedStats = apiData["dashboard-stats"];
      if (cachedStats) {
        setStats(cachedStats);
        toast.info("Datos desde Caché", {
          description: "Se muestran los datos almacenados localmente",
        });
      } else {
        toast.error("Error de Conexión", {
          description: "No se pudieron cargar los datos. Verifica tu conexión.",
        });
      }
    } finally {
      setLoading("api", false);
    }
  };

  /**
   * Format number with locale
   * @function formatNumber
   * @description Formats numbers with Spanish locale formatting
   * @param {number} num - Number to format
   * @returns {string} Formatted number string
   * @example
   * ```typescript
   * const formatted = formatNumber(1234) // Returns '1.234'
   * ```
   */
  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat("es-ES").format(num);
  };

  /**
   * Get greeting based on time of day
   * @function getGreeting
   * @description Returns appropriate greeting based on current time
   * @returns {string} Greeting message
   * @example
   * ```typescript
   * const greeting = getGreeting() // Returns 'Buenos días', 'Buenas tardes', etc.
   * ```
   */
  const getGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return "Buenos días";
    if (hour < 18) return "Buenas tardes";
    return "Buenas noches";
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {/* Header */}
        <header className="flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
          <SidebarTrigger className="-ml-1" />
          <div className="w-full flex-1">
            <form className="ml-auto flex-1 sm:flex-initial">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar..."
                  className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                />
              </div>
            </form>
          </div>
          <Button size="sm" className="ml-auto gap-1.5 text-sm">
            <Plus className="size-3.5" />
            Nuevo
          </Button>
        </header>

        {/* Main Content */}
        <div className="flex-1 space-y-4 p-4 md:p-6 pt-6">
          {/* Welcome Section */}
          <div className="flex items-center justify-between space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              {getGreeting()}, {user?.name || "Usuario"}!
            </h1>
            <div className="flex items-center space-x-2">
              <Button
                onClick={loadDashboardData}
                disabled={loading.api}
                variant="outline"
                size="sm"
              >
                {loading.api ? (
                  <>
                    <Activity className="mr-2 h-4 w-4 animate-spin" />
                    Cargando...
                  </>
                ) : (
                  <>
                    <Activity className="mr-2 h-4 w-4" />
                    Actualizar
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Usuarios
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatNumber(stats.totalUsers)}
                </div>
                <p className="text-xs text-muted-foreground">
                  +2.1% desde el mes pasado
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Usuarios Activos
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatNumber(stats.activeUsers)}
                </div>
                <p className="text-xs text-muted-foreground">
                  +5.2% desde la semana pasada
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Posts
                </CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatNumber(stats.totalPosts)}
                </div>
                <p className="text-xs text-muted-foreground">
                  +12.5% desde el mes pasado
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Engagement
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.engagement}%</div>
                <p className="text-xs text-muted-foreground">
                  +1.2% desde ayer
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity Section */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Vista General</CardTitle>
                <CardDescription>
                  Resumen de actividad de tu aplicación
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="h-3 w-3 bg-primary rounded-full" />
                    <span className="text-sm font-medium">API Externa</span>
                  </div>
                  <Badge variant="secondary">Conectado</Badge>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="h-3 w-3 bg-green-500 rounded-full" />
                    <span className="text-sm font-medium">Base de Datos</span>
                  </div>
                  <Badge variant="secondary">Activa</Badge>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="h-3 w-3 bg-blue-500 rounded-full" />
                    <span className="text-sm font-medium">Autenticación</span>
                  </div>
                  <Badge variant="secondary">Funcionando</Badge>
                </div>

                <div className="pt-4">
                  <p className="text-sm text-muted-foreground">
                    Tu aplicación SaaS está funcionando correctamente. Todos los
                    servicios están operativos.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Actividad Reciente</CardTitle>
                <CardDescription>Últimas acciones en tu cuenta</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      Inicio de sesión exitoso
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Hace 2 minutos
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Datos actualizados</p>
                    <p className="text-xs text-muted-foreground">
                      Hace 5 minutos
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Dashboard cargado</p>
                    <p className="text-xs text-muted-foreground">
                      Hace 10 minutos
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </SidebarProvider>
  );
}
