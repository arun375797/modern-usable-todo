import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AUTH_STORAGE_KEY } from '../constants/storageKeys'

export const useAuth = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      setAuth: ({ token, user = null }) => set({ token, user }),
      logout: () => set({ token: null, user: null })
    }),
    { name: AUTH_STORAGE_KEY }
  )
)
