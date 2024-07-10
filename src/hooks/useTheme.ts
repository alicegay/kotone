import { create } from 'zustand'

interface ThemeStore {
  background: string
  foreground: string
  foregroundAlt: string
  tint: string
  green: string
  font400: string
  font500: string
  font700: string
}

const useTheme = create<ThemeStore>()(() => ({
  background: '#222',
  foreground: '#fff',
  foregroundAlt: '#fff6',
  tint: '#A00000',
  green: '#00A000',
  font400: 'NunitoRoundedMplus-Regular',
  font500: 'NunitoRoundedMplus-Medium',
  font700: 'NunitoRoundedMplus-Bold',
}))

export default useTheme
