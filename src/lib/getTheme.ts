import {
  argbFromHex,
  hexFromArgb,
  themeFromSourceColor,
} from '@material/material-color-utilities'
import { Scheme } from 'hooks/useTheme'

const getTheme = (color: string, dark: boolean): Scheme => {
  const theme = themeFromSourceColor(argbFromHex(color.slice(0, 7)))
  let scheme = dark ? theme.schemes.dark.toJSON() : theme.schemes.light.toJSON()
  for (const key in scheme) {
    scheme[key] = hexFromArgb(scheme[key])
  }
  scheme['ripple'] = scheme['onBackground'] + '22'
  return scheme as unknown as Scheme
}

export default getTheme
