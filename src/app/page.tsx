'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { tokenStorage } from '@/lib/auth/token-storage'
import { Features } from '@/components/features'
import { Hero } from '@/components/hero'
import { SearchForm } from '@/components/search-form'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return
    const token = sessionStorage.getItem('auth-token')
    const expiry = sessionStorage.getItem('auth-token-expiry')
    if (token && expiry) {
      if (new Date(expiry) < new Date()) {
        // Token expired
        tokenStorage.removeToken()
        router.push('/login')
      } else {
        // Token valid
        router.push('/dashboard')
      }
    }
    // If no token, stay on landing page
  }, [router])

  return (
    <div className='min-h-screen w-full bg-gradient-to-br from-blue-600 via-purple-500 to-pink-400 bg-blend-multiply flex flex-col'>
      <div className='flex-1 flex flex-col justify-center items-center'>
        <Hero />
        <Features />
        <section className='py-16 w-full'>
          <div className='container mx-auto px-4 bg-white/80 rounded-2xl shadow-lg backdrop-blur-md border border-white/30'>
            <SearchForm />
          </div>
        </section>
      </div>
    </div>
  )
}
