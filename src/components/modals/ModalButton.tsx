import { GestureResponderEvent, Pressable, Text } from 'react-native'
import useTheme from 'hooks/useTheme'
import { Icon, IconFilled } from 'components/Icon'

interface Props {
  text: string
  icon: string
  iconFilled?: boolean
  onPress?: (e: GestureResponderEvent) => void
  disabled?: boolean
}

const ModalButton = ({
  text,
  icon,
  iconFilled = false,
  onPress,
  disabled = false,
}: Props) => {
  const theme = useTheme()

  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 8,
        gap: 16,
      }}
      android_ripple={{ color: theme.ripple }}
      disabled={disabled}
    >
      {iconFilled ? (
        <IconFilled
          name={icon}
          style={{
            color: disabled ? theme.foregroundAlt : theme.foreground,
            fontSize: 24,
          }}
        />
      ) : (
        <Icon
          name={icon}
          style={{
            color: disabled ? theme.foregroundAlt : theme.foreground,
            fontSize: 24,
          }}
        />
      )}
      <Text
        style={{
          color: disabled ? theme.foregroundAlt : theme.foreground,
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
