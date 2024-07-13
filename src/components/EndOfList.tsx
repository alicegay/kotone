import { Text, View } from 'react-native'
import useTheme from 'hooks/useTheme'

interface Props {
  text?: string
}

const EndOfList = ({ text = 'End of list' }: Props) => {
  const theme = useTheme()

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 16,
        paddingHorizontal: 16,
        gap: 16,
        paddingBottom: 64 + 32,
      }}
    >
      <View
        style={{
          backgroundColor: theme.foregroundAlt,
          height: 1,
          flexGrow: 1,
        }}
      />
      <Text
        style={{
          color: theme.foregroundAlt,
          fontFamily: theme.font400,
          fontSize: 12,
        }}
      >
        {text}
      </Text>
      <View
        style={{
          backgroundColor: theme.foregroundAlt,
          height: 1,
          flexGrow: 1,
        }}
      />
    </View>
  )
}

export default EndOfList
