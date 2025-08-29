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
import { ArrowRight, Shield, Zap, Users, Code2, Database, Palette } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/hooks/useAuth'

/**
 * Features showcase data
 * @const {Array} FEATURES
 * @description Array of features to display on the landing page
 */
const FEATURES = [
  {
    icon: Shield,
    title: 'Autenticación Segura',
    description: 'NextAuth.js con proveedores múltiples y autenticación de credenciales segura.'
  },
  {
    icon: Palette,
    title: 'UI Moderna',
    description: 'shadcn/ui con componentes reutilizables y diseño responsivo con Tailwind CSS.'
  },
  {
    icon: Database,
    title: 'Base de Datos',
    description: 'Prisma ORM con SQLite para desarrollo y fácil migración a PostgreSQL.'
  },
  {
    icon: Zap,
    title: 'Estado Global',
    description: 'Zustand para gestión de estado global con persistencia y optimizaciones.'
  },
  {
    icon: Code2,
    title: 'TypeScript',
    description: 'Completamente tipado con TypeScript para mejor experiencia de desarrollo.'
  },
  {
    icon: Users,
    title: 'Listo para SaaS',
    description: 'Plantilla completa con dashboard, autenticación y gestión de usuarios.'
  }
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
function FeatureCard({ icon: Icon, title, description }: {
  icon: React.ComponentType<any>
  title: string
  description: string
}): React.JSX.Element {
  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
          <Icon className="w-6 h-6 text-primary" />
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Don't render landing page if user is authenticated (will redirect)
  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Redirigiendo al dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Navigation */}
      <nav className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary-foreground" />
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
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Template SaaS
              <span className="block text-primary">Moderno y Completo</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Plantilla completa para aplicaciones SaaS construida con Next.js, TypeScript, 
              shadcn/ui, NextAuth, Prisma y Zustand. Lista para producción.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/register">
                <Button size="lg" className="min-w-[200px]">
                  Comenzar Gratis
                  <ArrowRight className="w-5 h-5 ml-2" />
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
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Todo lo que necesitas para tu SaaS
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Funcionalidades modernas y mejores prácticas integradas desde el primer día.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Tecnologías Modernas
            </h2>
            <p className="text-xl text-muted-foreground">
              Construido con las mejores herramientas del ecosistema React
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
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
              <div key={index} className="text-center p-6 rounded-lg border bg-card hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-lg mb-2">{tech.name}</h3>
                <p className="text-sm text-muted-foreground">{tech.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary/5">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ¿Listo para comenzar tu proyecto SaaS?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Regístrate ahora y comienza a construir tu aplicación con todas las funcionalidades incluidas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/register">
              <Button size="lg" className="min-w-[200px]">
                Crear Cuenta Gratis
                <ArrowRight className="w-5 h-5 ml-2" />
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
      <footer className="border-t bg-background py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">SaaS Template</span>
            </div>
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
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
