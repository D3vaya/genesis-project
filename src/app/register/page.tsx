/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @fileoverview Register page component with comprehensive form validation and user registration
 * @description Provides user registration functionality with react-hook-form, Zod validation, and shadcn/ui components
 * @author Generated SaaS Template
 * @version 1.0.0
 */

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  Loader2,
  UserPlus,
  CheckCircle,
  XCircle,
} from "lucide-react";

import { Button } from "@/modules/shared/components/ui/button";
import { Input } from "@/modules/shared/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/modules/shared/components/ui/card";
import { Alert, AlertDescription } from "@/modules/shared/components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/modules/shared/components/ui/form";

import { useAuthStore } from "@/modules/shared/stores/authStore";
import { toast } from "sonner";
import { internalApi } from "@/lib/axios";
import { registerSchema, type RegisterFormData } from "@/lib/validations";

/**
 * Password strength indicator interface
 * @interface PasswordStrength
 * @description Defines the structure for password strength validation
 * @property {boolean} hasMinLength - Whether password meets minimum length requirement
 * @property {boolean} hasLetter - Whether password contains at least one letter
 * @property {boolean} hasNumber - Whether password contains at least one number
 * @property {number} score - Overall password strength score (0-3)
 */
interface PasswordStrength {
  hasMinLength: boolean;
  hasLetter: boolean;
  hasNumber: boolean;
  score: number;
}

/**
 * Register Page Component
 * @component
 * @description Main registration page component with comprehensive form validation and user registration
 * @returns {React.JSX.Element} Registration page with form, validation, password strength indicator, and error handling
 * @example
 * ```typescript
 * // This component is automatically rendered at /register route
 * // Users can create a new account with validated email, name, and password
 * // Includes real-time password strength validation and comprehensive error handling
 * ```
 */
export default function RegisterPage(): React.JSX.Element {
  const router = useRouter();
  const { isAuthenticated, login } = useAuthStore();

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    hasMinLength: false,
    hasLetter: false,
    hasNumber: false,
    score: 0,
  });

  /**
   * React Hook Form setup with Zod validation
   * @description Configures form handling with automatic validation using Zod schema
   */
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange", // Validate on change for better UX
  });

  /**
   * Watch password field for strength validation
   * @description Monitors password changes to update strength indicator in real-time
   */
  const watchedPassword = form.watch("password");

  /**
   * Redirect authenticated users
   * @description Automatically redirects authenticated users to dashboard
   */
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  /**
   * Update password strength when password changes
   * @description Calculates and updates password strength indicators
   */
  useEffect(() => {
    if (watchedPassword) {
      const strength = calculatePasswordStrength(watchedPassword);
      setPasswordStrength(strength);
    } else {
      setPasswordStrength({
        hasMinLength: false,
        hasLetter: false,
        hasNumber: false,
        score: 0,
      });
    }
  }, [watchedPassword]);

  /**
   * Calculate password strength
   * @function calculatePasswordStrength
   * @description Analyzes password and returns strength indicators
   * @param {string} password - Password to analyze
   * @returns {PasswordStrength} Password strength object with various indicators
   * @example
   * ```typescript
   * const strength = calculatePasswordStrength('password123')
   * // Returns: { hasMinLength: true, hasLetter: true, hasNumber: true, score: 3 }
   * ```
   */
  const calculatePasswordStrength = (password: string): PasswordStrength => {
    const hasMinLength = password.length >= 8;
    const hasLetter = /[A-Za-z]/.test(password);
    const hasNumber = /\d/.test(password);

    let score = 0;
    if (hasMinLength) score++;
    if (hasLetter) score++;
    if (hasNumber) score++;

    return {
      hasMinLength,
      hasLetter,
      hasNumber,
      score,
    };
  };

  /**
   * Get password strength color class
   * @function getPasswordStrengthColor
   * @description Returns appropriate color class based on password strength score
   * @param {number} score - Password strength score (0-3)
   * @returns {string} CSS class name for password strength color
   * @example
   * ```typescript
   * const colorClass = getPasswordStrengthColor(3) // Returns 'text-green-600'
   * ```
   */
  const getPasswordStrengthColor = (score: number): string => {
    switch (score) {
      case 0:
      case 1:
        return "text-red-600";
      case 2:
        return "text-yellow-600";
      case 3:
        return "text-green-600";
      default:
        return "text-gray-400";
    }
  };

  /**
   * Get password strength label
   * @function getPasswordStrengthLabel
   * @description Returns appropriate label based on password strength score
   * @param {number} score - Password strength score (0-3)
   * @returns {string} Human-readable password strength label
   * @example
   * ```typescript
   * const label = getPasswordStrengthLabel(3) // Returns 'Fuerte'
   * ```
   */
  const getPasswordStrengthLabel = (score: number): string => {
    switch (score) {
      case 0:
      case 1:
        return "Débil";
      case 2:
        return "Media";
      case 3:
        return "Fuerte";
      default:
        return "";
    }
  };

  /**
   * Form submission handler
   * @function onSubmit
   * @description Handles registration form submission with comprehensive error handling
   * @param {RegisterFormData} data - Validated form data from react-hook-form
   * @returns {Promise<void>} Promise that resolves when registration attempt is complete
   * @example
   * ```typescript
   * // This function is called automatically when form is submitted
   * // It validates data, attempts registration, and handles success/error states
   * const formData: RegisterFormData = {
   *   name: 'Juan Pérez',
   *   email: 'juan@example.com',
   *   password: 'password123',
   *   confirmPassword: 'password123'
   * }
   * await onSubmit(formData)
   * ```
   */
  const onSubmit = async (data: RegisterFormData): Promise<void> => {
    setIsSubmitting(true);

    try {
      // Remove confirmPassword from the data sent to API
      const { confirmPassword, ...registrationData } = data;

      // Call registration API
      const response = await internalApi<{
        message: string;
        user: {
          id: string;
          name: string;
          email: string;
        };
      }>("POST", "/api/auth/register", registrationData);

      // Show success notification
      toast.success("¡Registro Exitoso!", {
        description: response.message,
      });

      // Automatically log in the user
      const loginSuccess = await login(data.email, data.password);

      if (loginSuccess) {
        toast.success("¡Bienvenido!", {
          description: `¡Hola ${response.user.name}! Tu cuenta ha sido creada exitosamente.`,
        });

        // Redirect to dashboard will be handled by useEffect when isAuthenticated changes
      } else {
        // Registration succeeded but login failed, redirect to login page
        toast.info("Registro Completado", {
          description: "Tu cuenta fue creada. Por favor, inicia sesión.",
        });

        router.push("/login");
      }
    } catch (error: any) {
      console.error("Registration error:", error);

      let errorMessage = "Ocurrió un error inesperado durante el registro";

      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      // Handle specific error cases
      if (error?.response?.status === 409) {
        errorMessage =
          "Ya existe un usuario con este email. ¿Quieres iniciar sesión?";
      }

      toast.error("Error de Registro", {
        description: errorMessage,
      });

      // If email already exists, focus on email field
      if (error?.response?.status === 409) {
        form.setFocus("email");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

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
    setShowPassword(!showPassword);
  };

  /**
   * Toggle confirm password visibility
   * @function toggleConfirmPasswordVisibility
   * @description Toggles between showing and hiding the confirm password field
   * @example
   * ```typescript
   * toggleConfirmPasswordVisibility() // Switches confirm password field visibility
   * ```
   */
  const toggleConfirmPasswordVisibility = (): void => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  /**
   * Get form field error message
   * @function getFieldError
   * @description Helper function to get error message for a specific form field
   * @param {keyof RegisterFormData} fieldName - Name of the form field
   * @returns {string | undefined} Error message if field has error, undefined otherwise
   */
  const getFieldError = (
    fieldName: keyof RegisterFormData
  ): string | undefined => {
    return form.formState.errors[fieldName]?.message;
  };

  /**
   * Check if form is valid and can be submitted
   * @function canSubmit
   * @description Determines if the form can be submitted based on validation state
   * @returns {boolean} True if form can be submitted, false otherwise
   */
  const canSubmit = (): boolean => {
    return (
      form.formState.isValid && !isSubmitting && passwordStrength.score >= 2
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <UserPlus className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            Crear Cuenta
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Completa el formulario para crear tu nueva cuenta
          </CardDescription>
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <CardContent className="space-y-4">
              {/* Name Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="name">Nombre Completo</FormLabel>
                    <FormControl>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Tu nombre completo"
                        autoComplete="name"
                        disabled={isSubmitting}
                        className={
                          getFieldError("name") ? "border-destructive" : ""
                        }
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                        disabled={isSubmitting}
                        className={
                          getFieldError("email") ? "border-destructive" : ""
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
                          type={showPassword ? "text" : "password"}
                          placeholder="Tu contraseña"
                          autoComplete="new-password"
                          disabled={isSubmitting}
                          className={`pr-10 ${
                            getFieldError("password")
                              ? "border-destructive"
                              : ""
                          }`}
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          disabled={isSubmitting}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none focus:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label={
                            showPassword
                              ? "Ocultar contraseña"
                              : "Mostrar contraseña"
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

                    {/* Password Strength Indicator */}
                    {watchedPassword && (
                      <div className="space-y-2 mt-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-muted-foreground">
                            Fortaleza:
                          </span>
                          <span
                            className={`text-sm font-medium ${getPasswordStrengthColor(
                              passwordStrength.score
                            )}`}
                          >
                            {getPasswordStrengthLabel(passwordStrength.score)}
                          </span>
                        </div>

                        <div className="space-y-1 text-xs">
                          <div
                            className={`flex items-center space-x-1 ${
                              passwordStrength.hasMinLength
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {passwordStrength.hasMinLength ? (
                              <CheckCircle className="h-3 w-3" />
                            ) : (
                              <XCircle className="h-3 w-3" />
                            )}
                            <span>Al menos 8 caracteres</span>
                          </div>

                          <div
                            className={`flex items-center space-x-1 ${
                              passwordStrength.hasLetter
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {passwordStrength.hasLetter ? (
                              <CheckCircle className="h-3 w-3" />
                            ) : (
                              <XCircle className="h-3 w-3" />
                            )}
                            <span>Al menos una letra</span>
                          </div>

                          <div
                            className={`flex items-center space-x-1 ${
                              passwordStrength.hasNumber
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {passwordStrength.hasNumber ? (
                              <CheckCircle className="h-3 w-3" />
                            ) : (
                              <XCircle className="h-3 w-3" />
                            )}
                            <span>Al menos un número</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </FormItem>
                )}
              />

              {/* Confirm Password Field */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="confirmPassword">
                      Confirmar Contraseña
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirma tu contraseña"
                          autoComplete="new-password"
                          disabled={isSubmitting}
                          className={`pr-10 ${
                            getFieldError("confirmPassword")
                              ? "border-destructive"
                              : ""
                          }`}
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={toggleConfirmPasswordVisibility}
                          disabled={isSubmitting}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none focus:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label={
                            showConfirmPassword
                              ? "Ocultar contraseña"
                              : "Mostrar contraseña"
                          }
                        >
                          {showConfirmPassword ? (
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
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creando cuenta...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Crear Cuenta
                  </>
                )}
              </Button>

              {/* Password strength requirement notice */}
              {passwordStrength.score < 2 && watchedPassword && (
                <Alert className="mt-4">
                  <AlertDescription className="text-sm">
                    Por favor, asegúrate de que tu contraseña sea lo
                    suficientemente fuerte antes de continuar.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              {/* Login Link */}
              <div className="text-center text-sm text-muted-foreground">
                ¿Ya tienes una cuenta?{" "}
                <Link
                  href="/login"
                  className="font-medium text-primary hover:underline focus:outline-none focus:underline"
                >
                  Inicia sesión aquí
                </Link>
              </div>

              {/* Terms of Service (placeholder) */}
              <div className="text-xs text-muted-foreground text-center">
                Al crear una cuenta, aceptas nuestros{" "}
                <Link href="/terms" className="underline hover:text-foreground">
                  Términos de Servicio
                </Link>{" "}
                y{" "}
                <Link
                  href="/privacy"
                  className="underline hover:text-foreground"
                >
                  Política de Privacidad
                </Link>
              </div>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
