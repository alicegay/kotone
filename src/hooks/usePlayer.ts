import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import Item from 'jellyfin-api/lib/types/media/Item'
import AsyncStorage from '@react-native-async-storage/async-storage'

interface PlayerStore {
  track: number
  trackID?: string
  position: 0
  queue: Item[]

  setTrack: (index: number) => void
  prevTrack: () => void
  nextTrack: () => void

  setQueue: (items: Item[], index?: number) => void
  addQueue: (items: Item[]) => void
  nextQueue: (items: Item[]) => void
  removeQueue: (index: number) => void

  hasHydrated: boolean
  setHasHydrated: (state: boolean) => void
}

const usePlayer = create<PlayerStore>()(
  persist(
    (set) => ({
      track: 0,
      trackID: undefined,
      position: 0,
      queue: [],

      setTrack: (index) =>
        set((state) => ({ track: index, trackID: state.queue[index].Id })),
      prevTrack: () =>
        set((state) => ({
          track: state.track - 1,
          trackID: state.queue[state.track - 1].Id,
        })),
      nextTrack: () =>
        set((state) => ({
          track: state.track + 1,
          trackID: state.queue[state.track + 1].Id,
        })),

      setQueue: (items, index = 0) =>
        set(() => ({ queue: items, track: index, trackID: items[index].Id })),
      addQueue: (items) =>
        set((state) => ({ queue: [...state.queue, ...items] })),
      nextQueue: (items) =>
        set((state) => ({
          queue: [
            ...state.queue.slice(0, state.track + 1),
            ...items,
            ...state.queue.slice(state.track + 1),
          ],
        })),
      removeQueue: (index) =>
        set((state) => ({ queue: state.queue.splice(index, 1) })),

      hasHydrated: false,
      setHasHydrated: (state) => set(() => ({ hasHydrated: state })),
    }),
    {
      name: 'player',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    },
  ),
)

export default usePlayer
