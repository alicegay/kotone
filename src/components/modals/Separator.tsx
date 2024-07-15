import { View } from 'react-native'
import useTheme from 'hooks/useTheme'

const Separator = () => {
  const theme = useTheme()

  return (
    <View
      style={{
        flexGrow: 1,
        height: 1,
        backgroundColor: theme.foregroundAlt,
        marginHorizontal: 16,
        marginVertical: 4,
      }}
    />
  )
}

export default Separator
