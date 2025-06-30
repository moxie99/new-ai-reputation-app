/* eslint-disable @typescript-eslint/no-unused-vars */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { tokenStorage } from '@/lib/auth/token-storage'
import { User } from '../../../types'

interface AuthState {
  user: User | null
  token: string | null
  setAuth: (user: User, token: string) => void
  logout: () => void
  checkAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      setAuth: (user, token) => {
        tokenStorage.setToken(token)
        set({ user, token })
      },
      logout: () => {
        tokenStorage.removeToken()
        set({ user: null, token: null })
      },
      checkAuth: () => {
        const token = tokenStorage.getToken()
        if (!token) {
          set({ user: null, token: null })
        } else {
          set({ token })
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user }), // Only persist user, not token
    }
  )
)
