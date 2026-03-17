import { create } from 'zustand'

export interface User {
  id: number
  pseudo: string
  avatarColor: string
  badges?: { badge: { name: string; emoji: string; slug: string } }[]
  createdAt?: string
}

interface AuthStore {
  user: User | null
  isAuthOpen: boolean
  authTab: 'register' | 'login'
  setUser: (u: User | null) => void
  openAuth: (tab?: 'register' | 'login') => void
  closeAuth: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthOpen: false,
  authTab: 'register',
  setUser: (u) => set({ user: u }),
  openAuth: (tab = 'register') => set({ isAuthOpen: true, authTab: tab }),
  closeAuth: () => set({ isAuthOpen: false }),
}))
