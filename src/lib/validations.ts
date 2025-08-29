/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @fileoverview Zod validation schemas for form validation and data validation
 * @description Provides comprehensive validation schemas for user authentication, profile management, and API data
 * @author Generated SaaS Template
 * @version 1.0.0
 */

import { z } from "zod";

/**
 * Login form validation schema
 * @description Validates user login credentials with email and password requirements
 * @const {z.ZodObject} loginSchema
 * @example
 * ```typescript
 * import { loginSchema } from '@/lib/validations'
 *
 * const result = loginSchema.safeParse({
 *   email: 'user@example.com',
 *   password: 'password123'
 * })
 *
 * if (result.success) {
 *   console.log('Valid login data:', result.data)
 * } else {
 *   console.error('Validation errors:', result.error.format())
 * }
 * ```
 */
export const loginSchema = z.object({
  /**
   * @description User's email address
   * @type {string}
   * @validation Must be a valid email format
   */
  email: z
    .string({
      message: "El email es requerido",
    })
    .min(1, "El email es requerido")
    .email("Por favor, ingresa un email válido")
    .max(255, "El email no puede exceder 255 caracteres")
    .toLowerCase()
    .trim(),

  /**
   * @description User's password
   * @type {string}
   * @validation Minimum 6 characters, maximum 100 characters
   */
  password: z
    .string({
      message: "La contraseña es requerida",
    })
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .max(100, "La contraseña no puede exceder 100 caracteres"),
});

/**
 * Registration form validation schema
 * @description Validates user registration data including password confirmation
 * @const {z.ZodObject} registerSchema
 * @example
 * ```typescript
 * import { registerSchema } from '@/lib/validations'
 *
 * const result = registerSchema.safeParse({
 *   name: 'Juan Pérez',
 *   email: 'juan@example.com',
 *   password: 'password123',
 *   confirmPassword: 'password123'
 * })
 *
 * if (result.success) {
 *   const { confirmPassword, ...userData } = result.data
 *   // Use userData for registration
 * }
 * ```
 */
export const registerSchema = z
  .object({
    /**
     * @description User's full name
     * @type {string}
     * @validation 2-50 characters, letters and spaces only
     */
    name: z
      .string({
        message: "El nombre es requerido",
      })
      .min(2, "El nombre debe tener al menos 2 caracteres")
      .max(50, "El nombre no puede exceder 50 caracteres")
      .regex(
        /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/,
        "El nombre solo puede contener letras y espacios"
      )
      .trim(),

    /**
     * @description User's email address
     * @type {string}
     * @validation Must be a valid email format
     */
    email: z
      .string({
        message: "El email es requerido",
      })
      .min(1, "El email es requerido")
      .email("Por favor, ingresa un email válido")
      .max(255, "El email no puede exceder 255 caracteres")
      .toLowerCase()
      .trim(),

    /**
     * @description User's password
     * @type {string}
     * @validation Minimum 8 characters, at least one letter and one number
     */
    password: z
      .string({
        message: "La contraseña es requerida",
      })
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .max(100, "La contraseña no puede exceder 100 caracteres")
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)/,
        "La contraseña debe contener al menos una letra y un número"
      ),

    /**
     * @description Password confirmation
     * @type {string}
     * @validation Must match the password field
     */
    confirmPassword: z
      .string({
        message: "La confirmación de contraseña es requerida",
      })
      .min(1, "La confirmación de contraseña es requerida"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

/**
 * User profile update validation schema
 * @description Validates user profile updates with optional fields
 * @const {z.ZodObject} userProfileSchema
 * @example
 * ```typescript
 * import { userProfileSchema } from '@/lib/validations'
 *
 * const result = userProfileSchema.safeParse({
 *   name: 'Juan Pérez Updated',
 *   email: 'juan.updated@example.com',
 *   image: 'https://example.com/profile.jpg'
 * })
 *
 * if (result.success) {
 *   // Update user profile with validated data
 * }
 * ```
 */
export const userProfileSchema = z.object({
  /**
   * @description User's full name (optional)
   * @type {string | undefined}
   * @validation 2-50 characters if provided, letters and spaces only
   */
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede exceder 50 caracteres")
    .regex(
      /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/,
      "El nombre solo puede contener letras y espacios"
    )
    .trim()
    .optional(),

  /**
   * @description User's email address (optional)
   * @type {string | undefined}
   * @validation Must be a valid email format if provided
   */
  email: z
    .string()
    .email("Por favor, ingresa un email válido")
    .max(255, "El email no puede exceder 255 caracteres")
    .toLowerCase()
    .trim()
    .optional(),

  /**
   * @description User's profile image URL (optional)
   * @type {string | undefined}
   * @validation Must be a valid URL if provided
   */
  image: z
    .string()
    .url("Por favor, ingresa una URL válida para la imagen")
    .max(500, "La URL de la imagen no puede exceder 500 caracteres")
    .optional(),
});

/**
 * Password change validation schema
 * @description Validates password change requests with current and new password
 * @const {z.ZodObject} passwordChangeSchema
 * @example
 * ```typescript
 * import { passwordChangeSchema } from '@/lib/validations'
 *
 * const result = passwordChangeSchema.safeParse({
 *   currentPassword: 'oldpassword123',
 *   newPassword: 'newpassword456',
 *   confirmNewPassword: 'newpassword456'
 * })
 * ```
 */
export const passwordChangeSchema = z
  .object({
    /**
     * @description User's current password
     * @type {string}
     * @validation Required for verification
     */
    currentPassword: z
      .string({
        message: "La contraseña actual es requerida",
      })
      .min(1, "La contraseña actual es requerida"),

    /**
     * @description User's new password
     * @type {string}
     * @validation Minimum 8 characters, at least one letter and one number
     */
    newPassword: z
      .string({
        message: "La nueva contraseña es requerida",
      })
      .min(8, "La nueva contraseña debe tener al menos 8 caracteres")
      .max(100, "La nueva contraseña no puede exceder 100 caracteres")
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)/,
        "La nueva contraseña debe contener al menos una letra y un número"
      ),

    /**
     * @description New password confirmation
     * @type {string}
     * @validation Must match the new password field
     */
    confirmNewPassword: z
      .string({
        message: "La confirmación de la nueva contraseña es requerida",
      })
      .min(1, "La confirmación de la nueva contraseña es requerida"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Las nuevas contraseñas no coinciden",
    path: ["confirmNewPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "La nueva contraseña debe ser diferente a la actual",
    path: ["newPassword"],
  });

/**
 * API response validation schema
 * @description Generic schema for validating API responses
 * @const {z.ZodFunction} apiResponseSchema
 * @template T - Type of the response data
 * @param {z.ZodType<T>} dataSchema - Schema for validating the response data
 * @returns {z.ZodObject} Complete API response schema
 * @example
 * ```typescript
 * import { apiResponseSchema } from '@/lib/validations'
 *
 * const userApiResponse = apiResponseSchema(z.object({
 *   id: z.string(),
 *   name: z.string(),
 *   email: z.string().email()
 * }))
 *
 * const result = userApiResponse.safeParse(apiResponse)
 * ```
 */
export const apiResponseSchema = <T>(dataSchema: z.ZodType<T>) =>
  z.object({
    /**
     * @description Response data payload
     * @type {T}
     * @validation Validates against provided data schema
     */
    data: dataSchema,

    /**
     * @description Response message
     * @type {string}
     * @validation Required string message
     */
    message: z.string({
      message: "El mensaje de respuesta es requerido",
    }),

    /**
     * @description Success status
     * @type {boolean}
     * @validation Boolean indicating request success
     */
    success: z.boolean({
      message: "El estado de éxito es requerido",
    }),

    /**
     * @description Response timestamp (optional)
     * @type {number | undefined}
     * @validation Unix timestamp if provided
     */
    timestamp: z.number().optional(),
  });

/**
 * User entity validation schema
 * @description Validates complete user objects from database or API
 * @const {z.ZodObject} userSchema
 * @example
 * ```typescript
 * import { userSchema } from '@/lib/validations'
 *
 * const result = userSchema.safeParse(userData)
 * if (result.success) {
 *   // userData is a valid User object
 * }
 * ```
 */
export const userSchema = z.object({
  /**
   * @description User's unique identifier
   * @type {string}
   * @validation Required string ID
   */
  id: z.string({
    message: "El ID del usuario es requerido",
  }),

  /**
   * @description User's email address
   * @type {string}
   * @validation Must be a valid email format
   */
  email: z
    .string({
      message: "El email es requerido",
    })
    .email("Email inválido"),

  /**
   * @description User's display name (optional)
   * @type {string | null}
   * @validation 2-50 characters if provided
   */
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede exceder 50 caracteres")
    .nullable()
    .optional(),

  /**
   * @description User's profile image URL (optional)
   * @type {string | null}
   * @validation Must be a valid URL if provided
   */
  image: z.string().url("URL de imagen inválida").nullable().optional(),

  /**
   * @description User creation timestamp (optional)
   * @type {Date | undefined}
   * @validation Valid date if provided
   */
  createdAt: z.date().optional(),

  /**
   * @description User last update timestamp (optional)
   * @type {Date | undefined}
   * @validation Valid date if provided
   */
  updatedAt: z.date().optional(),
});

/**
 * Environment variables validation schema
 * @description Validates required environment variables for the application
 * @const {z.ZodObject} envSchema
 * @example
 * ```typescript
 * import { envSchema } from '@/lib/validations'
 *
 * const env = envSchema.parse(process.env)
 * // env is now type-safe and validated
 * ```
 */
export const envSchema = z.object({
  /**
   * @description Database connection URL
   * @type {string}
   * @validation Required database URL
   */
  DATABASE_URL: z.string({
    message: "DATABASE_URL es requerida",
  }),

  /**
   * @description NextAuth secret key
   * @type {string}
   * @validation Required secret for JWT signing
   */
  NEXTAUTH_SECRET: z.string({
    message: "NEXTAUTH_SECRET es requerida",
  }),

  /**
   * @description NextAuth URL
   * @type {string}
   * @validation Must be a valid URL
   */
  NEXTAUTH_URL: z
    .string()
    .url("NEXTAUTH_URL debe ser una URL válida")
    .optional(),

  /**
   * @description API base URL for external API calls
   * @type {string}
   * @validation Must be a valid URL if provided
   */
  API_BASE_URL: z
    .string()
    .url("API_BASE_URL debe ser una URL válida")
    .optional(),
});

/**
 * Type inference helpers for TypeScript
 * @description Export inferred types from Zod schemas for use throughout the application
 */

/**
 * Inferred type for login form data
 * @type {z.infer<typeof loginSchema>}
 * @description TypeScript type inferred from loginSchema
 * @example
 * ```typescript
 * import type { LoginFormData } from '@/lib/validations'
 *
 * const handleLogin = (data: LoginFormData) => {
 *   // data.email and data.password are type-safe
 * }
 * ```
 */
export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Inferred type for registration form data
 * @type {z.infer<typeof registerSchema>}
 * @description TypeScript type inferred from registerSchema
 * @example
 * ```typescript
 * import type { RegisterFormData } from '@/lib/validations'
 *
 * const handleRegister = (data: RegisterFormData) => {
 *   // data includes name, email, password, confirmPassword
 * }
 * ```
 */
export type RegisterFormData = z.infer<typeof registerSchema>;

/**
 * Inferred type for user profile updates
 * @type {z.infer<typeof userProfileSchema>}
 * @description TypeScript type inferred from userProfileSchema
 * @example
 * ```typescript
 * import type { UserProfileData } from '@/lib/validations'
 *
 * const updateProfile = (data: UserProfileData) => {
 *   // data includes optional name, email, image
 * }
 * ```
 */
export type UserProfileData = z.infer<typeof userProfileSchema>;

/**
 * Inferred type for password change data
 * @type {z.infer<typeof passwordChangeSchema>}
 * @description TypeScript type inferred from passwordChangeSchema
 */
export type PasswordChangeData = z.infer<typeof passwordChangeSchema>;

/**
 * Inferred type for user entity
 * @type {z.infer<typeof userSchema>}
 * @description TypeScript type inferred from userSchema
 * @example
 * ```typescript
 * import type { User } from '@/lib/validations'
 *
 * const displayUser = (user: User) => {
 *   console.log(`User: ${user.name} (${user.email})`)
 * }
 * ```
 */
export type User = z.infer<typeof userSchema>;

/**
 * Inferred type for environment variables
 * @type {z.infer<typeof envSchema>}
 * @description TypeScript type inferred from envSchema
 */
export type Env = z.infer<typeof envSchema>;

/**
 * Validation helper functions
 * @description Utility functions for common validation tasks
 */

/**
 * Validates email format
 * @function validateEmail
 * @description Checks if a string is a valid email address
 * @param {string} email - Email string to validate
 * @returns {boolean} True if email is valid, false otherwise
 * @example
 * ```typescript
 * import { validateEmail } from '@/lib/validations'
 *
 * const isValid = validateEmail('user@example.com') // true
 * const isInvalid = validateEmail('invalid-email') // false
 * ```
 */
export const validateEmail = (email: string): boolean => {
  return z.string().email().safeParse(email).success;
};

/**
 * Validates password strength
 * @function validatePassword
 * @description Checks if a password meets security requirements
 * @param {string} password - Password string to validate
 * @returns {boolean} True if password is valid, false otherwise
 * @example
 * ```typescript
 * import { validatePassword } from '@/lib/validations'
 *
 * const isStrong = validatePassword('password123') // true
 * const isWeak = validatePassword('weak') // false
 * ```
 */
export const validatePassword = (password: string): boolean => {
  return registerSchema.shape.password.safeParse(password).success;
};

/**
 * Formats validation errors for display
 * @function formatValidationErrors
 * @description Converts Zod validation errors into user-friendly messages
 * @param {z.ZodError} error - Zod validation error object
 * @returns {Record<string, string>} Object with field names as keys and error messages as values
 * @example
 * ```typescript
 * import { formatValidationErrors } from '@/lib/validations'
 *
 * try {
 *   loginSchema.parse(invalidData)
 * } catch (error) {
 *   const errors = formatValidationErrors(error as z.ZodError)
 *   // errors: { email: 'Por favor, ingresa un email válido' }
 * }
 * ```
 */
export const formatValidationErrors = (
  error: z.ZodError
): Record<string, string> => {
  const formattedErrors: Record<string, string> = {};

  error.issues.forEach((err: any) => {
    if (err.path.length > 0) {
      const fieldName = err.path[0].toString();
      formattedErrors[fieldName] = err.message;
    }
  });

  return formattedErrors;
};
