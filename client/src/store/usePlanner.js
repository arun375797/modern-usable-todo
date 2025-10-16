import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { PLANNER_STORAGE_KEY } from '../constants/storageKeys'

const weekTemplate = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => ({
  id: day.toLowerCase(),
  day,
  theme: '',
  highlights: []
}))

const defaultState = {
  day: {
    focus: [],
    blocks: []
  },
  events: [],
  week: weekTemplate,
  month: {
    intent: '',
    rocks: [],
    rituals: []
  },
  year: {
    word: '',
    pillars: [],
    bucketList: []
  }
}

function cloneDefault(){
  return JSON.parse(JSON.stringify(defaultState))
}

function createId(prefix){
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`
}

export const usePlanner = create(
  persist(
    (set, get) => ({
      ...cloneDefault(),
      reset: () => set(cloneDefault()),
      // Day focus
      addFocus: (title) =>
        set((state) => ({
          day: { ...state.day, focus: [...state.day.focus, { id: createId('focus'), title }] }
        })),
      removeFocus: (id) =>
        set((state) => ({
          day: { ...state.day, focus: state.day.focus.filter((item) => item.id !== id) }
        })),
      // Day blocks
      addBlock: (block) =>
        set((state) => ({
          day: {
            ...state.day,
            blocks: [...state.day.blocks, { id: createId('block'), ...block }]
          }
        })),
      removeBlock: (id) =>
        set((state) => ({
          day: {
            ...state.day,
            blocks: state.day.blocks.filter((block) => block.id !== id)
          }
        })),
      // Events
      addEvent: (event) =>
        set((state) => ({
          events: [...state.events, { id: createId('event'), ...event }]
        })),
      removeEvent: (id) =>
        set((state) => ({
          events: state.events.filter((event) => event.id !== id)
        })),
      // Week themes/highlights
      setWeekTheme: (dayId, theme) =>
        set((state) => ({
          week: state.week.map((day) =>
            day.id === dayId ? { ...day, theme } : day
          )
        })),
      addWeekHighlight: (dayId, text) =>
        set((state) => ({
          week: state.week.map((day) =>
            day.id === dayId
              ? {
                  ...day,
                  highlights: [...day.highlights, { id: createId('highlight'), text }]
                }
              : day
          )
        })),
      removeWeekHighlight: (dayId, highlightId) =>
        set((state) => ({
          week: state.week.map((day) =>
            day.id === dayId
              ? {
                  ...day,
                  highlights: day.highlights.filter((item) => item.id !== highlightId)
                }
              : day
          )
        })),
      // Month data
      setMonthIntent: (intent) =>
        set((state) => ({
          month: { ...state.month, intent }
        })),
      addRock: (rock) =>
        set((state) => ({
          month: {
            ...state.month,
            rocks: [...state.month.rocks, { id: createId('rock'), ...rock }]
          }
        })),
      updateRock: (id, updates) =>
        set((state) => ({
          month: {
            ...state.month,
            rocks: state.month.rocks.map((rock) =>
              rock.id === id ? { ...rock, ...updates } : rock
            )
          }
        })),
      removeRock: (id) =>
        set((state) => ({
          month: {
            ...state.month,
            rocks: state.month.rocks.filter((rock) => rock.id !== id)
          }
        })),
      addRitual: (text) =>
        set((state) => ({
          month: {
            ...state.month,
            rituals: [...state.month.rituals, { id: createId('ritual'), text }]
          }
        })),
      removeRitual: (id) =>
        set((state) => ({
          month: {
            ...state.month,
            rituals: state.month.rituals.filter((ritual) => ritual.id !== id)
          }
        })),
      // Year data
      setYearWord: (word) =>
        set((state) => ({
          year: { ...state.year, word }
        })),
      addPillar: (pillar) =>
        set((state) => ({
          year: {
            ...state.year,
            pillars: [...state.year.pillars, { id: createId('pillar'), ...pillar }]
          }
        })),
      removePillar: (id) =>
        set((state) => ({
          year: {
            ...state.year,
            pillars: state.year.pillars.filter((pillar) => pillar.id !== id)
          }
        })),
      addBucketItem: (text) =>
        set((state) => ({
          year: {
            ...state.year,
            bucketList: [...state.year.bucketList, { id: createId('bucket'), text }]
          }
        })),
      removeBucketItem: (id) =>
        set((state) => ({
          year: {
            ...state.year,
            bucketList: state.year.bucketList.filter((item) => item.id !== id)
          }
        }))
    }),
    { name: PLANNER_STORAGE_KEY }
  )
)
