'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuthStore } from '@/lib/stores/auth'
import {
  Menu,
  X,
  Search,
  User,
  LogOut,
  LayoutDashboard,
  Home,
} from 'lucide-react'

export function Header() {
  const { user, logout } = useAuthStore()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  const handleLogout = () => {
    logout()
    setIsMobileMenuOpen(false)
  }

  return (
    <header className='bg-white border-b sticky top-0 z-50'>
      <div className='container mx-auto px-4'>
        <div className='flex justify-between items-center h-16'>
          {/* Logo */}
          <Link href='/' className='flex items-center gap-2'>
            <Search className='w-6 h-6 text-blue-600' />
            <span className='text-xl font-bold gradient-text'>
              AI Reputation
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className='hidden md:flex items-center gap-6'>
            {user ? (
              <>
                <Link
                  href='/dashboard'
                  className='flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors'
                >
                  <LayoutDashboard className='w-4 h-4' />
                  Dashboard
                </Link>
                <div className='flex items-center gap-4 pl-4 border-l'>
                  <span className='text-gray-500 text-sm'>{user.email}</span>
                  <button
                    onClick={handleLogout}
                    className='flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors'
                  >
                    <LogOut className='w-4 h-4' />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href='/login'
                  className='text-gray-600 hover:text-gray-900 transition-colors'
                >
                  Login
                </Link>
                <Link href='/register' className='btn btn-primary'>
                  Sign Up
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className='md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors'
            aria-label='Toggle menu'
          >
            {isMobileMenuOpen ? (
              <X className='w-6 h-6' />
            ) : (
              <Menu className='w-6 h-6' />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className='fixed inset-0 bg-black/20 backdrop-blur-sm md:hidden'
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Mobile Navigation */}
          <nav className='fixed top-16 left-0 right-0 bg-white border-b shadow-lg md:hidden'>
            <div className='container mx-auto px-4 py-4'>
              {user ? (
                <div className='space-y-4'>
                  <div className='pb-4 border-b'>
                    <p className='text-sm text-gray-500'>Signed in as</p>
                    <p className='font-medium'>{user.email}</p>
                  </div>

                  <Link
                    href='/dashboard'
                    className='flex items-center gap-3 py-2 text-gray-700 hover:text-blue-600 transition-colors'
                  >
                    <LayoutDashboard className='w-5 h-5' />
                    Dashboard
                  </Link>

                  <Link
                    href='/'
                    className='flex items-center gap-3 py-2 text-gray-700 hover:text-blue-600 transition-colors'
                  >
                    <Home className='w-5 h-5' />
                    Home
                  </Link>

                  <button
                    onClick={handleLogout}
                    className='flex items-center gap-3 py-2 text-red-600 hover:text-red-700 transition-colors w-full'
                  >
                    <LogOut className='w-5 h-5' />
                    Logout
                  </button>
                </div>
              ) : (
                <div className='space-y-4'>
                  <Link
                    href='/'
                    className='flex items-center gap-3 py-2 text-gray-700 hover:text-blue-600 transition-colors'
                  >
                    <Home className='w-5 h-5' />
                    Home
                  </Link>

                  <Link
                    href='/login'
                    className='flex items-center gap-3 py-2 text-gray-700 hover:text-blue-600 transition-colors'
                  >
                    <User className='w-5 h-5' />
                    Login
                  </Link>

                  <Link
                    href='/register'
                    className='block w-full btn btn-primary text-center'
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </>
      )}
    </header>
  )
}
