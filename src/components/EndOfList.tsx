import { Text, View } from 'react-native'
import useTheme, { Scheme } from 'hooks/useTheme'

interface Props {
  text?: string
  scheme?: Scheme
}

const EndOfList = ({ text = 'End of list', scheme }: Props) => {
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
          backgroundColor: !!scheme ? scheme.secondary : theme.scheme.secondary,
          height: 1,
          flexGrow: 1,
        }}
      />
      <Text
        style={{
          color: !!scheme ? scheme.secondary : theme.scheme.secondary,
          fontFamily: theme.font400,
          fontSize: 12,
        }}
      >
        {text}
      </Text>
      <View
        style={{
          backgroundColor: !!scheme ? scheme.secondary : theme.scheme.secondary,
          height: 1,
          flexGrow: 1,
        }}
      />
    </View>
  )
}

export default EndOfList
