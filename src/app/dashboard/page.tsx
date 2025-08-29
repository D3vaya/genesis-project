/**
 * @fileoverview Dashboard page component with data visualization
 * @description Main dashboard page showing user data and statistics using the reusable layout components
 * @author Generated SaaS Template
 * @version 1.0.0
 */

'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { Users, BarChart3, TrendingUp, Activity, Plus } from 'lucide-react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/modules/shared/components/ui/card'
import { Badge } from '@/modules/shared/components/ui/badge'

import { DashboardLayout } from '@/modules/shared/components/layout'
import { useUser } from '@/modules/shared/stores/authStore'
import { useDataStore } from '@/modules/shared/stores/dataStore'
import { toast } from 'sonner'
import { getMockDashboardData } from '@/data/mock/dashboardData'

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
  totalUsers: number
  activeUsers: number
  totalPosts: number
  engagement: number
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
  const user = useUser()
  const { loading } = useDataStore()

  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalPosts: 0,
    engagement: 0,
  })

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
  const loadDashboardData = useCallback(async (): Promise<void> => {
    const dataStore = useDataStore.getState()

    dataStore.setLoading('api', true)
    dataStore.setError('api', null)

    try {
      // Fetch mock data from local data store
      const { users, posts } = await getMockDashboardData()

      // Calculate statistics
      const totalUsers = users?.length || 0
      const activeUsers = Math.floor(totalUsers * 0.8) // 80% active simulation
      const totalPosts = posts?.length || 0
      const engagement =
        totalPosts > 0 ? Math.floor((totalPosts / totalUsers) * 100) : 0

      const calculatedStats: DashboardStats = {
        totalUsers,
        activeUsers,
        totalPosts,
        engagement: Math.min(engagement, 100),
      }

      setStats(calculatedStats)
      dataStore.setApiData('dashboard-stats', calculatedStats)
      dataStore.setApiData('users', users)
      dataStore.setApiData('posts', posts)

      toast.success('Datos Cargados', {
        description: 'Los datos del dashboard se han cargado correctamente',
      })
    } catch (error) {
      console.error('Error loading dashboard data:', error)

      // Load cached data if available
      const cachedStats = dataStore.apiData['dashboard-stats']
      if (cachedStats) {
        setStats(cachedStats)
        toast.info('Datos desde Caché', {
          description: 'Se muestran los datos almacenados localmente',
        })
      } else {
        toast.error('Error de Carga', {
          description: 'No se pudieron cargar los datos del dashboard.',
        })
      }
    } finally {
      dataStore.setLoading('api', false)
    }
  }, [])

  /**
   * Load dashboard data on component mount
   * @description Fetches dashboard statistics and user data from external API
   */
  useEffect(() => {
    loadDashboardData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
    return new Intl.NumberFormat('es-ES').format(num)
  }

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
    const hour = new Date().getHours()
    if (hour < 12) return 'Buenos días'
    if (hour < 18) return 'Buenas tardes'
    return 'Buenas noches'
  }

  return (
    <DashboardLayout
      headerProps={{
        actions: [
          {
            label: 'Nuevo',
            icon: Plus,
            onClick: () => console.log('Nuevo item'),
          },
          {
            label: loading.api ? 'Cargando...' : 'Actualizar',
            icon: Activity,
            onClick: loadDashboardData,
            disabled: loading.api,
            loading: loading.api,
            variant: 'outline',
          },
        ],
      }}
    >
      {/* Welcome Section */}
      <div className="mb-6 flex items-center justify-between space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          {getGreeting()}, {user?.name || 'Usuario'}!
        </h1>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Usuarios
            </CardTitle>
            <Users className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(stats.totalUsers)}
            </div>
            <p className="text-muted-foreground text-xs">
              +2.1% desde el mes pasado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Usuarios Activos
            </CardTitle>
            <Activity className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(stats.activeUsers)}
            </div>
            <p className="text-muted-foreground text-xs">
              +5.2% desde la semana pasada
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <BarChart3 className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(stats.totalPosts)}
            </div>
            <p className="text-muted-foreground text-xs">
              +12.5% desde el mes pasado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement</CardTitle>
            <TrendingUp className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.engagement}%</div>
            <p className="text-muted-foreground text-xs">+1.2% desde ayer</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Section */}
      <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-7">
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
                <div className="bg-primary h-3 w-3 rounded-full" />
                <span className="text-sm font-medium">API Externa</span>
              </div>
              <Badge variant="secondary">Conectado</Badge>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded-full bg-green-500" />
                <span className="text-sm font-medium">Base de Datos</span>
              </div>
              <Badge variant="secondary">Activa</Badge>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded-full bg-blue-500" />
                <span className="text-sm font-medium">Autenticación</span>
              </div>
              <Badge variant="secondary">Funcionando</Badge>
            </div>

            <div className="pt-4">
              <p className="text-muted-foreground text-sm">
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
              <div className="bg-primary mt-2 h-2 w-2 rounded-full" />
              <div className="space-y-1">
                <p className="text-sm font-medium">Inicio de sesión exitoso</p>
                <p className="text-muted-foreground text-xs">Hace 2 minutos</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="mt-2 h-2 w-2 rounded-full bg-green-500" />
              <div className="space-y-1">
                <p className="text-sm font-medium">Datos actualizados</p>
                <p className="text-muted-foreground text-xs">Hace 5 minutos</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="mt-2 h-2 w-2 rounded-full bg-blue-500" />
              <div className="space-y-1">
                <p className="text-sm font-medium">Dashboard cargado</p>
                <p className="text-muted-foreground text-xs">Hace 10 minutos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
