import { tokenize } from 'react-native-japanese-text-analyzer'
import { isJapanese, isMixed, toRomaji } from 'wanakana'

const formatName = (name: string): string => {
  if (isJapanese(name) || isMixed(name)) {
    //const tokens = await tokenize(name)
    //let result = ''
    // for (let i = 0; i < tokens.length; i++) {
    //   result +=
    //     tokens[i].reading !== '*' ? tokens[i].reading : tokens[i].surface_form
    // }
    //console.log(result)
    return toRomaji(name).replace(/\s+/g, '').toLowerCase()
  }
  return name.replace(/\s+/g, '').toLowerCase()
}

export default formatName
