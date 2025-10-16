import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { NOTES_STORAGE_KEY } from '../constants/storageKeys'

function createId(){
  return `note-${Math.random().toString(36).slice(2, 10)}`
}

export const useNotes = create(
  persist(
    (set) => ({
      notes: [],
      addNote: (note) =>
        set((state) => ({
          notes: [{ id: createId(), createdAt: new Date().toISOString(), ...note }, ...state.notes]
        })),
      removeNote: (id) =>
        set((state) => ({
          notes: state.notes.filter((note) => note.id !== id)
        }))
    }),
    { name: NOTES_STORAGE_KEY }
  )
)
