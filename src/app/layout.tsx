/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Analytics } from '@vercel/analytics/react'
import { Providers } from '@/components/providers'
import { Header } from '@/components/header'
import { Toaster } from 'react-hot-toast'
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'AI Reputation Lookup',
  description: 'AI-powered reputation analysis using public data',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <div className='min-h-screen bg-gray-50'>
            {/* <Header /> */}
            <main>{children}</main>
          </div>
        </Providers>
        <Analytics />
        <Toaster
          position='top-center'
          toastOptions={{
            // Default options for all toasts
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            // Default options for specific toast types
            success: {
              duration: 3000,
              style: {
                background: '#10b981',
              },
            },
            error: {
              duration: 5000,
              style: {
                background: '#ef4444',
              },
            },
          }}
        />
      </body>
    </html>
  )
}
