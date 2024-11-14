import { GestureResponderEvent, Pressable, Text, View } from 'react-native'
import { Icon } from './Icon'
import useTheme from 'hooks/useTheme'

interface Props {
  title: string
  onPress?: (e: GestureResponderEvent) => void
}

const HomeHeader = ({ title, onPress }: Props) => {
  const theme = useTheme()

  return (
    <View
      style={{
        paddingHorizontal: 16,
        gap: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
      }}
    >
      <Text
        style={{
          color: theme.scheme.primary,
          fontFamily: theme.font700,
          fontSize: 20,
        }}
      >
        {title}
      </Text>
      {!!onPress && (
        <Pressable
          android_ripple={{
            color: theme.scheme.ripple,
            foreground: true,
            borderless: true,
          }}
          style={{
            width: 32,
            height: 32,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={onPress}
        >
          <Icon
            name="arrow_forward"
            style={{ color: theme.scheme.primary, fontSize: 24 }}
          />
        </Pressable>
      )}
    </View>
  )
}

export default HomeHeader
