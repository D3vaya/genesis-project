/**
 * @fileoverview Users management page using reusable dashboard layout
 * @description Example page showing how to use the reusable dashboard layout components
 * @author Generated SaaS Template
 * @version 1.0.0
 */

'use client'

import React, { useState } from 'react'
import {
  Users,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
} from 'lucide-react'

import { Button } from '@/modules/shared/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/modules/shared/components/ui/card'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/modules/shared/components/ui/avatar'
import { Badge } from '@/modules/shared/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/modules/shared/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/modules/shared/components/ui/table'

import { DashboardLayout } from '@/modules/shared/components/layout'
import { toast } from 'sonner'

/**
 * Mock user data
 * @const {Array} mockUsers
 * @description Sample user data for demonstration
 */
const mockUsers = [
  {
    id: 1,
    name: 'Juan Pérez',
    email: 'juan@ejemplo.com',
    role: 'Admin',
    status: 'active',
    lastActive: '2 horas atrás',
    avatar: '',
  },
  {
    id: 2,
    name: 'María González',
    email: 'maria@ejemplo.com',
    role: 'Usuario',
    status: 'active',
    lastActive: '1 día atrás',
    avatar: '',
  },
  {
    id: 3,
    name: 'Carlos López',
    email: 'carlos@ejemplo.com',
    role: 'Editor',
    status: 'inactive',
    lastActive: '3 días atrás',
    avatar: '',
  },
]

/**
 * Users page component
 * @component UsersPage
 * @description Users management page using the reusable dashboard layout
 * @returns {React.JSX.Element} Users page with dashboard layout
 * @example
 * ```typescript
 * // This component demonstrates:
 * // 1. Custom header with search and actions
 * // 2. Table with user data
 * // 3. Action menus and status badges
 * // 4. Reusable layout components
 * ```
 */
export default function UsersPage(): React.JSX.Element {
  const [searchQuery, setSearchQuery] = useState('')
  const [users] = useState(mockUsers)

  /**
   * Handle new user creation
   * @function handleNewUser
   * @description Handles new user creation
   */
  const handleNewUser = (): void => {
    toast.success('Nuevo Usuario', {
      description: 'Funcionalidad de crear usuario (demo)',
    })
  }

  /**
   * Handle user search
   * @function handleSearch
   * @description Handles user search functionality
   * @param {string} query - Search query
   */
  const handleSearch = (query: string): void => {
    setSearchQuery(query)
    toast.info('Buscar', {
      description: `Buscando usuarios: "${query}"`,
    })
  }

  /**
   * Handle user edit
   * @function handleEditUser
   * @description Handles user editing
   * @param {number} userId - User ID to edit
   */
  const handleEditUser = (userId: number): void => {
    toast.success('Editar Usuario', {
      description: `Editando usuario ${userId} (demo)`,
    })
  }

  /**
   * Handle user deletion
   * @function handleDeleteUser
   * @description Handles user deletion
   * @param {number} userId - User ID to delete
   */
  const handleDeleteUser = (userId: number): void => {
    toast.error('Eliminar Usuario', {
      description: `Eliminando usuario ${userId} (demo)`,
    })
  }

  /**
   * Get user initials
   * @function getUserInitials
   * @description Gets user initials for avatar fallback
   * @param {string} name - User name
   * @returns {string} User initials
   */
  const getUserInitials = (name: string): string => {
    return name
      .split(' ')
      .map(part => part.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('')
  }

  /**
   * Get status badge variant
   * @function getStatusVariant
   * @description Returns badge variant based on user status
   * @param {string} status - User status
   * @returns {string} Badge variant
   */
  const getStatusVariant = (
    status: string
  ): 'default' | 'secondary' | 'destructive' => {
    switch (status) {
      case 'active':
        return 'default'
      case 'inactive':
        return 'secondary'
      default:
        return 'secondary'
    }
  }

  return (
    <DashboardLayout
      headerProps={{
        searchPlaceholder: 'Buscar usuarios...',
        searchValue: searchQuery,
        onSearchChange: setSearchQuery,
        onSearchSubmit: handleSearch,
        actions: [
          {
            label: 'Filtros',
            icon: Filter,
            onClick: () =>
              toast.info('Filtros', {
                description: 'Función de filtros (demo)',
              }),
            variant: 'outline',
          },
          {
            label: 'Nuevo Usuario',
            icon: Plus,
            onClick: handleNewUser,
          },
        ],
      }}
    >
      {/* Page Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Gestión de Usuarios
          </h1>
          <p className="text-muted-foreground">
            Administra los usuarios de tu aplicación
          </p>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-muted-foreground text-sm">
            Total: {users.length} usuarios
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Usuarios
            </CardTitle>
            <Users className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-muted-foreground text-xs">
              +2 desde la semana pasada
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Usuarios Activos
            </CardTitle>
            <Users className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => u.status === 'active').length}
            </div>
            <p className="text-muted-foreground text-xs">85% del total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Administradores
            </CardTitle>
            <Users className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => u.role === 'Admin').length}
            </div>
            <p className="text-muted-foreground text-xs">Con acceso completo</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Nuevos Usuarios
            </CardTitle>
            <Users className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-muted-foreground text-xs">Esta semana</p>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuarios</CardTitle>
          <CardDescription>
            Gestiona todos los usuarios registrados en tu plataforma
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuario</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Última Actividad</TableHead>
                <TableHead className="w-[50px]">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map(user => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>
                          {getUserInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.name}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-muted-foreground text-sm">
                      {user.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{user.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(user.status)}>
                      {user.status === 'active' ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-muted-foreground text-sm">
                      {user.lastActive}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleEditUser(user.id)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
