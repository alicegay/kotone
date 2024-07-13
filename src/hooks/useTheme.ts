import { create } from 'zustand'

interface ThemeStore {
  background: string
  foreground: string
  foregroundAlt: string
  ripple: string
  tint: string
  red: string
  green: string
  blue: string

  font400: string
  font500: string
  font700: string
}

const useTheme = create<ThemeStore>()(() => ({
  background: '#1E100D',
  foreground: '#fff',
  foregroundAlt: '#fff6',
  ripple: '#fff2',
  tint: '#741224',
  red: '#A00000',
  green: '#00A000',
  blue: '#0000A0',

  font400: 'NunitoRoundedMplus-Regular',
  font500: 'NunitoRoundedMplus-Medium',
  font700: 'NunitoRoundedMplus-Bold',
}))

export default useTheme
