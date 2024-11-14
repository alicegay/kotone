import { storage } from 'lib/storage'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface SettingsStore {
  gain: boolean
  bitrate: number
  showLikes: boolean

  setGain: (value: boolean) => void
  setBitrate: (value: number) => void
  setShowLikes: (value: boolean) => void

  hasHydrated: boolean
  setHasHydrated: (state: boolean) => void
}

const useSettings = create<SettingsStore>()(
  persist(
    (set, get) => ({
      gain: true,
      bitrate: 140_000_000,
      showLikes: false,

      setGain: (gain) => set(() => ({ gain: gain })),
      setBitrate: (bitrate) => set(() => ({ bitrate: bitrate })),
      setShowLikes: (showLikes) => set(() => ({ showLikes: showLikes })),

      hasHydrated: false,
      setHasHydrated: (state) => set(() => ({ hasHydrated: state })),
    }),
    {
      name: 'settings',
      storage: createJSONStorage(() => storage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    },
  ),
)

export default useSettings
