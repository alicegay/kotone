import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import {
  argbFromHex,
  hexFromArgb,
  themeFromSourceColor,
} from '@material/material-color-utilities'
import getTheme from 'lib/getTheme'
import { storage } from 'lib/storage'

interface ThemeStore {
  background: string
  foreground: string
  foregroundAlt: string
  ripple: string
  tint: string
  font400: string
  font500: string
  font700: string

  dTint: string
  dG1: string
  dG2: string

  dark: boolean
  scheme: Scheme

  setTint: (color: string) => void
  setDark: (dark: boolean) => void
  setTheme: (color: string) => void

  hasHydrated: boolean
  setHasHydrated: (state: boolean) => void
}

const useTheme = create<ThemeStore>()(
  persist(
    (set, get) => ({
      background: '#000',
      foreground: '#fff',
      foregroundAlt: '#fff6',
      ripple: '#fff2',
      tint: '#ffd7f4',
      font400: 'NunitoRoundedMplus-Regular',
      font500: 'NunitoRoundedMplus-Medium',
      font700: 'NunitoRoundedMplus-Bold',

      dTint: '#ffd7f4',
      dG1: '#6E5DC6',
      dG2: '#E774BB',

      dark: true,
      scheme: null,

      setTint: (color) => set(() => ({ tint: color.slice(0, 7) })),
      setDark: (dark) => set(() => ({ dark: dark })),
      setTheme: (color) => {
        const theme = getTheme(color, get().dark)
        set(() => ({
          scheme: theme,
        }))
      },

      hasHydrated: false,
      setHasHydrated: (state) => set(() => ({ hasHydrated: state })),
    }),
    {
      name: 'theme',
      storage: createJSONStorage(() => storage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    },
  ),
)

export type Scheme = {
  primary: string
  onPrimary: string
  primaryContainer: string
  onPrimaryContainer: string
  secondary: string
  onSecondary: string
  secondaryContainer: string
  onSecondaryContainer: string
  tertiary: string
  onTertiary: string
  tertiaryContainer: string
  onTertiaryContainer: string
  error: string
  onError: string
  errorContainer: string
  onErrorContainer: string
  background: string
  onBackground: string
  surface: string
  onSurface: string
  surfaceVariant: string
  onSurfaceVariant: string
  outline: string
  outlineVariant: string
  shadow: string
  scrim: string
  inverseSurface: string
  inverseOnSurface: string
  inversePrimary: string
  ripple: string
}

export default useTheme
