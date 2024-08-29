import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/react'
import '@/app/globals.css'
import { cn } from '@/lib/utils'
import { TailwindIndicator } from '@/components/tailwind-indicator'
import { Providers } from '@/components/providers'
import { Header } from '@/components/header'
import { Toaster } from '@/components/ui/sonner'
import { KasadaClient } from '@/lib/kasada/kasada-client'
import { Inter } from 'next/font/google'
import ClerkWrapper from '../clerk-config';
import ClerkToken from "../components/clerkToken/index";
import { AuthProvider } from "../context/authContext";
import NextTopLoader from 'nextjs-toploader'

import './globals.css'

export const metadata = {
  metadataBase: new URL('https://gemini.vercel.ai'),
  title: {
    default: 'Next.js Gemini Chatbot',
    template: `%s - Next.js Gemini Chatbot`
  },
  description:
    'Build your own generative UI chatbot using the Vercel AI SDK and Google Gemini',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png'
  }
}

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' }
  ]
}

interface RootLayoutProps {
  children: React.ReactNode
}

const fontHeading = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-heading'
})

const fontBody = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body'
})

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'font-sans antialiased',
          GeistSans.variable,
          GeistMono.variable,
          fontHeading.variable,
          fontBody.variable
        )}
      >
        <NextTopLoader color="#8900A0" showSpinner={false} />
        <ClerkWrapper>
          <AuthProvider>
            <KasadaClient />
            <Toaster position="top-center" />
            <ClerkToken />
            <Providers
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <div className="flex flex-col min-h-screen">
              {/* {!AuthProvider && <Header />} */}
              <Header />
                <main className="flex flex-col flex-1 relative w-full">{children}</main>
              </div>
              <TailwindIndicator />
            </Providers>
            <Analytics />
          </AuthProvider>
        </ClerkWrapper>
      </body>
    </html>
  )
}
