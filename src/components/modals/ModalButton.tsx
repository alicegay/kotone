import { GestureResponderEvent, Pressable, Text } from 'react-native'
import useTheme from 'hooks/useTheme'
import { Icon, IconFilled } from 'components/Icon'

interface Props {
  text: string
  icon: string
  iconFilled?: boolean
  onPress?: (e: GestureResponderEvent) => void
  useTheme?: boolean
  disabled?: boolean
}

const ModalButton = ({
  text,
  icon,
  iconFilled = false,
  onPress,
  useTheme: th = false,
  disabled = false,
}: Props) => {
  const theme = useTheme()

  const color = disabled
    ? th
      ? theme.scheme.primary.slice(0, 7) + '66'
      : theme.foregroundAlt
    : th
    ? theme.scheme.primary
    : theme.foreground

  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 8,
        gap: 16,
      }}
      android_ripple={{ color: th ? theme.scheme.ripple : theme.ripple }}
      disabled={disabled}
    >
      {iconFilled ? (
        <IconFilled
          name={icon}
          style={{
            color: color,
            fontSize: 24,
          }}
        />
      ) : (
        <Icon
          name={icon}
          style={{
            color: color,
            fontSize: 24,
          }}
        />
      )}
      <Text
        style={{
          color: color,
          fontFamily: theme.font500,
          fontSize: 20,
        }}
      >
        {text}
      </Text>
    </Pressable>
  )
}

export default ModalButton
