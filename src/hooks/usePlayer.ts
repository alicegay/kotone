import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import Item from 'jellyfin-api/lib/types/media/Item'
import AsyncStorage from '@react-native-async-storage/async-storage'
import TrackPlayer from 'react-native-track-player'
import itemToTrack from 'lib/itemToTrack'

interface PlayerStore {
  track: number
  trackID?: string
  queue: Item[]

  setTrack: (index: number, stealth?: boolean) => void
  prevTrack: () => void
  nextTrack: () => void
  play: () => void
  pause: () => void

  setQueue: (items: Item[], index?: number) => void
  clearQueue: () => void
  addQueue: (items: Item[]) => void
  nextQueue: (items: Item[]) => void
  removeQueue: (index: number) => void

  hasHydrated: boolean
  setHasHydrated: (state: boolean) => void
}

const usePlayer = create<PlayerStore>()(
  persist(
    (set, get) => ({
      track: 0,
      trackID: undefined,
      queue: [],

      setTrack: (index, stealth = false) => {
        set((state) => ({ track: index, trackID: state.queue[index].Id }))
        if (!stealth) TrackPlayer.skip(index)
      },
      prevTrack: () => {
        set((state) => ({
          track: state.track - 1,
          trackID: state.queue[state.track - 1].Id,
        }))
        TrackPlayer.skipToPrevious()
      },
      nextTrack: () => {
        set((state) => ({
          track: state.track + 1,
          trackID: state.queue[state.track + 1].Id,
        }))
        TrackPlayer.skipToNext()
      },
      play: () => {
        TrackPlayer.play()
      },
      pause: () => {
        TrackPlayer.pause()
      },

      setQueue: (items, index = 0) => {
        set(() => ({ queue: items, track: index, trackID: items[index].Id }))
        TrackPlayer.setQueue(items.map((item) => itemToTrack(item)))
      },
      clearQueue: () => {
        set(() => ({ queue: [], track: 0, trackID: undefined }))
        TrackPlayer.reset()
      },
      addQueue: (items) => {
        set((state) => ({ queue: [...state.queue, ...items] }))
        TrackPlayer.add(items.map((item) => itemToTrack(item)))
      },
      nextQueue: (items) => {
        set((state) => ({
          queue: [
            ...state.queue.slice(0, state.track + 1),
            ...items,
            ...state.queue.slice(state.track + 1),
          ],
        }))
        TrackPlayer.add(
          items.map((item) => itemToTrack(item)),
          get().track + 1,
        )
      },
      removeQueue: (index) => {
        set((state) => ({ queue: state.queue.splice(index, 1) }))
        TrackPlayer.remove(index)
      },

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
