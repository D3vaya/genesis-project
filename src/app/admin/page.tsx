/**
 * @fileoverview Admin panel page using custom admin layout
 * @description Example page showing admin layout variant with custom navigation and branding
 * @author Generated SaaS Template
 * @version 1.0.0
 */

"use client";

import React from "react";
import {
  Shield,
  Users,
  Settings,
  Database,
  Activity,
  AlertTriangle,
  Server,
  Zap,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/modules/shared/components/ui/card";
import { Badge } from "@/modules/shared/components/ui/badge";
import { Button } from "@/modules/shared/components/ui/button";

import { 
  DashboardLayout,
  createNavigationGroups,
  DEFAULT_SETTINGS_ITEMS,
} from "@/modules/shared/components/layout";
import { toast } from "sonner";

/**
 * Admin navigation items
 * @const {Array} adminNavigation
 * @description Custom navigation for admin panel
 */
const adminNavigation = createNavigationGroups({
  main: [
    {
      title: "Panel Admin",
      url: "/admin",
      icon: Shield,
      isActive: true,
    },
    {
      title: "Gestión Usuarios",
      url: "/admin/users",
      icon: Users,
      badge: "New",
    },
    {
      title: "Base de Datos",
      url: "/admin/database",
      icon: Database,
    },
    {
      title: "Logs del Sistema",
      url: "/admin/logs",
      icon: Activity,
    },
    {
      title: "Configuración",
      url: "/admin/config",
      icon: Settings,
    },
  ],
  custom: [
    {
      label: "Sistema",
      items: [
        {
          title: "Monitoreo",
          url: "/admin/monitoring",
          icon: Activity,
        },
        {
          title: "Respaldos",
          url: "/admin/backups",
          icon: Database,
        },
      ],
    },
  ],
  settings: DEFAULT_SETTINGS_ITEMS,
});

/**
 * Custom admin branding
 * @const {Object} adminBranding
 * @description Custom branding for admin panel
 */
const adminBranding = {
  name: "Admin Panel",
  subtitle: "Sistema",
  icon: Shield,
};

/**
 * System stats data
 * @const {Array} systemStats
 * @description Mock system statistics
 */
const systemStats = [
  {
    title: "Usuarios Totales",
    value: "1,234",
    change: "+12%",
    icon: Users,
    trend: "up",
  },
  {
    title: "Sesiones Activas", 
    value: "89",
    change: "+5%",
    icon: Activity,
    trend: "up",
  },
  {
    title: "Uso de Almacenamiento",
    value: "64.2 GB",
    change: "+2.1 GB",
    icon: Database,
    trend: "up",
  },
  {
    title: "Tiempo de Actividad",
    value: "99.9%",
    change: "Excelente",
    icon: Server,
    trend: "stable",
  },
];

/**
 * System alerts data
 * @const {Array} systemAlerts
 * @description System alerts and notifications
 */
const systemAlerts = [
  {
    id: 1,
    type: "warning",
    title: "Espacio de almacenamiento",
    message: "El almacenamiento está al 80% de su capacidad",
    time: "Hace 2 horas",
  },
  {
    id: 2,
    type: "info",
    title: "Actualización disponible",
    message: "Nueva versión del sistema disponible",
    time: "Hace 1 día",
  },
  {
    id: 3,
    type: "success",
    title: "Respaldo completado",
    message: "Respaldo diario completado exitosamente",
    time: "Hace 6 horas",
  },
];

/**
 * Admin page component
 * @component AdminPage
 * @description Admin panel page with custom layout and navigation
 * @returns {React.JSX.Element} Admin page with custom dashboard layout
 * @example
 * ```typescript
 * // This component demonstrates:
 * // 1. Custom navigation configuration
 * // 2. Custom branding
 * // 3. Admin-specific header actions
 * // 4. System monitoring dashboard
 * ```
 */
export default function AdminPage(): React.JSX.Element {
  /**
   * Handle system maintenance
   * @function handleMaintenance
   * @description Triggers system maintenance mode
   */
  const handleMaintenance = (): void => {
    toast.warning("Modo Mantenimiento", {
      description: "Activando modo mantenimiento del sistema",
    });
  };

  /**
   * Handle system restart
   * @function handleRestart
   * @description Triggers system restart
   */
  const handleRestart = (): void => {
    toast.error("Reiniciar Sistema", {
      description: "Reiniciando todos los servicios del sistema",
    });
  };

  /**
   * Get alert badge variant
   * @function getAlertVariant
   * @description Returns badge variant based on alert type
   * @param {string} type - Alert type
   * @returns {string} Badge variant
   */
  const getAlertVariant = (type: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (type) {
      case "warning":
        return "destructive";
      case "success":
        return "default";
      case "info":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <DashboardLayout
      navigation={adminNavigation}
      branding={adminBranding}
      headerProps={{
        searchPlaceholder: "Buscar en panel admin...",
        actions: [
          {
            label: "Mantenimiento",
            icon: Settings,
            onClick: handleMaintenance,
            variant: "outline",
          },
          {
            label: "Reiniciar",
            icon: Zap,
            onClick: handleRestart,
            variant: "destructive",
          },
        ],
      }}
    >
      {/* Admin Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            Panel de Administración
          </h1>
          <p className="text-muted-foreground">
            Gestiona el sistema y supervisa el rendimiento
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-green-600 border-green-600">
            ● Sistema Operativo
          </Badge>
        </div>
      </div>

      {/* System Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {systemStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className={`text-xs ${
                stat.trend === 'up' ? 'text-green-600' : 
                stat.trend === 'down' ? 'text-red-600' : 
                'text-muted-foreground'
              }`}>
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* System Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Alertas del Sistema
            </CardTitle>
            <CardDescription>
              Notificaciones y eventos importantes del sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {systemAlerts.map((alert) => (
              <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg border">
                <Badge variant={getAlertVariant(alert.type)} className="mt-0.5">
                  {alert.type}
                </Badge>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">{alert.title}</p>
                  <p className="text-sm text-muted-foreground">{alert.message}</p>
                  <p className="text-xs text-muted-foreground">{alert.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Acciones Rápidas
            </CardTitle>
            <CardDescription>
              Herramientas de administración del sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              <Button 
                variant="outline" 
                className="justify-start h-auto p-4"
                onClick={() => toast.info("Gestión de Usuarios", { description: "Abriendo panel de usuarios" })}
              >
                <Users className="mr-3 h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Gestionar Usuarios</div>
                  <div className="text-sm text-muted-foreground">
                    Administrar cuentas y permisos
                  </div>
                </div>
              </Button>

              <Button 
                variant="outline" 
                className="justify-start h-auto p-4"
                onClick={() => toast.info("Base de Datos", { description: "Abriendo herramientas de BD" })}
              >
                <Database className="mr-3 h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Base de Datos</div>
                  <div className="text-sm text-muted-foreground">
                    Consultas y respaldos
                  </div>
                </div>
              </Button>

              <Button 
                variant="outline" 
                className="justify-start h-auto p-4"
                onClick={() => toast.info("Logs", { description: "Abriendo logs del sistema" })}
              >
                <Activity className="mr-3 h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Ver Logs</div>
                  <div className="text-sm text-muted-foreground">
                    Registros y auditoría
                  </div>
                </div>
              </Button>

              <Button 
                variant="outline" 
                className="justify-start h-auto p-4"
                onClick={() => toast.info("Configuración", { description: "Abriendo configuración" })}
              >
                <Settings className="mr-3 h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Configuración</div>
                  <div className="text-sm text-muted-foreground">
                    Ajustes del sistema
                  </div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}