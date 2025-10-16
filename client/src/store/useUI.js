import { create } from 'zustand'

export const useUI = create((set) => ({
  quickInput: '',
  setQuickInput: (v) => set({ quickInput: v }),
}))
