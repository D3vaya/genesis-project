/**
 * @fileoverview User service layer for database operations using Prisma
 * @description Provides comprehensive user management functions using Prisma ORM with full error handling and validation
 * @author Generated SaaS Template
 * @version 1.0.0
 */

import { hash, compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import {
  userSchema,
  type User,
  type RegisterFormData,
  type UserProfileData,
} from "@/lib/validations";

/**
 * User service error class
 * @class UserServiceError
 * @description Custom error class for user service operations
 * @extends Error
 * @property {string} code - Error code for programmatic handling
 * @property {string} field - Field related to the error (optional)
 */
export class UserServiceError extends Error {
  constructor(message: string, public code: string, public field?: string) {
    super(message);
    this.name = "UserServiceError";
  }
}

/**
 * User creation result interface
 * @interface CreateUserResult
 * @description Result object for user creation operations
 * @property {User} user - Created user object
 * @property {boolean} success - Whether the operation was successful
 * @property {string} message - Success message
 */
interface CreateUserResult {
  user: User;
  success: boolean;
  message: string;
}

/**
 * User update result interface
 * @interface UpdateUserResult
 * @description Result object for user update operations
 * @property {User} user - Updated user object
 * @property {boolean} success - Whether the operation was successful
 * @property {string} message - Success message
 * @property {string[]} updatedFields - List of fields that were updated
 */
interface UpdateUserResult {
  user: User;
  success: boolean;
  message: string;
  updatedFields: string[];
}

/**
 * User deletion result interface
 * @interface DeleteUserResult
 * @description Result object for user deletion operations
 * @property {boolean} success - Whether the operation was successful
 * @property {string} message - Success message
 * @property {string} deletedUserId - ID of the deleted user
 */
interface DeleteUserResult {
  success: boolean;
  message: string;
  deletedUserId: string;
}

/**
 * User query options interface
 * @interface UserQueryOptions
 * @description Options for user query operations
 * @property {number} limit - Maximum number of users to return
 * @property {number} offset - Number of users to skip
 * @property {string} orderBy - Field to order by
 * @property {string} orderDir - Order direction ('asc' or 'desc')
 * @property {boolean} includeDeleted - Whether to include soft-deleted users
 */
interface UserQueryOptions {
  limit?: number;
  offset?: number;
  orderBy?: "name" | "email" | "createdAt" | "updatedAt";
  orderDir?: "asc" | "desc";
  includeDeleted?: boolean;
}

/**
 * User service class with comprehensive user management operations
 * @class UserService
 * @description Provides all user-related database operations using Prisma ORM
 * @example
 * ```typescript
 * import { userService } from '@/services/userService'
 *
 * // Create a new user
 * const result = await userService.createUser({
 *   name: 'John Doe',
 *   email: 'john@example.com',
 *   password: 'password123'
 * })
 *
 * // Get user by email
 * const user = await userService.getUserByEmail('john@example.com')
 *
 * // Update user profile
 * const updateResult = await userService.updateUserProfile(user.id, {
 *   name: 'John Updated'
 * })
 * ```
 */
class UserService {
  /**
   * Create a new user account
   * @function createUser
   * @description Creates a new user with hashed password and validates input data
   * @param {RegisterFormData} userData - User registration data
   * @returns {Promise<CreateUserResult>} Promise resolving to creation result
   * @throws {UserServiceError} Throws error for validation or database issues
   * @example
   * ```typescript
   * const result = await userService.createUser({
   *   name: 'Jane Doe',
   *   email: 'jane@example.com',
   *   password: 'securepassword123',
   *   confirmPassword: 'securepassword123'
   * })
   *
   * if (result.success) {
   *   console.log('User created:', result.user)
   * }
   * ```
   */
  async createUser(
    userData: Omit<RegisterFormData, "confirmPassword">
  ): Promise<CreateUserResult> {
    try {
      // Check if user already exists
      const existingUser = await this.getUserByEmail(userData.email);
      if (existingUser) {
        throw new UserServiceError(
          "Un usuario con este email ya existe",
          "USER_ALREADY_EXISTS",
          "email"
        );
      }

      // Hash password
      const hashedPassword = await hash(userData.password, 12);

      // Create user in database
      const createdUser = await prisma.user.create({
        data: {
          name: userData.name,
          email: userData.email.toLowerCase(),
          password: hashedPassword,
        },
        select: {
          id: true,
          email: true,
          name: true,
          image: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      // Validate created user against schema
      const validatedUser = userSchema.parse(createdUser);

      return {
        user: validatedUser,
        success: true,
        message: "Usuario creado exitosamente",
      };
    } catch (error) {
      console.error("Error creating user:", error);

      if (error instanceof UserServiceError) {
        throw error;
      }

      if (error instanceof Error) {
        if (error.message.includes("Unique constraint")) {
          throw new UserServiceError(
            "Un usuario con este email ya existe",
            "USER_ALREADY_EXISTS",
            "email"
          );
        }
      }

      throw new UserServiceError(
        "Error interno al crear el usuario",
        "INTERNAL_ERROR"
      );
    }
  }

  /**
   * Get user by email address
   * @function getUserByEmail
   * @description Retrieves user by email with optional password inclusion
   * @param {string} email - User's email address
   * @param {boolean} includePassword - Whether to include password in result
   * @returns {Promise<User | null>} Promise resolving to user object or null
   * @throws {UserServiceError} Throws error for database issues
   * @example
   * ```typescript
   * const user = await userService.getUserByEmail('user@example.com')
   * if (user) {
   *   console.log('User found:', user.name)
   * } else {
   *   console.log('User not found')
   * }
   *
   * // Include password for authentication
   * const userWithPassword = await userService.getUserByEmail(
   *   'user@example.com',
   *   true
   * )
   * ```
   */
  async getUserByEmail(
    email: string,
    includePassword: boolean = false
  ): Promise<(User & { password?: string }) | null> {
    try {
      const user = await prisma.user.findUnique({
        where: {
          email: email.toLowerCase(),
        },
        select: {
          id: true,
          email: true,
          name: true,
          image: true,
          createdAt: true,
          updatedAt: true,
          password: includePassword,
        },
      });

      return user;
    } catch (error) {
      console.error("Error getting user by email:", error);
      throw new UserServiceError(
        "Error al buscar usuario por email",
        "DATABASE_ERROR"
      );
    }
  }

  /**
   * Get user by ID
   * @function getUserById
   * @description Retrieves user by unique ID
   * @param {string} id - User's unique identifier
   * @returns {Promise<User | null>} Promise resolving to user object or null
   * @throws {UserServiceError} Throws error for database issues
   * @example
   * ```typescript
   * const user = await userService.getUserById('user-id-123')
   * if (user) {
   *   console.log('User profile:', user)
   * }
   * ```
   */
  async getUserById(id: string): Promise<User | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          name: true,
          image: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return user;
    } catch (error) {
      console.error("Error getting user by ID:", error);
      throw new UserServiceError(
        "Error al buscar usuario por ID",
        "DATABASE_ERROR"
      );
    }
  }

  /**
   * Get all users with optional filtering and pagination
   * @function getAllUsers
   * @description Retrieves all users with optional query parameters
   * @param {UserQueryOptions} options - Query options for filtering and pagination
   * @returns {Promise<User[]>} Promise resolving to array of users
   * @throws {UserServiceError} Throws error for database issues
   * @example
   * ```typescript
   * // Get first 10 users ordered by creation date
   * const users = await userService.getAllUsers({
   *   limit: 10,
   *   offset: 0,
   *   orderBy: 'createdAt',
   *   orderDir: 'desc'
   * })
   *
   * console.log(`Found ${users.length} users`)
   * ```
   */
  async getAllUsers(options: UserQueryOptions = {}): Promise<User[]> {
    try {
      const {
        limit = 50,
        offset = 0,
        orderBy = "createdAt",
        orderDir = "desc",
      } = options;

      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          image: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          [orderBy]: orderDir,
        },
        take: limit,
        skip: offset,
      });

      return users;
    } catch (error) {
      console.error("Error getting all users:", error);
      throw new UserServiceError("Error al obtener usuarios", "DATABASE_ERROR");
    }
  }

  /**
   * Update user profile information
   * @function updateUserProfile
   * @description Updates user profile data with validation
   * @param {string} id - User's unique identifier
   * @param {UserProfileData} profileData - Profile data to update
   * @returns {Promise<UpdateUserResult>} Promise resolving to update result
   * @throws {UserServiceError} Throws error for validation or database issues
   * @example
   * ```typescript
   * const result = await userService.updateUserProfile('user-id', {
   *   name: 'Updated Name',
   *   image: 'https://example.com/new-avatar.jpg'
   * })
   *
   * if (result.success) {
   *   console.log('Updated fields:', result.updatedFields)
   *   console.log('Updated user:', result.user)
   * }
   * ```
   */
  async updateUserProfile(
    id: string,
    profileData: UserProfileData
  ): Promise<UpdateUserResult> {
    try {
      // Check if user exists
      const existingUser = await this.getUserById(id);
      if (!existingUser) {
        throw new UserServiceError("Usuario no encontrado", "USER_NOT_FOUND");
      }

      // Check if email is being updated and if it's unique
      if (profileData.email && profileData.email !== existingUser.email) {
        const emailExists = await this.getUserByEmail(profileData.email);
        if (emailExists) {
          throw new UserServiceError(
            "Este email ya está en uso",
            "EMAIL_ALREADY_EXISTS",
            "email"
          );
        }
      }

      // Prepare update data
      const updateData: Record<string, string | undefined> = {};
      const updatedFields: string[] = [];

      if (
        profileData.name !== undefined &&
        profileData.name !== existingUser.name
      ) {
        updateData.name = profileData.name;
        updatedFields.push("name");
      }

      if (
        profileData.email !== undefined &&
        profileData.email !== existingUser.email
      ) {
        updateData.email = profileData.email.toLowerCase();
        updatedFields.push("email");
      }

      if (
        profileData.image !== undefined &&
        profileData.image !== existingUser.image
      ) {
        updateData.image = profileData.image;
        updatedFields.push("image");
      }

      // Only update if there are changes
      if (updatedFields.length === 0) {
        return {
          user: existingUser,
          success: true,
          message: "No hay cambios para actualizar",
          updatedFields: [],
        };
      }

      // Update user in database
      const updatedUser = await prisma.user.update({
        where: { id },
        data: updateData,
        select: {
          id: true,
          email: true,
          name: true,
          image: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      // Validate updated user against schema
      const validatedUser = userSchema.parse(updatedUser);

      return {
        user: validatedUser,
        success: true,
        message: `Perfil actualizado exitosamente (${updatedFields.join(
          ", "
        )})`,
        updatedFields,
      };
    } catch (error) {
      console.error("Error updating user profile:", error);

      if (error instanceof UserServiceError) {
        throw error;
      }

      if (error instanceof Error) {
        if (error.message.includes("Unique constraint")) {
          throw new UserServiceError(
            "Este email ya está en uso",
            "EMAIL_ALREADY_EXISTS",
            "email"
          );
        }
      }

      throw new UserServiceError(
        "Error interno al actualizar perfil",
        "INTERNAL_ERROR"
      );
    }
  }

  /**
   * Change user password
   * @function changePassword
   * @description Updates user password with current password verification
   * @param {string} id - User's unique identifier
   * @param {string} currentPassword - Current password for verification
   * @param {string} newPassword - New password to set
   * @returns {Promise<boolean>} Promise resolving to success status
   * @throws {UserServiceError} Throws error for validation or database issues
   * @example
   * ```typescript
   * const success = await userService.changePassword(
   *   'user-id',
   *   'currentPassword123',
   *   'newSecurePassword456'
   * )
   *
   * if (success) {
   *   console.log('Password changed successfully')
   * }
   * ```
   */
  async changePassword(
    id: string,
    currentPassword: string,
    newPassword: string
  ): Promise<boolean> {
    try {
      // Get user with password
      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          password: true,
        },
      });

      if (!user) {
        throw new UserServiceError("Usuario no encontrado", "USER_NOT_FOUND");
      }

      // Verify current password
      const isCurrentPasswordValid = await compare(
        currentPassword,
        user.password
      );
      if (!isCurrentPasswordValid) {
        throw new UserServiceError(
          "La contraseña actual es incorrecta",
          "INVALID_CURRENT_PASSWORD",
          "currentPassword"
        );
      }

      // Hash new password
      const hashedNewPassword = await hash(newPassword, 12);

      // Update password in database
      await prisma.user.update({
        where: { id },
        data: {
          password: hashedNewPassword,
        },
      });

      return true;
    } catch (error) {
      console.error("Error changing password:", error);

      if (error instanceof UserServiceError) {
        throw error;
      }

      throw new UserServiceError(
        "Error interno al cambiar contraseña",
        "INTERNAL_ERROR"
      );
    }
  }

  /**
   * Delete user account
   * @function deleteUser
   * @description Permanently deletes user account and all associated data
   * @param {string} id - User's unique identifier
   * @returns {Promise<DeleteUserResult>} Promise resolving to deletion result
   * @throws {UserServiceError} Throws error for database issues
   * @example
   * ```typescript
   * const result = await userService.deleteUser('user-id')
   * if (result.success) {
   *   console.log('User deleted:', result.deletedUserId)
   * }
   * ```
   */
  async deleteUser(id: string): Promise<DeleteUserResult> {
    try {
      // Check if user exists
      const existingUser = await this.getUserById(id);
      if (!existingUser) {
        throw new UserServiceError("Usuario no encontrado", "USER_NOT_FOUND");
      }

      // Delete user (this will cascade delete related records due to Prisma schema)
      await prisma.user.delete({
        where: { id },
      });

      return {
        success: true,
        message: "Usuario eliminado exitosamente",
        deletedUserId: id,
      };
    } catch (error) {
      console.error("Error deleting user:", error);

      if (error instanceof UserServiceError) {
        throw error;
      }

      throw new UserServiceError(
        "Error interno al eliminar usuario",
        "INTERNAL_ERROR"
      );
    }
  }

  /**
   * Verify user credentials for authentication
   * @function verifyCredentials
   * @description Verifies email and password combination for login
   * @param {string} email - User's email address
   * @param {string} password - User's password
   * @returns {Promise<User | null>} Promise resolving to user object if valid, null if invalid
   * @throws {UserServiceError} Throws error for database issues
   * @example
   * ```typescript
   * const user = await userService.verifyCredentials(
   *   'user@example.com',
   *   'password123'
   * )
   *
   * if (user) {
   *   console.log('Authentication successful for:', user.email)
   * } else {
   *   console.log('Invalid credentials')
   * }
   * ```
   */
  async verifyCredentials(
    email: string,
    password: string
  ): Promise<User | null> {
    try {
      // Get user with password
      const user = await this.getUserByEmail(email, true);

      if (!user || !user.password) {
        return null;
      }

      // Verify password
      const isPasswordValid = await compare(password, user.password);

      if (!isPasswordValid) {
        return null;
      }

      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword as User;
    } catch (error) {
      console.error("Error verifying credentials:", error);
      throw new UserServiceError(
        "Error interno al verificar credenciales",
        "INTERNAL_ERROR"
      );
    }
  }

  /**
   * Get user statistics and counts
   * @function getUserStats
   * @description Retrieves various statistics about users
   * @returns {Promise<Object>} Promise resolving to user statistics
   * @throws {UserServiceError} Throws error for database issues
   * @example
   * ```typescript
   * const stats = await userService.getUserStats()
   * console.log('Total users:', stats.totalUsers)
   * console.log('Users created today:', stats.todayUsers)
   * ```
   */
  async getUserStats(): Promise<{
    totalUsers: number;
    todayUsers: number;
    weekUsers: number;
    monthUsers: number;
  }> {
    try {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        now.getDate()
      );

      const [totalUsers, todayUsers, weekUsers, monthUsers] = await Promise.all(
        [
          prisma.user.count(),
          prisma.user.count({
            where: {
              createdAt: {
                gte: today,
              },
            },
          }),
          prisma.user.count({
            where: {
              createdAt: {
                gte: weekAgo,
              },
            },
          }),
          prisma.user.count({
            where: {
              createdAt: {
                gte: monthAgo,
              },
            },
          }),
        ]
      );

      return {
        totalUsers,
        todayUsers,
        weekUsers,
        monthUsers,
      };
    } catch (error) {
      console.error("Error getting user stats:", error);
      throw new UserServiceError(
        "Error al obtener estadísticas de usuarios",
        "DATABASE_ERROR"
      );
    }
  }

  /**
   * Check if email is available for registration
   * @function isEmailAvailable
   * @description Checks if an email address is available for new user registration
   * @param {string} email - Email address to check
   * @returns {Promise<boolean>} Promise resolving to availability status
   * @throws {UserServiceError} Throws error for database issues
   * @example
   * ```typescript
   * const isAvailable = await userService.isEmailAvailable('new@example.com')
   * if (isAvailable) {
   *   console.log('Email is available for registration')
   * } else {
   *   console.log('Email is already taken')
   * }
   * ```
   */
  async isEmailAvailable(email: string): Promise<boolean> {
    try {
      const existingUser = await this.getUserByEmail(email);
      return existingUser === null;
    } catch (error) {
      console.error("Error checking email availability:", error);
      throw new UserServiceError(
        "Error al verificar disponibilidad del email",
        "DATABASE_ERROR"
      );
    }
  }
}

/**
 * Singleton user service instance
 * @const {UserService} userService
 * @description Exported singleton instance of UserService for application use
 * @example
 * ```typescript
 * import { userService } from '@/services/userService'
 *
 * // Use the service instance
 * const user = await userService.getUserByEmail('user@example.com')
 * ```
 */
export const userService = new UserService();

/**
 * Export service class for testing or custom instantiation
 * @export UserService
 * @description Export the UserService class itself for testing purposes
 */
export { UserService };

/**
 * Export all interfaces and types
 * @description Export all type definitions for use in other modules
 */
export type {
  CreateUserResult,
  UpdateUserResult,
  DeleteUserResult,
  UserQueryOptions,
};
