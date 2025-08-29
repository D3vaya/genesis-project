/**
 * @fileoverview Mock data for dashboard components
 * @description Static mock data to replace external API calls
 * @author Generated SaaS Template
 * @version 1.0.0
 */

/**
 * Mock user data
 * @const {Array} MOCK_USERS
 * @description Sample user data for dashboard statistics
 */
export const MOCK_USERS = [
  {
    id: 1,
    name: "María García",
    username: "maria.garcia",
    email: "maria@example.com",
    phone: "555-0101",
    website: "maria.example.com",
  },
  {
    id: 2,
    name: "Carlos López",
    username: "carlos.lopez",
    email: "carlos@example.com",
    phone: "555-0102",
    website: "carlos.example.com",
  },
  {
    id: 3,
    name: "Ana Martínez",
    username: "ana.martinez",
    email: "ana@example.com",
    phone: "555-0103",
    website: "ana.example.com",
  },
  {
    id: 4,
    name: "Luis Rodríguez",
    username: "luis.rodriguez",
    email: "luis@example.com",
    phone: "555-0104",
    website: "luis.example.com",
  },
  {
    id: 5,
    name: "Carmen Fernández",
    username: "carmen.fernandez",
    email: "carmen@example.com",
    phone: "555-0105",
    website: "carmen.example.com",
  },
  {
    id: 6,
    name: "Pedro González",
    username: "pedro.gonzalez",
    email: "pedro@example.com",
    phone: "555-0106",
    website: "pedro.example.com",
  },
  {
    id: 7,
    name: "Isabel Jiménez",
    username: "isabel.jimenez",
    email: "isabel@example.com",
    phone: "555-0107",
    website: "isabel.example.com",
  },
  {
    id: 8,
    name: "Miguel Herrera",
    username: "miguel.herrera",
    email: "miguel@example.com",
    phone: "555-0108",
    website: "miguel.example.com",
  },
  {
    id: 9,
    name: "Laura Ruiz",
    username: "laura.ruiz",
    email: "laura@example.com",
    phone: "555-0109",
    website: "laura.example.com",
  },
  {
    id: 10,
    name: "Diego Moreno",
    username: "diego.moreno",
    email: "diego@example.com",
    phone: "555-0110",
    website: "diego.example.com",
  },
];

/**
 * Mock posts data
 * @const {Array} MOCK_POSTS
 * @description Sample posts data for engagement calculations
 */
export const MOCK_POSTS = [
  {
    id: 1,
    userId: 1,
    title: "Introducción a React y TypeScript",
    body: "En este post exploraremos las mejores prácticas para usar React con TypeScript...",
  },
  {
    id: 2,
    userId: 1,
    title: "Estado Global con Zustand",
    body: "Zustand es una alternativa ligera a Redux para manejar estado global...",
  },
  {
    id: 3,
    userId: 2,
    title: "Componentes Reutilizables",
    body: "La creación de componentes reutilizables es clave para un desarrollo eficiente...",
  },
  {
    id: 4,
    userId: 2,
    title: "Hooks Personalizados en React",
    body: "Los hooks personalizados nos permiten reutilizar lógica entre componentes...",
  },
  {
    id: 5,
    userId: 3,
    title: "Testing con Jest y React Testing Library",
    body: "Una guía completa para testear aplicaciones React de manera efectiva...",
  },
  {
    id: 6,
    userId: 3,
    title: "Optimización de Performance",
    body: "Técnicas para mejorar el rendimiento de aplicaciones React...",
  },
  {
    id: 7,
    userId: 4,
    title: "Styling con Tailwind CSS",
    body: "Cómo usar Tailwind CSS de manera eficiente en proyectos React...",
  },
  {
    id: 8,
    userId: 4,
    title: "Animaciones con Framer Motion",
    body: "Crear animaciones fluidas y profesionales con Framer Motion...",
  },
  {
    id: 9,
    userId: 5,
    title: "API Routes en Next.js",
    body: "Implementar APIs serverless con Next.js de manera sencilla...",
  },
  {
    id: 10,
    userId: 5,
    title: "Deployment con Vercel",
    body: "Guía paso a paso para desplegar aplicaciones Next.js en Vercel...",
  },
  {
    id: 11,
    userId: 6,
    title: "Gestión de Formularios",
    body: "Mejores prácticas para manejar formularios complejos en React...",
  },
  {
    id: 12,
    userId: 6,
    title: "Autenticación Segura",
    body: "Implementar autenticación JWT de manera segura en aplicaciones web...",
  },
  {
    id: 13,
    userId: 7,
    title: "Bases de Datos con Prisma",
    body: "Cómo usar Prisma ORM para interactuar con bases de datos...",
  },
  {
    id: 14,
    userId: 7,
    title: "Middleware en Next.js",
    body: "Usar middleware para proteger rutas y manejar autenticación...",
  },
  {
    id: 15,
    userId: 8,
    title: "SEO en Aplicaciones React",
    body: "Técnicas para optimizar el SEO en aplicaciones React y Next.js...",
  },
  {
    id: 16,
    userId: 8,
    title: "Monitoreo y Analytics",
    body: "Implementar monitoreo y analytics en aplicaciones web modernas...",
  },
  {
    id: 17,
    userId: 9,
    title: "Arquitectura de Componentes",
    body: "Organizar y estructurar componentes para proyectos grandes...",
  },
  {
    id: 18,
    userId: 9,
    title: "Internacionalización (i18n)",
    body: "Implementar múltiples idiomas en aplicaciones React...",
  },
  {
    id: 19,
    userId: 10,
    title: "Progressive Web Apps",
    body: "Convertir aplicaciones React en PWAs funcionales...",
  },
  {
    id: 20,
    userId: 10,
    title: "Docker para Desarrollo",
    body: "Usar Docker para crear entornos de desarrollo consistentes...",
  },
];

/**
 * Get mock dashboard data
 * @function getMockDashboardData
 * @description Returns mock data simulating API response
 * @returns {Promise<{users: any[], posts: any[]}>} Mock data promise
 */
export const getMockDashboardData = async (): Promise<{
  users: any[];
  posts: any[];
}> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    users: MOCK_USERS,
    posts: MOCK_POSTS,
  };
};