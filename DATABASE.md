# 🗄️ Base de Datos - Guía de Desarrollo

## 📋 Información General

Este proyecto utiliza **Prisma ORM** con **SQLite** como base de datos local para desarrollo.

## 🚀 Scripts Disponibles

### Comandos Principales

```bash
# Generar el cliente de Prisma después de cambios en el schema
npm run db:generate

# Crear y aplicar migraciones
npm run db:migrate

# Ejecutar el seed (cargar datos de prueba)
npm run db:seed

# Abrir Prisma Studio (interfaz visual de la BD)
npm run db:studio

# Reset completo: borra todo, migra y hace seed
npm run db:reset
```

## 👤 Usuario de Prueba

El script de seed crea automáticamente un usuario de prueba con las siguientes credenciales:

### 🔑 Credenciales de Login

- **Email:** `usuario@ejemplo.com`
- **Password:** `password123`

### ⚠️ Nota Importante

Estas credenciales coinciden con los placeholders mostrados en la pantalla de login para facilitar el desarrollo y testing.

## 📁 Estructura de Archivos

```
prisma/
├── schema.prisma      # Definición del esquema de la base de datos
├── seed.ts           # Script para cargar datos de prueba
└── migrations/       # Historial de migraciones

src/generated/prisma/ # Cliente generado de Prisma
```

## 🛠️ Workflow de Desarrollo

### 1. Después de clonar el proyecto:

```bash
npm install
npm run db:generate
npm run db:migrate
npm run db:seed
```

### 2. Para cambios en el schema:

```bash
# 1. Modifica prisma/schema.prisma
# 2. Genera migración
npm run db:migrate
# 3. Regenera el cliente
npm run db:generate
```

### 3. Para visualizar/editar datos:

```bash
npm run db:studio
# Abre en http://localhost:5555
```

## 📊 Esquema Actual

### Tabla: `users`

- `id` (String, cuid, PK)
- `email` (String, unique)
- `name` (String, optional)
- `password` (String, hashed con bcrypt)
- `image` (String, optional)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### Tablas de NextAuth:

- `accounts` - Cuentas de proveedores externos
- `sessions` - Sesiones de usuario
- `verification_tokens` - Tokens de verificación

## 🔐 Seguridad

- Las contraseñas se almacenan hasheadas con **bcrypt** (saltRounds: 12)
- El usuario de prueba es solo para desarrollo local
- En producción, cambiar las credenciales y usar variables de entorno seguras

## 📝 Personalización

Para agregar más datos de prueba, edita el archivo `prisma/seed.ts` y ejecuta:

```bash
npm run db:seed
```

## 🆘 Solución de Problemas

### Error: "Prisma Client not generated"

```bash
npm run db:generate
```

### Error: "Database not found"

```bash
npm run db:migrate
```

### Resetear todo desde cero

```bash
npm run db:reset
```
