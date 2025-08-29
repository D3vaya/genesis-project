/**
 * @fileoverview Login page component with form validation and authentication
 * @description Provides user login functionality with react-hook-form, Zod validation, and shadcn/ui components
 * @author Generated SaaS Template
 * @version 1.0.0
 */

'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { Eye, EyeOff, Loader2, LogIn } from 'lucide-react'

import { Button } from '@/modules/shared/components/ui/button'
import { Input } from '@/modules/shared/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/modules/shared/components/ui/card'
import { Alert, AlertDescription } from '@/modules/shared/components/ui/alert'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/modules/shared/components/ui/form'

import { useAuthStore } from '@/modules/shared/stores/authStore'
import { toast } from 'sonner'
import { loginSchema, type LoginFormData } from '@/lib/validations'

/**
 * Login Page Component
 * @component
 * @description Main login page component with comprehensive form validation and user authentication
 * @returns {React.JSX.Element} Login page with form, validation, and error handling
 * @example
 * ```typescript
 * // This component is automatically rendered at /login route
 * // Users can enter their email and password to authenticate
 * // Form includes validation, loading states, and error handling
 * ```
 */
export default function LoginPage(): React.JSX.Element {
  const router = useRouter()
  const { login, isAuthenticated, isLoading, error, clearError } =
    useAuthStore()

  const [showPassword, setShowPassword] = useState<boolean>(false)

  /**
   * React Hook Form setup with Zod validation
   * @description Configures form handling with automatic validation using Zod schema
   */
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange', // Validate on change for better UX
  })

  /**
   * Redirect authenticated users
   * @description Automatically redirects authenticated users to dashboard
   */
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  /**
   * Clear error when component unmounts or user starts typing
   * @description Clears authentication errors for better UX
   */
  useEffect(() => {
    const subscription = form.watch(() => {
      if (error) {
        clearError()
      }
    })

    return () => subscription.unsubscribe()
  }, [form, error, clearError])

  /**
   * Form submission handler
   * @function onSubmit
   * @description Handles login form submission with error handling and success feedback
   * @param {LoginFormData} data - Validated form data from react-hook-form
   * @returns {Promise<void>} Promise that resolves when login attempt is complete
   * @example
   * ```typescript
   * // This function is called automatically when form is submitted
   * // It validates data, attempts login, and handles success/error states
   * const formData: LoginFormData = {
   *   email: 'user@example.com',
   *   password: 'password123'
   * }
   * await onSubmit(formData)
   * ```
   */
  const onSubmit = async (data: LoginFormData): Promise<void> => {
    try {
      clearError()

      const success = await login(data.email, data.password)

      if (success) {
        toast.success('¡Bienvenido!', {
          description: 'Has iniciado sesión correctamente',
        })

        // Router push will be handled by useEffect when isAuthenticated changes
      }
      // Error handling is managed by the auth store
    } catch (error) {
      console.error('Login error:', error)
      toast.error('Error de Autenticación', {
        description:
          'Ocurrió un error inesperado. Por favor, intenta de nuevo.',
      })
    }
  }

  /**
   * Toggle password visibility
   * @function togglePasswordVisibility
   * @description Toggles between showing and hiding the password field
   * @example
   * ```typescript
   * togglePasswordVisibility() // Switches password field visibility
   * ```
   */
  const togglePasswordVisibility = (): void => {
    setShowPassword(!showPassword)
  }

  /**
   * Get form field error message
   * @function getFieldError
   * @description Helper function to get error message for a specific form field
   * @param {keyof LoginFormData} fieldName - Name of the form field
   * @returns {string | undefined} Error message if field has error, undefined otherwise
   */
  const getFieldError = (
    fieldName: keyof LoginFormData
  ): string | undefined => {
    return form.formState.errors[fieldName]?.message
  }

  /**
   * Check if form is valid and can be submitted
   * @function canSubmit
   * @description Determines if the form can be submitted based on validation state
   * @returns {boolean} True if form can be submitted, false otherwise
   */
  const canSubmit = (): boolean => {
    return form.formState.isValid && !isLoading
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4 dark:from-slate-900 dark:to-slate-800">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="mb-4 flex justify-center">
            <div className="bg-primary/10 rounded-full p-3">
              <LogIn className="text-primary h-8 w-8" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            Iniciar Sesión
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Ingresa tus credenciales para acceder a tu cuenta
          </CardDescription>
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <CardContent className="space-y-4">
              {/* Global Error Alert */}
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="email">Correo Electrónico</FormLabel>
                    <FormControl>
                      <Input
                        id="email"
                        type="email"
                        placeholder="tu@ejemplo.com"
                        autoComplete="email"
                        disabled={isLoading}
                        className={
                          getFieldError('email') ? 'border-destructive' : ''
                        }
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="password">Contraseña</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Tu contraseña"
                          autoComplete="current-password"
                          disabled={isLoading}
                          className={`pr-10 ${
                            getFieldError('password')
                              ? 'border-destructive'
                              : ''
                          }`}
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          disabled={isLoading}
                          className="text-muted-foreground hover:text-foreground focus:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transform focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                          aria-label={
                            showPassword
                              ? 'Ocultar contraseña'
                              : 'Mostrar contraseña'
                          }
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={!canSubmit()}
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Iniciando sesión...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Iniciar Sesión
                  </>
                )}
              </Button>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              {/* Register Link */}
              <div className="text-muted-foreground text-center text-sm">
                ¿No tienes una cuenta?{' '}
                <Link
                  href="/register"
                  className="text-primary font-medium hover:underline focus:underline focus:outline-none"
                >
                  Regístrate aquí
                </Link>
              </div>

              {/* Demo Credentials (Development Only) */}
              {process.env.NODE_ENV === 'development' && (
                <div className="text-muted-foreground bg-muted rounded-md p-3 text-xs">
                  <p className="mb-1 font-medium">Credenciales de prueba:</p>
                  <p>Email: usuario@ejemplo.com</p>
                  <p>Contraseña: password123</p>
                </div>
              )}
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  )
}
