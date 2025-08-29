import { z } from 'zod'

export const paginationSchema = z.object({
  page: z
    .string()
    .optional()
    .default('1')
    .transform(val => Math.max(1, parseInt(val) || 1)),
  limit: z
    .string()
    .optional()
    .default('10')
    .transform(val => Math.min(100, Math.max(1, parseInt(val) || 10))),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
})

export const idParamSchema = z.object({
  id: z.string().min(1, 'ID es requerido'),
})

export const emailParamSchema = z.object({
  email: z.string().email('Email inválido'),
})

export const userUpdateApiSchema = z.object({
  name: z
    .string()
    .min(2, 'Nombre debe tener al menos 2 caracteres')
    .max(50)
    .optional(),
  email: z.string().email('Email inválido').max(255).optional(),
  image: z.string().url('URL de imagen inválida').max(500).optional(),
})

export const userCreateApiSchema = z.object({
  name: z.string().min(2, 'Nombre debe tener al menos 2 caracteres').max(50),
  email: z.string().email('Email inválido').max(255),
  password: z
    .string()
    .min(8, 'Contraseña debe tener al menos 8 caracteres')
    .max(100),
})

export const changePasswordApiSchema = z.object({
  currentPassword: z.string().min(1, 'Contraseña actual requerida'),
  newPassword: z
    .string()
    .min(8, 'Nueva contraseña debe tener al menos 8 caracteres')
    .max(100)
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d)/,
      'Debe contener al menos una letra y un número'
    ),
})

export const forgotPasswordSchema = z.object({
  email: z.string().email('Email inválido').max(255),
})

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token requerido'),
  password: z
    .string()
    .min(8, 'Contraseña debe tener al menos 8 caracteres')
    .max(100)
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d)/,
      'Debe contener al menos una letra y un número'
    ),
})

export const uploadFileSchema = z.object({
  file: z.instanceof(File, { message: 'Archivo requerido' }),
  maxSize: z
    .number()
    .optional()
    .default(5 * 1024 * 1024), // 5MB default
  allowedTypes: z
    .array(z.string())
    .optional()
    .default(['image/jpeg', 'image/png', 'image/webp']),
})

export type PaginationParams = z.infer<typeof paginationSchema>
export type IdParam = z.infer<typeof idParamSchema>
export type EmailParam = z.infer<typeof emailParamSchema>
export type UserUpdateApi = z.infer<typeof userUpdateApiSchema>
export type UserCreateApi = z.infer<typeof userCreateApiSchema>
export type ChangePasswordApi = z.infer<typeof changePasswordApiSchema>
export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordData = z.infer<typeof resetPasswordSchema>
export type UploadFileData = z.infer<typeof uploadFileSchema>
