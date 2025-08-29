# Layout Components Documentation

Sistema de componentes reutilizables para crear layouts de dashboard con navegación lateral y header personalizable.

## Componentes Principales

### 1. DashboardLayout

Componente principal que envuelve todo el layout del dashboard.

```typescript
import { DashboardLayout } from '@/modules/shared/components/layout';

<DashboardLayout
  headerProps={{
    actions: [
      {
        label: "Nuevo",
        icon: Plus,
        onClick: handleNew,
      }
    ]
  }}
>
  <YourContent />
</DashboardLayout>
```

### 2. AppSidebar

Componente de navegación lateral reutilizable.

```typescript
import { AppSidebar } from '@/modules/shared/components/layout';

<AppSidebar
  navigation={navigationItems}
  branding={{ name: "Mi App", subtitle: "Panel", icon: Home }}
  showUserMenu={true}
/>
```

### 3. DashboardHeader

Header configurable con búsqueda y acciones.

```typescript
import { DashboardHeader } from '@/modules/shared/components/layout';

<DashboardHeader
  showSearch={true}
  searchPlaceholder="Buscar..."
  actions={[
    {
      label: "Acción",
      icon: Settings,
      onClick: handleAction,
    }
  ]}
/>
```

## Configuración de Navegación

### Navegación Simple

```typescript
import { DEFAULT_NAVIGATION_ITEMS } from '@/modules/shared/config/navigation';

<DashboardLayout navigation={DEFAULT_NAVIGATION_ITEMS}>
  <Content />
</DashboardLayout>
```

### Navegación Agrupada

```typescript
import { createNavigationGroups } from '@/modules/shared/config/navigation'

const customNavigation = createNavigationGroups({
  main: [
    { title: 'Inicio', url: '/dashboard', icon: Home, isActive: true },
    { title: 'Usuarios', url: '/users', icon: Users },
  ],
  settings: [{ title: 'Configuración', url: '/settings', icon: Settings }],
  custom: [
    {
      label: 'Herramientas',
      items: [{ title: 'Logs', url: '/logs', icon: FileText }],
    },
  ],
})
```

### Navegación Personalizada

```typescript
const myNavigation: NavigationItem[] = [
  {
    title: 'Mi Página',
    url: '/my-page',
    icon: MyIcon,
    isActive: true,
    badge: 'New',
    disabled: false,
  },
]
```

## Ejemplos de Uso

### 1. Dashboard Básico

```typescript
export default function BasicDashboard() {
  return (
    <DashboardLayout>
      <h1>Mi Dashboard</h1>
      <p>Contenido del dashboard...</p>
    </DashboardLayout>
  );
}
```

### 2. Dashboard con Acciones

```typescript
export default function DashboardWithActions() {
  const handleNew = () => console.log("Nuevo item");
  const handleRefresh = () => console.log("Actualizar");

  return (
    <DashboardLayout
      headerProps={{
        actions: [
          {
            label: "Nuevo",
            icon: Plus,
            onClick: handleNew,
          },
          {
            label: "Actualizar",
            icon: RefreshCw,
            onClick: handleRefresh,
            variant: "outline",
          }
        ]
      }}
    >
      <MyContent />
    </DashboardLayout>
  );
}
```

### 3. Dashboard con Navegación Personalizada

```typescript
export default function CustomDashboard() {
  const customNav = [
    { title: "Panel", url: "/panel", icon: BarChart, isActive: true },
    { title: "Reportes", url: "/reports", icon: FileText },
  ];

  return (
    <DashboardLayout
      navigation={customNav}
      branding={{ name: "Mi Sistema", subtitle: "v2.0", icon: Zap }}
      headerProps={{
        searchPlaceholder: "Buscar reportes...",
        onSearchSubmit: (query) => console.log("Buscar:", query),
      }}
    >
      <ReportsContent />
    </DashboardLayout>
  );
}
```

### 4. Layout de Administración

```typescript
import { AdminDashboardLayout } from '@/modules/shared/components/layout';

export default function AdminPanel() {
  return (
    <AdminDashboardLayout
      headerProps={{
        actions: [
          {
            label: "Mantenimiento",
            icon: Settings,
            onClick: () => console.log("Modo mantenimiento"),
            variant: "destructive",
          }
        ]
      }}
    >
      <AdminContent />
    </AdminDashboardLayout>
  );
}
```

## Variantes de Layout

### 1. Layout Mínimo (sin sidebar ni header)

```typescript
import { MinimalDashboardLayout } from '@/modules/shared/components/layout';

<MinimalDashboardLayout>
  <MyMinimalContent />
</MinimalDashboardLayout>
```

### 2. Layout de Página Completa

```typescript
import { FullPageDashboardLayout } from '@/modules/shared/components/layout';

<FullPageDashboardLayout>
  <MyFullPageContent />
</FullPageDashboardLayout>
```

### 3. Layout Personalizado

```typescript
<DashboardLayout
  showSidebar={false}
  showHeader={true}
  containerPadding="none"
  contentClassName="h-full"
  customHeader={<MyCustomHeader />}
>
  <MyContent />
</DashboardLayout>
```

## Configuración de Header

### Acciones del Header

```typescript
const headerActions: HeaderAction[] = [
  {
    label: 'Guardar',
    icon: Save,
    onClick: handleSave,
    disabled: !canSave,
    variant: 'default',
  },
  {
    label: 'Exportar',
    icon: Download,
    onClick: handleExport,
    loading: isExporting,
    variant: 'outline',
  },
  {
    label: 'Eliminar',
    icon: Trash,
    onClick: handleDelete,
    variant: 'destructive',
    className: 'ml-4',
  },
]
```

### Búsqueda Controlada

```typescript
const [search, setSearch] = useState("");

<DashboardLayout
  headerProps={{
    searchValue: search,
    onSearchChange: setSearch,
    onSearchSubmit: handleSearch,
    searchPlaceholder: "Buscar elementos...",
  }}
>
  <SearchResults query={search} />
</DashboardLayout>
```

## Personalización de Branding

```typescript
const myBranding: AppBranding = {
  name: "Mi Aplicación",
  subtitle: "Dashboard v2.0",
  icon: MyCustomIcon,
};

<DashboardLayout branding={myBranding}>
  <Content />
</DashboardLayout>
```

## Customización del Menu de Usuario

```typescript
const customMenuItems = [
  {
    label: "Mi Cuenta",
    icon: User,
    onClick: () => router.push('/account'),
  },
  {
    label: "Soporte",
    icon: HelpCircle,
    onClick: () => openSupport(),
  },
  {
    label: "Cerrar Todo",
    icon: X,
    onClick: () => closeAll(),
    className: "text-red-600",
  }
];

<DashboardLayout
  sidebarProps={{
    customMenuItems,
    onLogout: handleCustomLogout,
  }}
>
  <Content />
</DashboardLayout>
```

## Props Completos

### DashboardLayoutProps

```typescript
interface DashboardLayoutProps {
  children: React.ReactNode
  navigation?: NavigationItem[] | NavigationGroup[]
  branding?: AppBranding
  headerProps?: DashboardHeaderProps
  sidebarProps?: Omit<AppSidebarProps, 'navigation' | 'branding'>
  showHeader?: boolean
  showSidebar?: boolean
  customHeader?: React.ReactNode
  customSidebar?: React.ReactNode
  containerPadding?: 'none' | 'sm' | 'default' | 'lg'
  contentClassName?: string
  fullHeight?: boolean
}
```

### HeaderAction

```typescript
interface HeaderAction {
  label: string
  icon?: React.ComponentType<any>
  onClick: () => void
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  disabled?: boolean
  loading?: boolean
  className?: string
}
```

### NavigationItem

```typescript
interface NavigationItem {
  title: string
  url: string
  icon: LucideIcon
  isActive?: boolean
  badge?: string
  disabled?: boolean
}
```

## Ejemplos Avanzados

Revisa los siguientes archivos para ejemplos completos:

- `src/app/dashboard/page.tsx` - Dashboard principal con estadísticas
- `src/app/dashboard/users/page.tsx` - Página de gestión de usuarios
- `src/app/admin/page.tsx` - Panel de administración con navegación personalizada

## Mejores Prácticas

1. **Usa navegación agrupada** para organizaciones complejas
2. **Personaliza el branding** para cada sección de tu app
3. **Aprovecha las acciones del header** para funcionalidades rápidas
4. **Mantén consistencia** en los iconos y colores
5. **Usa badges** para notificaciones importantes
6. **Implementa búsqueda contextual** cuando sea relevante
