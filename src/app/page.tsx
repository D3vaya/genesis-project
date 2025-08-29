/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @fileoverview Home page component with authentication-aware routing
 * @description Landing page that redirects users based on authentication status - authenticated users go to dashboard, others see the landing page
 * @author Generated SaaS Template
 * @version 1.0.0
 */

'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowRight,
  Shield,
  Zap,
  Users,
  Code2,
  Database,
  Palette,
} from 'lucide-react'

import { Button } from '@/modules/shared/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/modules/shared/components/ui/card'
import { useAuth } from '@/modules/shared/hooks/useAuth'

/**
 * Features showcase data
 * @const {Array} FEATURES
 * @description Array of features to display on the landing page
 */
const FEATURES = [
  {
    icon: Shield,
    title: 'Autenticación Segura',
    description:
      'NextAuth.js con proveedores múltiples y autenticación de credenciales segura.',
  },
  {
    icon: Palette,
    title: 'UI Moderna',
    description:
      'shadcn/ui con componentes reutilizables y diseño responsivo con Tailwind CSS.',
  },
  {
    icon: Database,
    title: 'Base de Datos',
    description:
      'Prisma ORM con SQLite para desarrollo y fácil migración a PostgreSQL.',
  },
  {
    icon: Zap,
    title: 'Estado Global',
    description:
      'Zustand para gestión de estado global con persistencia y optimizaciones.',
  },
  {
    icon: Code2,
    title: 'TypeScript',
    description:
      'Completamente tipado con TypeScript para mejor experiencia de desarrollo.',
  },
  {
    icon: Users,
    title: 'Listo para SaaS',
    description:
      'Plantilla completa con dashboard, autenticación y gestión de usuarios.',
  },
]

/**
 * Feature card component
 * @component FeatureCard
 * @description Individual feature display card
 * @param {Object} props - Component props
 * @param {React.ComponentType} props.icon - Icon component
 * @param {string} props.title - Feature title
 * @param {string} props.description - Feature description
 * @returns {React.JSX.Element} Feature card component
 */
function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<any>
  title: string
  description: string
}): React.JSX.Element {
  return (
    <Card className="h-full transition-shadow hover:shadow-lg">
      <CardHeader>
        <div className="bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
          <Icon className="text-primary h-6 w-6" />
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-muted-foreground">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  )
}

/**
 * Home page component
 * @component HomePage
 * @description Main landing page with authentication-aware routing
 * @returns {React.JSX.Element} Home page with hero section, features, and navigation
 * @example
 * ```typescript
 * // This component automatically:
 * // 1. Redirects authenticated users to dashboard
 * // 2. Shows landing page to unauthenticated users
 * // 3. Provides links to login/register for new users
 * ```
 */
export default function HomePage(): React.JSX.Element {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  /**
   * Redirect authenticated users to dashboard
   * @description Automatically redirects authenticated users to the dashboard
   */
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, isLoading, router])

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
      </div>
    )
  }

  // Don't render landing page if user is authenticated (will redirect)
  if (isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Redirigiendo al dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="from-background to-muted min-h-screen bg-gradient-to-br">
      {/* Navigation */}
      <nav className="bg-background/80 sticky top-0 z-50 border-b backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-lg">
                <Zap className="text-primary-foreground h-5 w-5" />
              </div>
              <span className="text-xl font-bold">SaaS Template</span>
            </div>

            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Iniciar Sesión
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">
                  Registrarse
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
              Template SaaS
              <span className="text-primary block">Moderno y Completo</span>
            </h1>
            <p className="text-muted-foreground mb-8 text-xl leading-relaxed">
              Plantilla completa para aplicaciones SaaS construida con Next.js,
              TypeScript, shadcn/ui, NextAuth, Prisma y Zustand. Lista para
              producción.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/register">
                <Button size="lg" className="min-w-[200px]">
                  Comenzar Gratis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="min-w-[200px]">
                  Iniciar Sesión
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Todo lo que necesitas para tu SaaS
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
              Funcionalidades modernas y mejores prácticas integradas desde el
              primer día.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Tecnologías Modernas
            </h2>
            <p className="text-muted-foreground text-xl">
              Construido con las mejores herramientas del ecosistema React
            </p>
          </div>

          <div className="grid grid-cols-2 items-center gap-8 md:grid-cols-4">
            {[
              { name: 'Next.js 15', description: 'Framework React' },
              { name: 'TypeScript', description: 'Tipado estático' },
              { name: 'shadcn/ui', description: 'Componentes UI' },
              { name: 'Tailwind CSS', description: 'Estilos utilitarios' },
              { name: 'NextAuth.js', description: 'Autenticación' },
              { name: 'Prisma', description: 'ORM de base de datos' },
              { name: 'Zustand', description: 'Estado global' },
              { name: 'React Hook Form', description: 'Formularios' },
            ].map((tech, index) => (
              <div
                key={index}
                className="bg-card rounded-lg border p-6 text-center transition-shadow hover:shadow-md"
              >
                <h3 className="mb-2 text-lg font-semibold">{tech.name}</h3>
                <p className="text-muted-foreground text-sm">
                  {tech.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary/5 py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            ¿Listo para comenzar tu proyecto SaaS?
          </h2>
          <p className="text-muted-foreground mb-8 text-xl">
            Regístrate ahora y comienza a construir tu aplicación con todas las
            funcionalidades incluidas.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/register">
              <Button size="lg" className="min-w-[200px]">
                Crear Cuenta Gratis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="min-w-[200px]">
                Ya tengo cuenta
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <div className="mb-4 flex items-center space-x-2 md:mb-0">
              <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-lg">
                <Zap className="text-primary-foreground h-5 w-5" />
              </div>
              <span className="text-xl font-bold">SaaS Template</span>
            </div>
            <div className="text-muted-foreground flex items-center space-x-6 text-sm">
              <span>© 2024 SaaS Template</span>
              <a href="#" className="hover:text-foreground transition-colors">
                Privacidad
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Términos
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Soporte
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
