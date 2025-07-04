'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  Bell,
  ClipboardList,
  Columns2,
  GitCommitVerticalIcon,
  LayoutDashboardIcon,
  LucidePyramid,
  Shield,
  Menu,
  X,
  MoreVertical,
  Settings,
  HelpCircle,
  LogOut,
} from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import SettingsModal from '@/components/SettingsModal'

const navLinks = [
  {
    href: '/b2b',
    label: 'Dashboard',
    icon: <LayoutDashboardIcon />,
    match: (pathname: string) => pathname === '/b2b',
  },
  {
    href: '/b2b/reports',
    label: 'Reports',
    icon: <ClipboardList />,
    match: (pathname: string) => pathname.startsWith('/b2b/reports'),
  },
  {
    href: '/b2b/consent-tracking',
    label: 'Consent Tracking',
    icon: <Shield />,
    match: (pathname: string) => pathname.startsWith('/b2b/consent-tracking'),
  },
  {
    href: '/b2b/integrations-api',
    label: 'Integrations & API',
    icon: <GitCommitVerticalIcon />,
    match: (pathname: string) => pathname.startsWith('/b2b/integrations-api'),
  },
  {
    href: '/b2b/billing-subscription',
    label: 'Billing & Subscription',
    icon: <LucidePyramid />,
    match: (pathname: string) =>
      pathname.startsWith('/b2b/billing-subscription'),
  },
]

export default function B2BLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)

  // Check if screen is mobile size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false)
      }
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (isUserMenuOpen && !target.closest('.user-menu-container')) {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isUserMenuOpen])

  // Handle bell icon click
  const handleNotificationClick = () => {
    router.push('/b2b/notifications')
  }

  const isOnNotificationsPage = pathname === '/b2b/notifications'

  // Handle collapse toggle
  const handleCollapseToggle = () => {
    if (isMobile) {
      setIsMobileMenuOpen(!isMobileMenuOpen)
    } else {
      setIsCollapsed(!isCollapsed)
    }
  }

  // Close mobile menu when clicking on nav links
  const handleNavClick = () => {
    if (isMobile) {
      setIsMobileMenuOpen(false)
    }
  }

  // Handle user menu actions
  const handleUserMenuAction = (action: string) => {
    setIsUserMenuOpen(false)

    switch (action) {
      case 'settings':
        setIsSettingsModalOpen(true)
        break
      case 'help':
        router.push('/b2b/help')
        break
      case 'signout':
        // Handle sign out logic here
        console.log('Signing out...')
        // router.push('/login')
        break
    }
  }

  const sidebarWidth = isCollapsed && !isMobile ? 'w-20' : 'w-83'

  return (
    <div className='min-h-screen flex bg-[#fff] relative'>
      {/* Mobile Header */}
      {isMobile && (
        <div className='fixed top-0 left-0 right-0 z-50 bg-[#F8FAFC] border-b border-gray-200 px-4 py-3 flex items-center justify-between md:hidden'>
          <div className='flex items-center gap-2'>
            <Image src='/logo.png' alt='logo' width={32.25} height={25} />
            <span className='font-bold text-xl text-gray-800'>Observr</span>
          </div>
          <div className='flex items-center gap-4'>
            <button
              onClick={handleNotificationClick}
              className='p-2 hover:bg-gray-100 rounded-lg transition'
            >
              <Bell size={20} />
            </button>
            <button
              onClick={handleCollapseToggle}
              className='p-2 hover:bg-gray-100 rounded-lg transition'
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      )}

      {/* Mobile Backdrop */}
      {isMobile && isMobileMenuOpen && (
        <div
          className='fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden'
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          ${sidebarWidth} bg-[#F8FAFC] flex flex-col justify-between py-6 px-4 min-h-screen transition-all duration-300 ease-in-out
          ${
            isMobile
              ? `fixed left-0 top-0 z-50 transform ${
                  isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                } w-83`
              : 'relative'
          }
        `}
      >
        <div>
          {/* Logo */}
          <div
            className={`flex items-center ${
              isCollapsed && !isMobile ? 'justify-center' : 'justify-between'
            } gap-3 mb-8 px-2`}
          >
            {(!isCollapsed || isMobile) && (
              <div className='flex items-center gap-2'>
                <Image src='/logo.png' alt='logo' width={32.25} height={25} />
                <span className='font-bold text-xl text-gray-800'>Observr</span>
              </div>
            )}
            {isCollapsed && !isMobile && (
              <Image src='/logo.png' alt='logo' width={32.25} height={25} />
            )}
            {!isMobile && (
              <div className='flex items-center gap-4'>
                <Button
                  onClick={handleNotificationClick}
                  className={`p-2 hover:bg-gray-100 rounded-lg transition ${
                    isOnNotificationsPage
                      ? 'text-blue-700 bg-blue-50'
                      : 'text-gray-700'
                  }`}
                >
                  <Bell size={20} />
                </Button>
                <button
                  onClick={handleCollapseToggle}
                  className='p-1 hover:bg-gray-100 rounded transition'
                  title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                  <Columns2 size={20} />
                </button>
              </div>
            )}
          </div>

          {/* Nav */}
          <nav className='flex flex-col gap-2'>
            {navLinks.map((link) => {
              const isActive = link.match(pathname)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={handleNavClick}
                  className={
                    `px-3 py-4 rounded-lg flex items-center gap-3 transition relative group ` +
                    (isActive
                      ? 'bg-[#ECF2F7] font-bold text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100 font-medium')
                  }
                  title={isCollapsed && !isMobile ? link.label : ''}
                >
                  <span className='text-lg flex-shrink-0'>{link.icon}</span>
                  {(!isCollapsed || isMobile) && <span>{link.label}</span>}

                  {/* Tooltip for collapsed state */}
                  {isCollapsed && !isMobile && (
                    <div className='absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10'>
                      {link.label}
                    </div>
                  )}
                </Link>
              )
            })}
          </nav>

          {(!isCollapsed || isMobile) && (
            <button className='w-full mt-20 bg-blue-50 text-blue-700 font-semibold py-2 rounded-lg border border-blue-100 hover:bg-blue-100 transition'>
              Upload CSV
            </button>
          )}
        </div>

        {/* User profile - Expanded state */}
        {(!isCollapsed || isMobile) && (
          <div className='flex items-center gap-3 px-2 mt-8 user-menu-container relative'>
            <div className='w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0'>
              <span className='text-gray-400 text-xl'>👤</span>
            </div>
            <div className='min-w-0 flex-1'>
              <div className='font-semibold text-gray-800 text-sm truncate'>
                Reona Satio
              </div>
              <div className='text-xs text-gray-500 truncate'>
                reonasatio@gmail.com
              </div>
            </div>

            {/* Three dots menu button */}
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className='p-1 hover:bg-gray-100 rounded transition-colors'
              title='User menu'
            >
              <MoreVertical size={16} className='text-gray-600' />
            </button>

            {/* Dropdown menu for expanded state */}
            {isUserMenuOpen && (
              <div className='absolute bottom-full left-0 mb-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50'>
                <button
                  onClick={() => handleUserMenuAction('settings')}
                  className='w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors'
                >
                  <Settings size={16} />
                  Settings
                </button>
                <button
                  onClick={() => handleUserMenuAction('help')}
                  className='w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors'
                >
                  <HelpCircle size={16} />
                  Help
                </button>
                <hr className='my-1 border-gray-100' />
                <button
                  onClick={() => handleUserMenuAction('signout')}
                  className='w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors'
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        )}

        {/* User profile - Collapsed state */}
        {isCollapsed && !isMobile && (
          <div className='flex justify-center px-2 mt-8 user-menu-container relative'>
            <div className='flex items-center gap-2'>
              <div className='w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center group relative'>
                <span className='text-gray-400 text-xl'>👤</span>
                {/* Tooltip for collapsed user */}
                <div className='absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10'>
                  <div className='font-semibold'>Reona Satio</div>
                  <div className='text-xs'>reonasatio@gmail.com</div>
                </div>
              </div>

              {/* Three dots menu button */}
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className='p-1 hover:bg-gray-100 rounded transition-colors'
                title='User menu'
              >
                <MoreVertical size={16} className='text-gray-600' />
              </button>
            </div>

            {/* Dropdown menu for collapsed state */}
            {isUserMenuOpen && (
              <div className='absolute bottom-full left-full ml-2 mb-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50'>
                <button
                  onClick={() => handleUserMenuAction('settings')}
                  className='w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors'
                >
                  <Settings size={16} />
                  Settings
                </button>
                <button
                  onClick={() => handleUserMenuAction('help')}
                  className='w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors'
                >
                  <HelpCircle size={16} />
                  Help
                </button>
                <hr className='my-1 border-gray-100' />
                <button
                  onClick={() => handleUserMenuAction('signout')}
                  className='w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors'
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isMobile ? 'pt-16 p-6' : 'p-10'
        }`}
      >
        {children}
      </main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />
    </div>
  )
}