import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import Item from 'jellyfin-api/lib/types/media/Item'
import AsyncStorage from '@react-native-async-storage/async-storage'
import TrackPlayer, { RepeatMode } from 'react-native-track-player'
import itemToRNTPTrack from 'lib/itemToRNTPTrack'
import { Track } from 'types/ItemTypes'
import itemToType from 'lib/itemToType'

interface PlayerStore {
  track: number
  trackID?: string
  queue: Track[]
  repeat: 'off' | 'track' | 'queue'
  ducked: boolean

  setTrack: (index: number, stealth?: boolean) => void
  prevTrack: () => void
  nextTrack: () => void
  play: () => void
  pause: () => void
  setRepeat: (mode: 'off' | 'track' | 'queue') => void
  cycleRepeat: () => void
  setDucked: (value: boolean) => void

  setQueue: (items: Item[] | Track[], index?: number) => void
  moveQueue: (fromIndex: number, toIndex: number) => void
  clearQueue: () => void
  addQueue: (items: Item[] | Track[]) => void
  nextQueue: (items: Item[] | Track[]) => void
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
      repeat: 'off',
      ducked: false,

      setTrack: (index, stealth = false) => {
        set((state) => ({ track: index, trackID: state.queue[index].Id }))
        if (!stealth) TrackPlayer.skip(index)
      },
      prevTrack: async () => {
        const current = get().track
        const progress = await TrackPlayer.getProgress()
        if (progress.position < 1.0 && current !== 0) {
          set((state) => ({
            track: state.track - 1,
            trackID: state.queue[state.track - 1].Id,
          }))
          await TrackPlayer.skipToPrevious()
        } else {
          await TrackPlayer.seekTo(0)
        }
      },
      nextTrack: () => {
        const current = get().track
        const length = get().queue.length
        const repeat = get().repeat
        if (current === length - 1) {
          if (repeat === 'queue') {
            set((state) => ({ track: 0, trackId: state.queue[0].Id }))
            TrackPlayer.skip(0)
          } else if (repeat == 'track') {
            TrackPlayer.seekTo(0)
          }
        } else {
          set((state) => ({
            track: state.track + 1,
            trackID: state.queue[state.track + 1].Id,
          }))
          TrackPlayer.skipToNext()
        }
      },
      play: () => {
        TrackPlayer.play()
      },
      pause: () => {
        TrackPlayer.pause()
      },
      setRepeat: (mode) => {
        set(() => ({ repeat: mode }))
        TrackPlayer.setRepeatMode(
          mode === 'off'
            ? RepeatMode.Off
            : mode === 'queue'
            ? RepeatMode.Queue
            : RepeatMode.Track,
        )
      },
      cycleRepeat: () => {
        const current = get().repeat
        get().setRepeat(
          current === 'off' ? 'queue' : current === 'queue' ? 'track' : 'off',
        )
      },
      setDucked: (value) => set(() => ({ ducked: value })),

      setQueue: async (items, index = 0) => {
        const tracks = items.map((item) => itemToType(item) as Track)
        set(() => ({ queue: tracks, track: index, trackID: items[index].Id }))
        await TrackPlayer.setQueue(items.map((item) => itemToRNTPTrack(item)))
        await TrackPlayer.skip(index)
      },
      moveQueue: async (fromIndex, toIndex) => {
        const newQueue = [...get().queue]
        const removed = newQueue.splice(fromIndex, 1)
        newQueue.splice(toIndex, 0, removed[0]!)
        let newIndex = get().track
        if (fromIndex === newIndex) {
          newIndex = toIndex
        } else if (fromIndex < newIndex && toIndex >= newIndex) {
          newIndex--
        } else if (fromIndex > newIndex && toIndex <= newIndex) {
          newIndex++
        }
        set(() => ({
          queue: newQueue,
          track: newIndex,
          trackID: newQueue[newIndex].Id,
        }))
        await TrackPlayer.move(fromIndex, toIndex)
      },
      clearQueue: () => {
        set(() => ({ queue: [], track: 0, trackID: undefined }))
        TrackPlayer.reset()
      },
      addQueue: (items) => {
        const tracks = items.map((item) => itemToType(item) as Track)
        set((state) => ({ queue: [...state.queue, ...tracks] }))
        TrackPlayer.add(items.map((item) => itemToRNTPTrack(item)))
      },
      nextQueue: (items) => {
        const tracks = items.map((item) => itemToType(item) as Track)
        set((state) => ({
          queue: [
            ...state.queue.slice(0, state.track + 1),
            ...tracks,
            ...state.queue.slice(state.track + 1),
          ],
        }))
        TrackPlayer.add(
          items.map((item) => itemToRNTPTrack(item)),
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
        state?.setDucked(false)
      },
    },
  ),
)

export default usePlayer
