# 🚀 Genesis Project

<div align="center">
  <img src="image.png" alt="Genesis Project - SaaS Template" width="600" />
</div>

> **Template moderno de aplicación SaaS construido con Next.js, TypeScript, NextAuth, Prisma y shadcn/ui**

Un template completo y listo para producción que incluye autenticación, gestión de usuarios, dashboard modular, y una arquitectura escalable. Perfecto para lanzar tu próximo proyecto SaaS rápidamente.

[![Next.js](https://img.shields.io/badge/Next.js-15.5.2-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.15.0-2D3748)](https://www.prisma.io/)
[![NextAuth](https://img.shields.io/badge/NextAuth-4.24.11-purple)](https://next-auth.js.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.x-38B2AC)](https://tailwindcss.com/)

## 📋 Tabla de Contenidos

- [🚀 Inicio Rápido](#-inicio-rápido)
- [📁 Estructura del Proyecto](#-estructura-del-proyecto)
- [⚙️ Configuración](#️-configuración)
- [🛠️ Tecnologías](#️-tecnologías)
- [🎯 Características](#-características)
- [🔐 Sistema de Autenticación](#-sistema-de-autenticación)
- [🗄️ Base de Datos](#️-base-de-datos)
- [🎨 Componentes del Dashboard](#-componentes-del-dashboard)
- [🌐 Rutas y Middleware](#-rutas-y-middleware)
- [📦 Gestión de Estado](#-gestión-de-estado)
- [🎨 Theming y UI](#-theming-y-ui)
- [🔧 Scripts Disponibles](#-scripts-disponibles)
- [🚀 Despliegue](#-despliegue)
- [📝 Mejores Prácticas](#-mejores-prácticas)
- [🤝 Contribución](#-contribución)

## 🚀 Inicio Rápido

### 1. Clona el repositorio

```bash
git clone https://github.com/tu-usuario/genesis-project.git
cd genesis-project
```

### 2. Instala las dependencias

```bash
npm install
# o con yarn
yarn install
# o con pnpm
pnpm install
```

### 3. Configura las variables de entorno

```bash
# Copia el archivo de ejemplo
cp .env-template .env

# Edita el archivo .env con tus configuraciones
```

Configuraciones mínimas requeridas en `.env`:

```env
# Base de datos (SQLite por defecto)
DATABASE_URL="file:./dev.db"

# NextAuth Secret (genera uno aleatorio)
NEXTAUTH_SECRET="tu-secret-aleatorio-muy-seguro"
NEXTAUTH_URL="http://localhost:3000"

# Configuraciones opcionales
NODE_ENV="development"
NEXT_PUBLIC_GA_ID=""
```

### 4. Configura la base de datos

```bash
# Genera el cliente Prisma
npm run db:generate

# Aplica las migraciones
npm run db:migrate

# Carga datos de prueba (opcional)
npm run db:seed
```

### 5. Inicia el servidor de desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

**¡Listo!** Ahora puedes:

- **Registrarte** en `/register`
- **Iniciar sesión** en `/login`
- **Explorar el dashboard** en `/dashboard`
- **Acceder al panel admin** en `/admin`

## 📁 Estructura del Proyecto

```
genesis-project/
├── 📁 prisma/                    # Configuración de base de datos
│   ├── schema.prisma             # Esquema de base de datos
│   └── seed.ts                   # Datos de prueba
├── 📁 public/                    # Archivos estáticos
├── 📁 scripts/                   # Scripts de utilidad
├── 📁 src/
│   ├── 📁 app/                   # App Router (Next.js 13+)
│   │   ├── 📁 api/               # API Routes
│   │   │   └── auth/             # Endpoints de autenticación
│   │   ├── 📁 dashboard/         # Páginas del dashboard
│   │   ├── 📁 admin/             # Panel de administración
│   │   ├── login/                # Página de inicio de sesión
│   │   ├── register/             # Página de registro
│   │   ├── layout.tsx            # Layout principal
│   │   └── page.tsx              # Página de inicio
│   ├── 📁 lib/                   # Utilidades y configuraciones
│   │   ├── auth.ts               # Configuración NextAuth
│   │   ├── prisma.ts             # Cliente Prisma
│   │   ├── utils.ts              # Utilidades generales
│   │   └── validations.ts        # Esquemas de validación
│   ├── 📁 modules/               # Módulos organizados por funcionalidad
│   │   └── shared/               # Componentes y lógica compartida
│   │       ├── 📁 components/    # Componentes reutilizables
│   │       │   ├── 📁 layout/    # Componentes de layout
│   │       │   ├── 📁 providers/ # Proveedores globales
│   │       │   └── 📁 ui/        # Componentes de UI base
│   │       ├── 📁 config/        # Configuraciones
│   │       └── 📁 stores/        # Gestión de estado global
│   ├── 📁 data/                  # Archivos de datos estáticos
│   └── middleware.ts             # Middleware de Next.js
├── 📄 components.json            # Configuración shadcn/ui
├── 📄 next.config.ts             # Configuración Next.js
├── 📄 tailwind.config.ts         # Configuración Tailwind
├── 📄 tsconfig.json              # Configuración TypeScript
└── 📄 package.json               # Dependencias y scripts
```

## ⚙️ Configuración

### Variables de Entorno

Crea un archivo `.env` basado en `.env-template`:

```env
# Base de Datos
DATABASE_URL="file:./dev.db"  # SQLite local
# Para PostgreSQL: "postgresql://user:password@localhost:5432/dbname"
# Para MySQL: "mysql://user:password@localhost:3306/dbname"

# NextAuth Configuration
NEXTAUTH_SECRET="tu-secret-super-seguro-aqui"
NEXTAUTH_URL="http://localhost:3000"  # Cambiar en producción

# Entorno
NODE_ENV="development"

# Analytics (opcional)
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"

# API Keys (opcional)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=""
STRIPE_SECRET_KEY=""

# Email (opcional)
SMTP_HOST=""
SMTP_PORT="587"
SMTP_USER=""
SMTP_PASSWORD=""
SMTP_FROM=""
```

### Configuración de Base de Datos

El proyecto está configurado para usar **SQLite** por defecto para desarrollo. Para cambiar a PostgreSQL o MySQL:

1. **Actualiza `prisma/schema.prisma`:**

```prisma
// Para PostgreSQL
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Para MySQL
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

2. **Actualiza la URL en `.env`:**

```env
# PostgreSQL
DATABASE_URL="postgresql://user:password@localhost:5432/genesis_db"

# MySQL
DATABASE_URL="mysql://user:password@localhost:3306/genesis_db"
```

3. **Aplica las migraciones:**

```bash
npm run db:generate
npm run db:migrate
```

## 🛠️ Tecnologías

### Frontend

- **[Next.js 15](https://nextjs.org/)** - Framework React con App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Tipado estático
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Framework de CSS utilitario
- **[shadcn/ui](https://ui.shadcn.com/)** - Componentes de UI modernos
- **[Lucide React](https://lucide.dev/)** - Íconos SVG

### Backend

- **[NextAuth.js](https://next-auth.js.org/)** - Autenticación completa
- **[Prisma](https://www.prisma.io/)** - ORM moderno para TypeScript
- **[Zod](https://zod.dev/)** - Validación de esquemas
- **[bcryptjs](https://github.com/dcodeIO/bcrypt.js/)** - Hash de contraseñas

### Estado y Gestión

- **[Zustand](https://zustand-demo.pmnd.rs/)** - Gestión de estado ligera
- **[React Hook Form](https://react-hook-form.com/)** - Manejo de formularios
- **[Axios](https://axios-http.com/)** - Cliente HTTP

### Herramientas

- **[ESLint](https://eslint.org/)** - Linter de JavaScript/TypeScript
- **[Prettier](https://prettier.io/)** - Formateador de código
- **[Turbopack](https://turbo.build/pack)** - Bundler rápido para desarrollo

## 🎯 Características

### ✅ Funcionalidades Implementadas

- 🔐 **Sistema de autenticación completo** (registro, login, logout)
- 👤 **Gestión de usuarios** con perfiles personalizables
- 📊 **Dashboard modular** con layout reutilizable
- 🔒 **Middleware de protección** para rutas privadas
- 🎨 **Sistema de temas** (claro/oscuro/sistema)
- 📱 **Diseño responsivo** para todos los dispositivos
- 🧩 **Componentes reutilizables** con shadcn/ui
- 🗄️ **Base de datos** con Prisma y SQLite/PostgreSQL/MySQL
- ⚡ **Optimización de rendimiento** con Next.js
- 🌐 **Internacionalización** preparada (español por defecto)
- 📈 **Monitoreo** y analytics listos para configurar
- 🔔 **Sistema de notificaciones** con Sonner
- 🛡️ **Seguridad** con headers de seguridad y CORS

### 🚧 Funcionalidades Planificadas

- 💳 **Integración con Stripe** para pagos
- 📧 **Sistema de correos** con templates
- 📱 **PWA** (Progressive Web App)
- 🔍 **Búsqueda avanzada** y filtros
- 📊 **Dashboard de analytics** avanzado
- 🤖 **API REST** completa
- 📚 **Documentación automática** de API
- 🧪 **Tests unitarios** y de integración

## 🔐 Sistema de Autenticación

El template incluye un sistema de autenticación completo construido con NextAuth.js:

### Configuración

La configuración se encuentra en `src/lib/auth.ts`:

```typescript
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from "bcryptjs";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Lógica de autenticación
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (token) session.user.id = token.id as string;
      return session;
    },
  },
};
```

### Uso en Componentes

```typescript
// Hook para obtener la sesión
import { useSession } from "next-auth/react";

function MiComponente() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Cargando...</p>;
  if (status === "unauthenticated") return <p>No autenticado</p>;

  return <p>Hola {session.user.email}!</p>;
}
```

```typescript
// Protección en páginas del servidor
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function PaginaProtegida() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return <div>Contenido protegido para {session.user.email}</div>;
}
```

### API de Autenticación

| Endpoint              | Método   | Descripción                 |
| --------------------- | -------- | --------------------------- |
| `/api/auth/signin`    | GET/POST | Página e inicio de sesión   |
| `/api/auth/signout`   | GET/POST | Cerrar sesión               |
| `/api/auth/session`   | GET      | Obtener sesión actual       |
| `/api/auth/register`  | POST     | Registro de nuevos usuarios |
| `/api/auth/providers` | GET      | Proveedores disponibles     |

### Registro de Usuarios

Ejemplo de registro personalizado:

```typescript
// src/app/api/auth/register/route.ts
export async function POST(request: Request) {
  const { email, password, name } = await request.json();

  // Validar datos
  const hashedPassword = await hash(password, 12);

  // Crear usuario
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  });

  return Response.json({ user: { id: user.id, email: user.email } });
}
```

## 🗄️ Base de Datos

El proyecto utiliza **Prisma** como ORM con soporte para SQLite, PostgreSQL y MySQL.

### Esquema de Base de Datos

El esquema está definido en `prisma/schema.prisma`:

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  password  String
  image     String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  accounts  Account[]
  sessions  Session[]

  @@map("users")
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@map("accounts")
}
```

### Operaciones Comunes

```typescript
// src/lib/prisma.ts - Cliente Prisma
import { PrismaClient } from "@/generated/prisma";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

```typescript
// Ejemplos de uso en API Routes
import { prisma } from "@/lib/prisma";

// Obtener usuarios
const users = await prisma.user.findMany({
  select: {
    id: true,
    email: true,
    name: true,
    createdAt: true,
  },
});

// Crear usuario
const user = await prisma.user.create({
  data: {
    email: "nuevo@ejemplo.com",
    name: "Usuario Nuevo",
    password: hashedPassword,
  },
});

// Actualizar usuario
const updatedUser = await prisma.user.update({
  where: { id: userId },
  data: { name: "Nuevo Nombre" },
});

// Eliminar usuario
await prisma.user.delete({
  where: { id: userId },
});
```

### Scripts de Base de Datos

```bash
# Generar cliente Prisma
npm run db:generate

# Aplicar migraciones en desarrollo
npm run db:migrate

# Cargar datos de prueba
npm run db:seed

# Abrir Prisma Studio (interfaz gráfica)
npm run db:studio

# Resetear base de datos completa
npm run db:reset
```

### Seed de Datos

El archivo `prisma/seed.ts` incluye datos de prueba:

```typescript
import { hash } from "bcryptjs";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  // Usuario de prueba
  const hashedPassword = await hash("password123", 12);

  const testUser = await prisma.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: {
      email: "test@example.com",
      name: "Usuario de Prueba",
      password: hashedPassword,
    },
  });

  console.log("Usuario creado:", testUser);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

## 🎨 Componentes del Dashboard

El template incluye un sistema modular de dashboard con componentes reutilizables.

### DashboardLayout

Componente principal que proporciona la estructura del dashboard:

```typescript
import { DashboardLayout } from "@/modules/shared/components/layout/DashboardLayout";
import { Shield, Users, Settings } from "lucide-react";

export default function MiPagina() {
  return (
    <DashboardLayout
      // Configuración de navegación
      navigation={[
        {
          label: "Principal",
          items: [
            { title: "Inicio", url: "/dashboard", icon: Home },
            { title: "Usuarios", url: "/dashboard/users", icon: Users },
          ],
        },
      ]}
      // Configuración de branding
      branding={{
        name: "Mi App",
        subtitle: "Dashboard",
        icon: Shield,
      }}
      // Acciones del header
      headerProps={{
        actions: [
          {
            label: "Nuevo Item",
            icon: Plus,
            onClick: () => console.log("Crear nuevo"),
          },
        ],
      }}
    >
      {/* Tu contenido aquí */}
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Mi Contenido</h1>
        <p>Contenido de la página...</p>
      </div>
    </DashboardLayout>
  );
}
```

### Variantes de Layout

```typescript
// Layout para administración
import { AdminDashboardLayout } from "@/modules/shared/components/layout/DashboardLayout";

export default function AdminPage() {
  return (
    <AdminDashboardLayout>
      <h1>Panel de Administración</h1>
    </AdminDashboardLayout>
  );
}

// Layout mínimo sin sidebar ni header
import { MinimalDashboardLayout } from "@/modules/shared/components/layout/DashboardLayout";

export default function FullscreenPage() {
  return (
    <MinimalDashboardLayout>
      <div className="h-full">Contenido a pantalla completa</div>
    </MinimalDashboardLayout>
  );
}
```

### Configuración de Navegación

La navegación se configura en `src/modules/shared/config/navigation.ts`:

```typescript
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
    badge: "Nuevo",
  },
];

// Crear grupos de navegación
const navigation = createNavigationGroups({
  main: DEFAULT_NAVIGATION_ITEMS,
  settings: DEFAULT_SETTINGS_ITEMS,
  custom: [
    {
      label: "Herramientas",
      items: [{ title: "Reportes", url: "/tools/reports", icon: FileText }],
    },
  ],
});
```

### AppSidebar Personalizable

```typescript
import { AppSidebar } from '@/modules/shared/components/layout/AppSidebar'

// Uso básico
<AppSidebar
  navigation={navigationItems}
  branding={{ name: "Mi App", subtitle: "v1.0", icon: Zap }}
/>

// Con configuraciones avanzadas
<AppSidebar
  navigation={navigationItems}
  branding={branding}
  showBranding={true}
  showUserInfo={true}
  collapsible={true}
  variant="sidebar"  // o "floating"
/>
```

### DashboardHeader con Acciones

```typescript
import { DashboardHeader } from "@/modules/shared/components/layout/DashboardHeader";

<DashboardHeader
  title="Mi Dashboard"
  description="Gestiona tu aplicación desde aquí"
  showBreadcrumb={true}
  showUserMenu={true}
  // Acciones personalizadas
  actions={[
    {
      label: "Exportar",
      icon: Download,
      onClick: () => handleExport(),
      variant: "outline",
    },
    {
      label: "Crear Nuevo",
      icon: Plus,
      onClick: () => handleCreate(),
      variant: "default",
    },
  ]}
  // Menú de usuario personalizado
  userMenuItems={[
    {
      label: "Mi Perfil",
      icon: User,
      href: "/profile",
    },
    {
      label: "Configuración",
      icon: Settings,
      href: "/settings",
    },
    { type: "separator" },
    {
      label: "Cerrar Sesión",
      icon: LogOut,
      onClick: () => signOut(),
    },
  ]}
/>;
```

## 🌐 Rutas y Middleware

El sistema de rutas utiliza el middleware de Next.js para protección de rutas.

### Configuración del Middleware

En `src/middleware.ts`:

```typescript
import { withAuth } from "next-auth/middleware";

// Rutas protegidas que requieren autenticación
const PROTECTED_ROUTES = [
  "/dashboard",
  "/dashboard/:path*",
  "/profile",
  "/settings",
  "/api/protected/:path*",
];

// Rutas públicas accesibles sin autenticación
const PUBLIC_ROUTES = ["/", "/login", "/register", "/api/auth/:path*"];

// Rutas de administrador
const ADMIN_ROUTES = ["/admin", "/admin/:path*", "/api/admin/:path*"];

export default withAuth(
  function middleware(request) {
    const { pathname } = request.nextUrl;
    const token = request.nextauth.token;

    // Lógica de autorización personalizada
    if (isAdminRoute(pathname) && !token?.isAdmin) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        if (isPublicRoute(pathname)) return true;
        if (isProtectedRoute(pathname)) return !!token;

        return true;
      },
    },
    pages: {
      signIn: "/login",
    },
  }
);
```

### Estructura de Rutas

```
src/app/
├── 📄 page.tsx                   # Página de inicio (/)
├── 📄 layout.tsx                 # Layout principal
├── 📁 login/
│   └── 📄 page.tsx              # Inicio de sesión (/login)
├── 📁 register/
│   └── 📄 page.tsx              # Registro (/register)
├── 📁 dashboard/                 # Área protegida
│   ├── 📄 page.tsx              # Dashboard principal
│   ├── 📁 users/
│   │   └── 📄 page.tsx          # Gestión de usuarios
│   └── 📁 settings/
│       └── 📄 page.tsx          # Configuración
├── 📁 admin/                     # Área de administración
│   ├── 📄 page.tsx              # Panel admin
│   └── 📁 users/
│       └── 📄 page.tsx          # Admin usuarios
└── 📁 api/                       # API Routes
    ├── 📁 auth/
    │   ├── 📁 [...nextauth]/
    │   │   └── 📄 route.ts       # NextAuth endpoints
    │   └── 📁 register/
    │       └── 📄 route.ts       # Registro de usuarios
    └── 📁 users/
        └── 📄 route.ts           # API de usuarios
```

### Creación de Nuevas Rutas

#### 1. Página Simple

```typescript
// src/app/mi-pagina/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function MiPagina() {
  // Proteger la página (opcional)
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <div>
      <h1>Mi Nueva Página</h1>
      <p>Hola {session.user.email}!</p>
    </div>
  );
}
```

#### 2. Página con Dashboard Layout

```typescript
// src/app/mi-dashboard/page.tsx
import { DashboardLayout } from "@/modules/shared/components/layout/DashboardLayout";
import { BarChart3 } from "lucide-react";

export default function MiDashboard() {
  return (
    <DashboardLayout
      branding={{
        name: "Mi Módulo",
        subtitle: "Dashboard",
        icon: BarChart3,
      }}
    >
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Mi Dashboard Personalizado</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Contenido del dashboard */}
        </div>
      </div>
    </DashboardLayout>
  );
}
```

#### 3. API Route

```typescript
// src/app/api/mi-endpoint/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET /api/mi-endpoint
export async function GET(request: Request) {
  try {
    // Verificar autenticación
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Lógica del endpoint
    const data = await prisma.user.findMany();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// POST /api/mi-endpoint
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();

    // Validar datos con Zod
    const validationSchema = z.object({
      name: z.string().min(1),
      email: z.string().email(),
    });

    const validatedData = validationSchema.parse(body);

    // Crear registro
    const newRecord = await prisma.user.create({
      data: validatedData,
    });

    return NextResponse.json(newRecord, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al crear registro" },
      { status: 400 }
    );
  }
}
```

### Protección de Rutas por Roles

Para implementar roles de usuario:

1. **Actualiza el modelo de usuario:**

```prisma
// prisma/schema.prisma
model User {
  id       String   @id @default(cuid())
  email    String   @unique
  name     String?
  password String
  role     UserRole @default(USER)  // Nuevo campo

  @@map("users")
}

enum UserRole {
  USER
  ADMIN
  SUPER_ADMIN
}
```

2. **Actualiza NextAuth:**

```typescript
// src/lib/auth.ts
callbacks: {
  async jwt({ token, user }) {
    if (user) {
      token.id = user.id
      token.role = user.role  // Agregar rol al token
    }
    return token
  },
  async session({ session, token }) {
    if (token) {
      session.user.id = token.id as string
      session.user.role = token.role as string  // Agregar rol a la sesión
    }
    return session
  }
}
```

3. **Proteger rutas por rol:**

```typescript
// src/middleware.ts
if (isAdminRoute(pathname)) {
  if (!token || token.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", origin));
  }
}
```

## 📦 Gestión de Estado

El template utiliza **Zustand** para la gestión de estado global, proporcionando stores modulares y tipados.

### Store de UI

```typescript
// src/modules/shared/stores/uiStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface UIState {
  // Estado del tema
  theme: "light" | "dark" | "system";
  setTheme: (theme: "light" | "dark" | "system") => void;

  // Estado de la interfaz
  isMobile: boolean;
  setIsMobile: (isMobile: boolean) => void;

  // Estado del sidebar
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;

  // Notificaciones
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, "id">) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      // Tema
      theme: "system",
      setTheme: (theme) => set({ theme }),

      // Interfaz
      isMobile: false,
      setIsMobile: (isMobile) => set({ isMobile }),

      // Sidebar
      sidebarOpen: false,
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      // Notificaciones
      notifications: [],
      addNotification: (notification) => {
        const id = Math.random().toString(36).slice(2);
        set((state) => ({
          notifications: [...state.notifications, { ...notification, id }],
        }));

        // Auto-remove después de 5 segundos
        if (notification.type !== "error") {
          setTimeout(() => {
            get().removeNotification(id);
          }, 5000);
        }
      },
      removeNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),
      clearNotifications: () => set({ notifications: [] }),
    }),
    {
      name: "ui-store",
      partialize: (state) => ({ theme: state.theme }), // Solo persistir tema
    }
  )
);
```

### Store de Autenticación

```typescript
// src/modules/shared/stores/authStore.ts
import { create } from "zustand";
import { getSession } from "next-auth/react";

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Acciones
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  checkSession: () => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
      isLoading: false,
    }),

  setLoading: (isLoading) => set({ isLoading }),

  checkSession: async () => {
    try {
      set({ isLoading: true });
      const session = await getSession();

      if (session?.user) {
        set({
          user: session.user as User,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error("Error checking session:", error);
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  logout: () => {
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },
}));
```

### Store de Datos

```typescript
// src/modules/shared/stores/dataStore.ts
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import axios from "axios";

export interface DataState {
  // Usuarios
  users: User[];
  usersLoading: boolean;
  usersError: string | null;

  // Acciones para usuarios
  fetchUsers: () => Promise<void>;
  createUser: (userData: CreateUserData) => Promise<void>;
  updateUser: (id: string, userData: UpdateUserData) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;

  // Otros datos...
  stats: DashboardStats | null;
  fetchStats: () => Promise<void>;
}

export const useDataStore = create<DataState>()(
  immer((set, get) => ({
    // Estado inicial
    users: [],
    usersLoading: false,
    usersError: null,
    stats: null,

    // Acciones para usuarios
    fetchUsers: async () => {
      set((state) => {
        state.usersLoading = true;
        state.usersError = null;
      });

      try {
        const response = await axios.get("/api/users");
        set((state) => {
          state.users = response.data;
          state.usersLoading = false;
        });
      } catch (error) {
        set((state) => {
          state.usersError = "Error al cargar usuarios";
          state.usersLoading = false;
        });
      }
    },

    createUser: async (userData) => {
      try {
        const response = await axios.post("/api/users", userData);
        set((state) => {
          state.users.push(response.data);
        });
      } catch (error) {
        throw new Error("Error al crear usuario");
      }
    },

    updateUser: async (id, userData) => {
      try {
        const response = await axios.put(`/api/users/${id}`, userData);
        set((state) => {
          const index = state.users.findIndex((u) => u.id === id);
          if (index !== -1) {
            state.users[index] = response.data;
          }
        });
      } catch (error) {
        throw new Error("Error al actualizar usuario");
      }
    },

    deleteUser: async (id) => {
      try {
        await axios.delete(`/api/users/${id}`);
        set((state) => {
          state.users = state.users.filter((u) => u.id !== id);
        });
      } catch (error) {
        throw new Error("Error al eliminar usuario");
      }
    },

    fetchStats: async () => {
      try {
        const response = await axios.get("/api/stats");
        set((state) => {
          state.stats = response.data;
        });
      } catch (error) {
        console.error("Error al cargar estadísticas:", error);
      }
    },
  }))
);
```

### Uso en Componentes

```typescript
// Componente usando múltiples stores
import { useUIStore } from "@/modules/shared/stores/uiStore";
import { useAuthStore } from "@/modules/shared/stores/authStore";
import { useDataStore } from "@/modules/shared/stores/dataStore";

export default function MiComponente() {
  // Store de UI
  const { theme, setTheme, addNotification } = useUIStore();

  // Store de auth
  const { user, isAuthenticated, checkSession } = useAuthStore();

  // Store de datos (con selector para optimización)
  const users = useDataStore((state) => state.users);
  const fetchUsers = useDataStore((state) => state.fetchUsers);
  const usersLoading = useDataStore((state) => state.usersLoading);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUsers();
    }
  }, [isAuthenticated, fetchUsers]);

  const handleThemeChange = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    addNotification({
      title: "Tema cambiado",
      description: `Tema cambiado a ${newTheme}`,
      type: "success",
    });
  };

  return (
    <div>
      <h1>Hola {user?.name}</h1>
      <button onClick={handleThemeChange}>Cambiar tema actual: {theme}</button>

      {usersLoading ? (
        <p>Cargando usuarios...</p>
      ) : (
        <ul>
          {users.map((user) => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

### Persistencia Selectiva

```typescript
// Store con persistencia personalizada
import { persist, createJSONStorage } from "zustand/middleware";

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      // Estado...
    }),
    {
      name: "settings-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        theme: state.theme,
        language: state.language,
        // No persistir datos sensibles
      }),
      onRehydrateStorage: (state) => {
        console.log("Hidratando store de configuración", state);
        return (state, error) => {
          if (error) {
            console.error("Error hidratando store:", error);
          } else {
            console.log("Store hidratado correctamente");
          }
        };
      },
    }
  )
);
```

## 🎨 Theming y UI

El template utiliza **Tailwind CSS** con **shadcn/ui** para un sistema de diseño consistente y customizable.

### Sistema de Temas

> **💡 Personalización Fácil**: Puedes personalizar todos los colores del tema usando el **[Editor de Temas de TweakCN](https://tweakcn.com/editor/theme)**. Esta herramienta genera automáticamente las variables CSS que necesitas copiar en tu archivo `src/app/globals.css`.

La configuración de temas se encuentra en `tailwind.config.ts`:

```typescript
// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

### Variables CSS Personalizadas

En `src/app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Tema claro */
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96%;
    --secondary-foreground: 222.2 84% 4.9%;
    --muted: 210 40% 96%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96%;
    --accent-foreground: 222.2 84% 4.9%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
  }

  .dark {
    /* Tema oscuro */
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 84% 4.9%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.3% 94.1%;
  }
}

/* Utilidades personalizadas */
@layer components {
  .glass-effect {
    @apply bg-white/10 backdrop-blur-md border border-white/20 dark:bg-black/10 dark:border-white/10;
  }

  .card-gradient {
    @apply bg-gradient-to-br from-white via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800;
  }

  .text-gradient {
    @apply bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent;
  }
}

/* Estilos globales */
@layer base {
  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground;
    font-feature-settings: "rlig" 1, "calt" 1;
  }

  /* Scrollbar personalizado */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    @apply bg-muted;
  }

  ::-webkit-scrollbar-thumb {
    @apply bg-muted-foreground/30 rounded-md;
  }

  ::-webkit-scrollbar-thumb:hover {
    @apply bg-muted-foreground/50;
  }
}
```

### Componentes de UI Personalizados

#### Button con Variantes

```typescript
// src/modules/shared/components/ui/button.tsx
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "underline-offset-4 hover:underline text-primary",
        gradient:
          "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-md",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
```

#### Card con Efectos

```typescript
// src/modules/shared/components/ui/card.tsx
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass" | "gradient" | "elevated";
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variants = {
      default: "rounded-lg border bg-card text-card-foreground shadow-sm",
      glass: "rounded-lg glass-effect text-card-foreground shadow-xl",
      gradient: "rounded-lg card-gradient text-card-foreground shadow-md",
      elevated:
        "rounded-lg bg-card text-card-foreground shadow-lg hover:shadow-xl transition-shadow",
    };

    return (
      <div ref={ref} className={cn(variants[variant], className)} {...props} />
    );
  }
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
};
```

### Uso de Componentes

```typescript
// Ejemplo de uso de componentes con temas
import { Button } from "@/modules/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/modules/shared/components/ui/card";
import { Badge } from "@/modules/shared/components/ui/badge";

export default function MiComponente() {
  return (
    <div className="space-y-6">
      {/* Card con efecto glass */}
      <Card variant="glass" className="p-6">
        <CardHeader>
          <CardTitle className="text-gradient">Dashboard Moderno</CardTitle>
          <CardDescription>Un diseño limpio y profesional</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button variant="gradient">Acción Principal</Button>
            <Button variant="outline">Acción Secundaria</Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex gap-2">
            <Badge variant="default">Activo</Badge>
            <Badge variant="secondary">En Progreso</Badge>
            <Badge variant="destructive">Error</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Grid responsivo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card
            key={i}
            variant="elevated"
            className="hover:scale-105 transition-transform"
          >
            <CardHeader>
              <CardTitle>Card {i}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Contenido de ejemplo con animaciones</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

### Toggle de Tema

```typescript
// Componente para cambiar tema
import { Moon, Sun, Monitor } from "lucide-react";
import { useUIStore } from "@/modules/shared/stores/uiStore";

export function ThemeToggle() {
  const { theme, setTheme } = useUIStore();

  const themes = [
    { value: "light", icon: Sun, label: "Claro" },
    { value: "dark", icon: Moon, label: "Oscuro" },
    { value: "system", icon: Monitor, label: "Sistema" },
  ] as const;

  return (
    <div className="flex rounded-lg bg-muted p-1">
      {themes.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm font-medium transition-all ${
            theme === value
              ? "bg-background shadow-sm text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Icon className="h-4 w-4" />
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );
}
```

## 🔧 Scripts Disponibles

El proyecto incluye varios scripts útiles para desarrollo y despliegue:

### Scripts de Desarrollo

```bash
# Iniciar servidor de desarrollo con Turbopack
npm run dev

# Iniciar servidor de desarrollo estándar
npm run dev:standard

# Linter de código
npm run lint

# Corrección automática de linting
npm run lint:fix

# Formateo de código con Prettier
npm run format

# Verificación de tipos TypeScript
npm run type-check
```

### Scripts de Base de Datos

```bash
# Generar cliente Prisma
npm run db:generate

# Aplicar migraciones en desarrollo
npm run db:migrate

# Crear nueva migración
npm run db:migrate:create

# Aplicar migraciones en producción
npm run db:migrate:deploy

# Cargar datos de prueba
npm run db:seed

# Abrir Prisma Studio
npm run db:studio

# Resetear base de datos completa
npm run db:reset

# Verificar estado de migraciones
npm run db:status
```

### Scripts de Construcción y Despliegue

```bash
# Construir aplicación para producción
npm run build

# Construir con Turbopack
npm run build:turbo

# Iniciar aplicación en producción
npm run start

# Analizar bundle de la aplicación
npm run analyze

# Verificar aplicación antes de despliegue
npm run check
```

### Scripts de Testing

```bash
# Ejecutar tests unitarios
npm run test

# Ejecutar tests en modo watch
npm run test:watch

# Generar reporte de cobertura
npm run test:coverage

# Ejecutar tests de integración
npm run test:integration

# Ejecutar todos los tests
npm run test:all
```

### Scripts Personalizados

Puedes agregar tus propios scripts en `package.json`:

```json
{
  "scripts": {
    // Scripts existentes...

    // Scripts personalizados
    "setup": "npm install && npm run db:generate && npm run db:migrate && npm run db:seed",
    "clean": "rm -rf .next node_modules package-lock.json && npm install",
    "backup:db": "cp prisma/dev.db prisma/backups/dev-$(date +%Y%m%d-%H%M%S).db",
    "export:schema": "prisma db pull && prisma generate",
    "check:deps": "npm audit && npm outdated",
    "update:deps": "npm update && npm audit fix",
    "docs:generate": "typedoc --out docs src",
    "deploy:vercel": "vercel --prod",
    "deploy:netlify": "netlify deploy --prod"
  }
}
```

## 🚀 Despliegue

El template está optimizado para despliegue en múltiples plataformas.

### Vercel (Recomendado)

Vercel es la plataforma ideal para aplicaciones Next.js:

#### 1. Configuración Automática

```bash
# Instalar Vercel CLI
npm i -g vercel

# Inicializar proyecto
vercel

# Desplegar a producción
vercel --prod
```

#### 2. Variables de Entorno

Configura las variables en el dashboard de Vercel o con CLI:

```bash
# Agregar variables de entorno
vercel env add DATABASE_URL
vercel env add NEXTAUTH_SECRET
vercel env add NEXTAUTH_URL
```

#### 3. Archivo de Configuración

Crea `vercel.json` en la raíz:

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "env": {
    "DATABASE_URL": "@database-url",
    "NEXTAUTH_SECRET": "@nextauth-secret",
    "NEXTAUTH_URL": "@nextauth-url"
  },
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

### Netlify

#### 1. Configuración

Crea `netlify.toml`:

```toml
[build]
  publish = ".next"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[context.production.environment]
  NEXTAUTH_URL = "https://tu-sitio.netlify.app"

[context.deploy-preview.environment]
  NEXTAUTH_URL = "https://deploy-preview-{REVIEW_ID}--tu-sitio.netlify.app"
```

#### 2. Despliegue

```bash
# Con Netlify CLI
npm i -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

### Docker

#### 1. Dockerfile

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Instalar dependencias solamente cuando sea necesario
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Instalar dependencias basado en el gestor de paquetes preferido
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Reconstruir el código fuente solamente cuando sea necesario
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generar Prisma client
RUN npx prisma generate

# Construir aplicación
RUN npm run build

# Imagen de producción, copiar archivos y ejecutar next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar archivos necesarios
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./package.json

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

#### 2. Docker Compose

```yaml
# docker-compose.yml
version: "3.8"

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://user:password@db:5432/genesis_db
      - NEXTAUTH_SECRET=your-secret-here
      - NEXTAUTH_URL=http://localhost:3000
    depends_on:
      - db
    volumes:
      - ./prisma:/app/prisma

  db:
    image: postgres:15
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: genesis_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

#### 3. Comandos Docker

```bash
# Construir imagen
docker build -t genesis-project .

# Ejecutar con Docker Compose
docker-compose up -d

# Ver logs
docker-compose logs -f app

# Ejecutar migraciones
docker-compose exec app npx prisma migrate deploy

# Detener servicios
docker-compose down
```

### Variables de Entorno para Producción

```env
# Producción - .env.production
NODE_ENV=production
NEXTAUTH_URL=https://tu-dominio.com
NEXTAUTH_SECRET=tu-secret-super-seguro-de-32-caracteres-minimo
DATABASE_URL=postgresql://user:password@host:5432/database

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Servicios externos
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Email
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=noreply@tu-dominio.com
SMTP_PASSWORD=tu-password-email
SMTP_FROM=noreply@tu-dominio.com

# Monitoring
SENTRY_DSN=https://your-dsn@sentry.io/project-id
```

### Checklist de Despliegue

- [ ] **Variables de entorno configuradas**

  - [ ] `NEXTAUTH_SECRET` con valor seguro (32+ caracteres)
  - [ ] `NEXTAUTH_URL` con dominio de producción
  - [ ] `DATABASE_URL` apuntando a base de datos de producción
  - [ ] Variables de servicios externos (Stripe, etc.)

- [ ] **Base de datos preparada**

  - [ ] Base de datos de producción creada
  - [ ] Migraciones aplicadas: `npx prisma migrate deploy`
  - [ ] Datos iniciales cargados si es necesario

- [ ] **Configuración de aplicación**

  - [ ] `next.config.ts` optimizado para producción
  - [ ] Archivos estáticos optimizados
  - [ ] Headers de seguridad configurados
  - [ ] Dominio personalizado configurado (opcional)

- [ ] **Testing pre-despliegue**

  - [ ] Build local exitoso: `npm run build`
  - [ ] Tests pasando: `npm test`
  - [ ] Verificación de tipos: `npm run type-check`
  - [ ] Linting sin errores: `npm run lint`

- [ ] **Monitoreo post-despliegue**
  - [ ] Analytics configurado (Google Analytics, etc.)
  - [ ] Error tracking configurado (Sentry, etc.)
  - [ ] Logs de aplicación funcionando
  - [ ] Performance monitoring activo

## 📝 Mejores Prácticas

Sigue estas prácticas recomendadas para mantener un código limpio y escalable:

### 1. Estructura de Archivos

```
✅ Bueno: Estructura modular
src/
├── app/                    # Pages y layouts
├── modules/               # Módulos por funcionalidad
│   ├── auth/             # Módulo de autenticación
│   ├── dashboard/        # Módulo de dashboard
│   └── shared/           # Código compartido
│       ├── components/   # Componentes reutilizables
│       ├── hooks/        # Custom hooks
│       ├── utils/        # Utilidades
│       └── types/        # Tipos TypeScript
└── lib/                  # Configuraciones y librerías

❌ Evitar: Todo en una carpeta
src/
├── components/           # Demasiado general
├── pages/               # Mezclado con lógica
└── utils/               # Sin organización
```

### 2. Nomenclatura

```typescript
// ✅ Bueno: Nombres descriptivos
const handleUserRegistration = async (userData: CreateUserData) => {
  // lógica...
};

const isUserAuthenticated = (user: User | null): user is User => {
  return user !== null && user.id !== undefined;
};

interface DashboardLayoutProps {
  children: React.ReactNode;
  navigation?: NavigationItem[];
  showSidebar?: boolean;
}

// ❌ Evitar: Nombres genéricos
const handleSubmit = (data: any) => {
  // lógica...
};

const check = (user: any) => {
  return user !== null;
};

interface Props {
  children: any;
  items?: any[];
  show?: boolean;
}
```

### 3. Tipos TypeScript

```typescript
// ✅ Bueno: Tipos específicos y reutilizables
export interface User {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateUserData = Pick<User, "email" | "name"> & {
  password: string;
};

export type UpdateUserData = Partial<Pick<User, "name" | "email">>;

export interface ApiResponse<T> {
  data: T;
  message: string;
  status: "success" | "error";
}

// ❌ Evitar: Uso excesivo de any
export interface User {
  id: any;
  email: any;
  data: any;
}

export type UserData = any;
```

### 4. Gestión de Estado

```typescript
// ✅ Bueno: Store modular con tipos
export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;

  // Acciones con tipos específicos
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
}

// ✅ Bueno: Selectores para optimización
const useAuthUser = () => useAuthStore((state) => state.user);
const useAuthActions = () =>
  useAuthStore((state) => ({
    login: state.login,
    logout: state.logout,
  }));

// ❌ Evitar: Estado global masivo
interface AppState {
  user: any;
  ui: any;
  data: any;
  everything: any;
  // Demasiado en un solo store
}
```

### 5. Componentes Reutilizables

```typescript
// ✅ Bueno: Componente flexible y tipado
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "default",
      size = "default",
      loading,
      leftIcon,
      rightIcon,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={loading || props.disabled}
        className={cn(buttonVariants({ variant, size }), props.className)}
        {...props}
      >
        {loading && <Spinner className="w-4 h-4 mr-2" />}
        {leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);

// ❌ Evitar: Componente rígido
function Button({ text, onClick }: { text: string; onClick: () => void }) {
  return <button onClick={onClick}>{text}</button>;
}
```

### 6. Manejo de Errores

```typescript
// ✅ Bueno: Manejo robusto de errores
export class AppError extends Error {
  constructor(
    public message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = "AppError";
  }
}

export const handleApiError = (error: unknown): AppError => {
  if (error instanceof AppError) {
    return error;
  }

  if (axios.isAxiosError(error)) {
    return new AppError(
      error.response?.data?.message || "Error de red",
      "NETWORK_ERROR",
      error.response?.status || 500
    );
  }

  return new AppError("Error inesperado", "UNKNOWN_ERROR", 500);
};

// Uso en componentes
const {
  mutate: createUser,
  isLoading,
  error,
} = useMutation({
  mutationFn: async (userData: CreateUserData) => {
    const response = await api.post("/users", userData);
    return response.data;
  },
  onError: (error) => {
    const appError = handleApiError(error);
    toast.error(appError.message);
  },
  onSuccess: () => {
    toast.success("Usuario creado exitosamente");
    queryClient.invalidateQueries({ queryKey: ["users"] });
  },
});

// ❌ Evitar: Errores silenciosos
try {
  await api.post("/users", userData);
} catch (error) {
  console.log(error); // Error silencioso
}
```

### 7. Performance

```typescript
// ✅ Bueno: Optimizaciones de performance
const UserList = React.memo(({ users }: { users: User[] }) => {
  const memoizedUsers = useMemo(
    () => users.filter(user => user.isActive),
    [users]
  )

  return (
    <div>
      {memoizedUsers.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  )
})

// Hook personalizado para debounce
const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}

// Lazy loading de componentes
const HeavyComponent = lazy(() => import('./HeavyComponent'))

const App = () => (
  <Suspense fallback={<Spinner />}>
    <HeavyComponent />
  </Suspense>
)

// ❌ Evitar: Re-renders innecesarios
const UserList = ({ users }: { users: User[] }) => {
  // Se ejecuta en cada render
  const activeUsers = users.filter(user => user.isActive)

  return (
    <div>
      {activeUsers.map((user, index) => (
        <UserCard key={index} user={user} /> // Key inestable
      ))}
    </div>
  )
}
```

### 8. Seguridad

```typescript
// ✅ Bueno: Validación y sanitización
import { z } from "zod";
import DOMPurify from "dompurify";

// Esquemas de validación
export const CreateUserSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z
    .string()
    .min(8, "Mínimo 8 caracteres")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "Debe contener mayúscula, minúscula, número y carácter especial"
    ),
  name: z.string().min(1, "Nombre requerido").max(100, "Máximo 100 caracteres"),
});

// Sanitización de inputs
const sanitizeInput = (input: string): string => {
  return DOMPurify.sanitize(input.trim());
};

// Verificación de permisos
export const requireAuth = async (request: NextRequest) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  return session;
};

export const requireRole = (allowedRoles: UserRole[]) => {
  return async (request: NextRequest) => {
    const session = await requireAuth(request);

    if (session instanceof NextResponse) return session;

    if (!allowedRoles.includes(session.user.role)) {
      return NextResponse.json(
        { error: "Permisos insuficientes" },
        { status: 403 }
      );
    }

    return session;
  };
};

// ❌ Evitar: Datos sin validar
export async function POST(request: Request) {
  const data = await request.json(); // Sin validación

  const user = await prisma.user.create({
    data, // Datos directos sin sanitizar
  });

  return Response.json(user);
}
```

### 9. Testing

```typescript
// ✅ Bueno: Tests comprehensivos
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { LoginForm } from "./LoginForm";
import { AuthProvider } from "@/contexts/AuthContext";

const renderWithAuth = (ui: React.ReactElement) => {
  return render(<AuthProvider>{ui}</AuthProvider>);
};

describe("LoginForm", () => {
  it("should submit form with valid credentials", async () => {
    const mockLogin = jest.fn().mockResolvedValue({ success: true });

    renderWithAuth(<LoginForm onLogin={mockLogin} />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /iniciar sesión/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
    });
  });

  it("should display error for invalid email", async () => {
    renderWithAuth(<LoginForm />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "invalid-email" },
    });

    fireEvent.blur(screen.getByLabelText(/email/i));

    await waitFor(() => {
      expect(screen.getByText(/email inválido/i)).toBeInTheDocument();
    });
  });
});

// Mock de API
jest.mock("@/lib/api", () => ({
  auth: {
    login: jest.fn(),
    logout: jest.fn(),
    register: jest.fn(),
  },
}));
```

### 10. Accesibilidad

```typescript
// ✅ Bueno: Componentes accesibles
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Trap focus
  useEffect(() => {
    if (isOpen) {
      modalRef.current?.focus();
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className={`relative bg-white rounded-lg shadow-xl ${sizeClasses[size]}`}
        tabIndex={-1}
      >
        <header className="flex items-center justify-between p-6 border-b">
          <h2 id="modal-title" className="text-xl font-semibold">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

// ❌ Evitar: Sin accesibilidad
const Modal = ({ isOpen, children }: any) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50">
      <div className="bg-white p-4">
        {children}
        <button onClick={() => {}}>X</button>
      </div>
    </div>
  );
};
```

## 🤝 Contribución

Contribuciones son bienvenidas! Sigue estos pasos para contribuir:

### 1. Fork y Clone

```bash
# Fork el repositorio en GitHub
# Luego clona tu fork
git clone https://github.com/tu-usuario/genesis-project.git
cd genesis-project
```

### 2. Configuración de Desarrollo

```bash
# Instalar dependencias
npm install

# Configurar base de datos
npm run db:generate
npm run db:migrate
npm run db:seed

# Iniciar servidor de desarrollo
npm run dev
```

### 3. Crear Branch

```bash
# Crear branch para tu feature
git checkout -b feature/nueva-funcionalidad

# O para bug fix
git checkout -b fix/descripcion-del-bug
```

### 4. Desarrollo

- Sigue las [mejores prácticas](#-mejores-prácticas)
- Mantén el código consistente con el estilo existente
- Añade tests para nuevas funcionalidades
- Actualiza documentación si es necesario

### 5. Testing

```bash
# Ejecutar todos los tests
npm run test

# Verificar tipos
npm run type-check

# Linting
npm run lint

# Build test
npm run build
```

### 6. Commit

Usa [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Ejemplos de commits
git commit -m "feat: add user profile management"
git commit -m "fix: resolve authentication redirect issue"
git commit -m "docs: update API documentation"
git commit -m "refactor: improve dashboard layout performance"
git commit -m "test: add unit tests for auth service"
```

### 7. Pull Request

1. Push tu branch: `git push origin feature/nueva-funcionalidad`
2. Crea Pull Request en GitHub
3. Describe los cambios claramente
4. Incluye screenshots si hay cambios de UI
5. Asegúrate que todos los checks pasen

### Tipos de Contribuciones

- **🐛 Bug Fixes**: Corrección de errores
- **✨ Features**: Nuevas funcionalidades
- **📚 Documentation**: Mejoras en documentación
- **🎨 UI/UX**: Mejoras de interfaz y experiencia
- **⚡ Performance**: Optimizaciones de rendimiento
- **🔧 Refactor**: Mejoras de código sin cambiar funcionalidad
- **🧪 Testing**: Añadir o mejorar tests
- **🔒 Security**: Correcciones de seguridad

### Guidelines

- **Code Style**: Seguir las reglas de ESLint y Prettier
- **TypeScript**: Usar tipos estrictos, evitar `any`
- **Testing**: Mantener cobertura de tests > 80%
- **Documentation**: Documentar APIs y componentes complejos
- **Performance**: Considerar el impacto en performance
- **Accessibility**: Seguir estándares de accesibilidad WCAG
- **Mobile**: Asegurar responsive design

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 🙋‍♂️ Soporte

¿Necesitas ayuda? Aquí tienes varias opciones:

- 📖 **Documentación**: Revisa esta documentación completa
- 🐛 **Issues**: [Reporta bugs o solicita features](https://github.com/tu-usuario/genesis-project/issues)
- 💬 **Discusiones**: [Únete a las discusiones](https://github.com/tu-usuario/genesis-project/discussions)
- 📧 **Email**: contacto@ejemplo.com

## 🚀 ¿Qué sigue?

El template está en constante evolución. Próximas funcionalidades:

- [ ] **Stripe Integration**: Sistema de pagos completo
- [ ] **Email Templates**: Sistema de correos con templates
- [ ] **PWA Support**: Convertir en Progressive Web App
- [ ] **Advanced Analytics**: Dashboard de analytics avanzado
- [ ] **Multi-tenant**: Soporte para múltiples tenants
- [ ] **API Documentation**: Documentación automática con OpenAPI
- [ ] **Mobile App**: Aplicación móvil con React Native
- [ ] **Advanced Testing**: Tests E2E con Playwright

---

**Hecho con ❤️ para la comunidad de desarrolladores**

¿Te gusta el proyecto? ¡Dale una ⭐ en GitHub!
