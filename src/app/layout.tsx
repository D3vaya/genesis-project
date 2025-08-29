/**
 * @fileoverview Root layout component for the SaaS application
 * @description Main layout component that wraps the entire application with providers and global styling
 * @author Generated SaaS Template
 * @version 1.0.0
 */

import React from 'react'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Providers } from '@/modules/shared/components/providers/Providers'

/**
 * Geist Sans font configuration
 * @const {NextFont} geistSans
 * @description Modern sans-serif font for the application
 */
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
})

/**
 * Geist Mono font configuration
 * @const {NextFont} geistMono
 * @description Monospace font for code and technical content
 */
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
})

/**
 * Application metadata configuration
 * @const {Metadata} metadata
 * @description SEO and meta information for the application
 */
export const metadata: Metadata = {
  title: {
    default: 'SaaS Template | Next.js + shadcn/ui',
    template: '%s | SaaS Template',
  },
  description:
    'Modern SaaS application template built with Next.js, TypeScript, shadcn/ui, NextAuth, Prisma, and Zustand',
  keywords: [
    'SaaS',
    'Next.js',
    'TypeScript',
    'shadcn/ui',
    'NextAuth',
    'Prisma',
    'Zustand',
    'Template',
    'Starter',
  ],
  authors: [
    {
      name: 'SaaS Template',
    },
  ],
  creator: 'SaaS Template',
  publisher: 'SaaS Template',
  metadataBase: new URL(
    process.env.NEXTAUTH_URL || process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000'
  ),
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    alternateLocale: ['en_US'],
    url: './',
    title: 'SaaS Template | Next.js + shadcn/ui',
    description:
      'Modern SaaS application template built with the latest web technologies',
    siteName: 'SaaS Template',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'SaaS Template - Modern SaaS Application',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SaaS Template | Next.js + shadcn/ui',
    description:
      'Modern SaaS application template built with the latest web technologies',
    images: ['/og-image.jpg'],
    creator: '@saastemplate',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    other: {
      me: ['mailto:contact@example.com'],
    },
  },
  category: 'technology',
  classification: 'SaaS Application Template',
  referrer: 'origin-when-cross-origin',
  generator: 'Next.js',
  applicationName: 'SaaS Template',
  alternates: {
    canonical: './',
    languages: {
      'es-ES': './es',
      'en-US': './en',
    },
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
    other: [
      {
        rel: 'apple-touch-icon-precomposed',
        url: '/apple-touch-icon-precomposed.png',
      },
    ],
  },
  other: {
    'msapplication-TileColor': '#000000',
    'theme-color': '#000000',
  },
}

/**
 * Root layout component
 * @component RootLayout
 * @description Main layout component that wraps the entire application
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render
 * @returns {React.JSX.Element} Root layout with providers and global styling
 * @example
 * ```typescript
 * // This layout automatically wraps all pages in the application
 * // It provides global providers, fonts, and styling
 * export default function RootLayout({ children }) {
 *   return (
 *     <html lang="es">
 *       <body>
 *         <Providers>
 *           {children}
 *         </Providers>
 *       </body>
 *     </html>
 *   )
 * }
 * ```
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="h-full" suppressHydrationWarning>
      <head>
        {/* Preconnect to external domains for better performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />

        {/* Viewport meta tag for responsive design */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />

        {/* Theme color for mobile browsers */}
        <meta name="theme-color" content="#000000" />
        <meta name="msapplication-navbutton-color" content="#000000" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />

        {/* Prevent automatic phone number detection */}
        <meta name="format-detection" content="telephone=no" />

        {/* Favicon and app icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {/* Web app manifest */}
        <link rel="manifest" href="/manifest.json" />

        {/* CSRF token meta tag (if needed by your backend) */}
        <meta name="csrf-token" content="" />
      </head>
      <body
        className={` ${geistSans.variable} ${geistMono.variable} bg-background text-foreground selection:bg-primary/20 selection:text-primary-foreground min-h-full font-sans antialiased`}
        suppressHydrationWarning
      >
        {/* Skip to main content link for accessibility */}
        <a
          href="#main-content"
          className="bg-primary text-primary-foreground sr-only z-50 rounded-md px-4 py-2 focus:not-sr-only focus:absolute focus:top-4 focus:left-4"
        >
          Saltar al contenido principal
        </a>

        {/* Main application wrapped in providers */}
        <Providers>
          <div id="main-content" className="min-h-full">
            {children}
          </div>
        </Providers>

        {/* Performance monitoring script (placeholder) */}
        {process.env.NODE_ENV === 'production' && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                // Web Vitals tracking
                if ('performance' in window) {
                  window.addEventListener('load', function() {
                    // Track page load time
                    const perfData = performance.getEntriesByType('navigation')[0];
                    if (perfData && perfData.loadEventEnd > 0) {
                      console.log('Page load time:', perfData.loadEventEnd - perfData.fetchStart, 'ms');
                    }
                  });
                }
              `,
            }}
          />
        )}

        {/* Google Analytics or other analytics scripts would go here */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                    page_title: document.title,
                    page_location: window.location.href,
                  });
                `,
              }}
            />
          </>
        )}
      </body>
    </html>
  )
}
