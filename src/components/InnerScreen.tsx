import { GestureResponderEvent, Pressable, Text, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import useTheme, { Scheme } from 'hooks/useTheme'
import { Icon } from './Icon'
import { ReactNode } from 'react'
import LinearGradient from 'react-native-linear-gradient'

interface Props {
  children?: ReactNode
  title?: string
  showBackButton?: boolean
  icon?: string
  onPress?: (e: GestureResponderEvent) => void
  scheme?: Scheme
}

const InnerScreen = ({
  children,
  title,
  showBackButton = true,
  icon,
  onPress,
  scheme,
}: Props) => {
  const theme = useTheme()
  const insets = useSafeAreaInsets()
  const navigation = useNavigation()

  const mainTheme = theme.tint === theme.dTint && theme.dark && !scheme

  const gradient1 = mainTheme
    ? theme.dG1
    : scheme
    ? scheme.primaryContainer
    : theme.scheme.primaryContainer
  const gradient2 = mainTheme
    ? theme.dG2
    : scheme
    ? scheme.background
    : theme.scheme.background

  return (
    <LinearGradient
      style={{
        flex: 1,
        backgroundColor: gradient1,
      }}
      colors={[gradient1, gradient2]}
      useAngle={true}
      angle={140}
      angleCenter={{ x: 0.5, y: 0.5 }}
    >
      <View
        style={{
          flex: 1,
          paddingTop: insets.top + 8,
        }}
      >
        <View
          style={{
            paddingHorizontal: 16,
            paddingBottom: 16,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 16,
            justifyContent: 'space-between',
          }}
        >
          {showBackButton && (
            <Pressable
              style={{
                width: 32,
                height: 32,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              android_ripple={{
                color: scheme ? scheme.ripple : theme.scheme.ripple,
                borderless: true,
                foreground: true,
              }}
              onPress={() => {
                navigation.goBack()
              }}
            >
              <Icon
                name="arrow_back"
                style={{
                  color: scheme ? scheme.primary : theme.scheme.primary,
                  fontSize: 24,
                }}
              />
            </Pressable>
          )}
          {!!title && (
            <Text
              style={{
                color: scheme ? scheme.primary : theme.scheme.primary,
                fontFamily: theme.font700,
                fontSize: 24,
                flexGrow: 1,
                flexShrink: 1,
              }}
              numberOfLines={1}
            >
              {title}
            </Text>
          )}
          {!!icon && (
            <Pressable
              style={{
                width: 32,
                height: 32,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              android_ripple={{
                color: scheme ? scheme.ripple : theme.scheme.ripple,
                borderless: true,
                foreground: true,
              }}
              onPress={onPress}
            >
              <Icon
                name={icon}
                style={{
                  color: scheme ? scheme.primary : theme.scheme.primary,
                  fontSize: 24,
                }}
              />
            </Pressable>
          )}
        </View>
        {children}
      </View>
    </LinearGradient>
  )
}

export default InnerScreen
