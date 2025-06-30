/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { ReactNode, useEffect } from 'react'
import { useAuthStore } from '@/lib/stores/auth'
import { tokenStorage } from '@/lib/auth/token-storage'

export function Providers({ children }: { children: ReactNode }) {
  const { checkAuth } = useAuthStore()

  useEffect(() => {
    // Check authentication on mount
    checkAuth()
  }, [checkAuth])

  return <>{children}</>
}
