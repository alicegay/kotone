import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

interface SettingsStore {
  gain: boolean

  setGain: (value: boolean) => void

  hasHydrated: boolean
  setHasHydrated: (state: boolean) => void
}

const useTheme = create<SettingsStore>()(
  persist(
    (set, get) => ({
      gain: true,

      setGain: (gain) => set(() => ({ gain: gain })),

      hasHydrated: false,
      setHasHydrated: (state) => set(() => ({ hasHydrated: state })),
    }),
    {
      name: 'settings',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    },
  ),
)

export default useTheme
