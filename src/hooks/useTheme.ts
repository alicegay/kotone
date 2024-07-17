import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  argbFromHex,
  hexFromArgb,
  themeFromSourceColor,
} from '@material/material-color-utilities'

interface ThemeStore {
  background: string
  foreground: string
  foregroundAlt: string
  ripple: string
  tint: string
  font400: string
  font500: string
  font700: string

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
      tint: '#b696c0',
      font400: 'NunitoRoundedMplus-Regular',
      font500: 'NunitoRoundedMplus-Medium',
      font700: 'NunitoRoundedMplus-Bold',

      dark: false,
      scheme: null,

      setTint: (color) => set(() => ({ tint: color.slice(0, 7) })),
      setDark: (dark) => set(() => ({ dark: dark })),
      setTheme: (color) => {
        const theme = themeFromSourceColor(argbFromHex(color))
        let scheme = get().dark
          ? theme.schemes.dark.toJSON()
          : theme.schemes.light.toJSON()
        for (const key in scheme) {
          scheme[key] = hexFromArgb(scheme[key])
        }
        scheme['ripple'] = scheme['onBackground'] + '22'
        set(() => ({
          scheme: scheme as unknown as Scheme,
        }))
      },

      hasHydrated: false,
      setHasHydrated: (state) => set(() => ({ hasHydrated: state })),
    }),
    {
      name: 'theme',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    },
  ),
)

type Scheme = {
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
