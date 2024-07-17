import { GestureResponderEvent, Pressable, Text, View } from 'react-native'

import useTheme from 'hooks/useTheme'
import { Icon, IconFilled } from './Icon'
import { ReactNode } from 'react'

interface Props {
  title: string
  description?: string
  icon: string
  filled?: boolean
  right?: ReactNode
  onPress?: (e: GestureResponderEvent) => void
}

const SettingsList = ({
  title,
  description,
  icon,
  filled = false,
  right,
  onPress,
}: Props) => {
  const theme = useTheme()

  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 4,
        gap: 16,
      }}
      android_ripple={{
        color: theme.scheme.ripple,
      }}
    >
      {filled ? (
        <IconFilled
          name={icon}
          style={{
            color: theme.scheme.primary,
            fontSize: 24,
            width: 24,
          }}
        />
      ) : (
        <Icon
          name={icon}
          style={{
            color: theme.scheme.primary,
            fontSize: 24,
            width: 24,
          }}
        />
      )}
      <View
        style={{
          flexGrow: 1,
          flexShrink: 1,
          height: 48,
          justifyContent: 'center',
        }}
      >
        <Text
          style={{
            color: theme.scheme.primary,
            fontFamily: theme.font500,
            fontSize: 16,
          }}
        >
          {title}
        </Text>
        {!!description && (
          <Text
            style={{
              color: theme.scheme.primary,
              fontFamily: theme.font400,
              fontSize: 14,
            }}
          >
            {description}
          </Text>
        )}
      </View>
      {!!right && right}
    </Pressable>
  )
}

export default SettingsList
