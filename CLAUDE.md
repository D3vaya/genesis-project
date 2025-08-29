# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Commands

### Development

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production with Turbopack
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality

### Database Operations

- `npm run db:generate` - Generate Prisma client
- `npm run db:migrate` - Apply database migrations in development
- `npm run db:seed` - Load test data into database
- `npm run db:studio` - Open Prisma Studio (database GUI)
- `npm run db:reset` - Reset database and reload seed data

## High-Level Architecture

### Framework & Stack

- **Next.js 15** with App Router and Turbopack for fast development
- **TypeScript** for type safety throughout the codebase
- **Prisma ORM** with SQLite (development) - easily switchable to PostgreSQL/MySQL
- **NextAuth.js** for complete authentication system
- **Tailwind CSS 4** + **shadcn/ui** for modern UI components
- **Zustand** for lightweight state management

### Project Structure

```
src/
├── app/                    # Next.js App Router (pages, layouts, API routes)
├── lib/                    # Core configurations (auth, prisma, utils)
├── modules/shared/         # Reusable modules and components
│   ├── components/         # UI components organized by type
│   ├── stores/            # Zustand state management stores
│   ├── hooks/             # Custom React hooks
│   └── config/            # Configuration files
└── middleware.ts          # Next.js middleware for route protection
```

### Authentication Flow

The app uses NextAuth.js with credentials provider:

- Configuration in `src/lib/auth.ts`
- Middleware protection in `src/middleware.ts` with route matching
- Protected routes: `/dashboard/*`, `/admin/*`, `/profile`, `/settings`
- Public routes: `/`, `/login`, `/register`, `/api/auth/*`
- Session stored in JWT with user ID included

### Database Schema

- **User model**: Core user entity with email/password auth
- **NextAuth models**: Account, Session, VerificationToken for OAuth support
- Located in `prisma/schema.prisma` with detailed JSDoc comments
- Generated client outputs to `src/generated/prisma`

### Component Architecture

**DashboardLayout System** (`src/modules/shared/components/layout/`):

- `DashboardLayout` - Main reusable dashboard wrapper
- `AppSidebar` - Configurable sidebar with navigation
- `DashboardHeader` - Header with user menu and actions
- Navigation config in `src/modules/shared/config/navigation.ts`

**UI Components** (`src/modules/shared/components/ui/`):

- Built on shadcn/ui and Radix UI primitives
- Consistent design tokens via CSS variables
- Support for light/dark themes

### State Management

Three main Zustand stores:

- `authStore.ts` - User authentication state
- `uiStore.ts` - UI state (theme, sidebar, notifications)
- `dataStore.ts` - Application data with API integration

Custom hooks provide typed access to stores (`useAuth`, `useUI`, `useData`).

### Middleware & Route Protection

`src/middleware.ts` implements:

- Route-based authentication using NextAuth middleware
- Security headers (CSP, XSS protection, etc.)
- CORS handling for API routes
- Request logging in development

### Key Configuration Files

- `next.config.ts` - Next.js configuration
- `tailwind.config.ts` - Tailwind CSS with custom design tokens
- `components.json` - shadcn/ui configuration
- `prisma/schema.prisma` - Database schema with detailed documentation

## Development Workflow

### Adding New Routes

1. Create page in `src/app/` following App Router conventions
2. Add route protection in `src/middleware.ts` if needed
3. Use `DashboardLayout` for dashboard-style pages
4. Update navigation in `src/modules/shared/config/navigation.ts`

### Database Changes

1. Modify `prisma/schema.prisma`
2. Run `npm run db:generate` to update Prisma client
3. Run `npm run db:migrate` to create and apply migration
4. Update seed data in `prisma/seed.ts` if needed

### Adding UI Components

1. Use existing shadcn/ui components from `src/modules/shared/components/ui/`
2. Follow design system patterns with Tailwind classes
3. Maintain TypeScript interfaces for props
4. Support both light and dark themes

### State Management

1. Use existing stores or create new ones in `src/modules/shared/stores/`
2. Create typed custom hooks in `src/modules/shared/hooks/`
3. Follow immer pattern for complex state updates

## Important Notes

- **Database**: Default SQLite for development, easily switchable to PostgreSQL/MySQL by updating `DATABASE_URL` and Prisma provider
- **Authentication**: User passwords are hashed with bcryptjs, sessions managed via JWT
- **Styling**: Use Tailwind CSS classes, custom CSS variables for theming
- **Theming**: Can customize theme colors using [TweakCN Theme Editor](https://tweakcn.com/editor/theme) - generates CSS variables for `globals.css`
- **TypeScript**: Strict mode enabled, avoid `any` types
- **Testing**: No test framework currently configured
- **Deployment**: Optimized for Vercel with included configuration

## Environment Variables

Required for development:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```
