import {
  GestureResponderEvent,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { BlurMask, Canvas, Oval } from '@shopify/react-native-skia'

import useTheme, { Scheme } from 'hooks/useTheme'
import { Icon } from './Icon'
import { ReactNode } from 'react'

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
  const { width } = useWindowDimensions()
  const navigation = useNavigation()

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: !!scheme ? scheme.background : theme.scheme.background,
      }}
    >
      <Canvas style={{ position: 'absolute', width: '100%', height: 200 }}>
        <Oval
          x={-(width * 1.5) / 2}
          y={-100}
          width={width * 1.75}
          height={200}
          color={
            !!scheme ? scheme.primaryContainer : theme.scheme.primaryContainer
          }
        >
          <BlurMask blur={32} style="normal" />
        </Oval>
      </Canvas>
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
                color: !!scheme ? scheme.ripple : theme.scheme.ripple,
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
                  color: !!scheme ? scheme.primary : theme.scheme.primary,
                  fontSize: 24,
                }}
              />
            </Pressable>
          )}
          {!!title && (
            <Text
              style={{
                color: !!scheme ? scheme.primary : theme.scheme.primary,
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
                color: !!scheme ? scheme.ripple : theme.scheme.ripple,
                borderless: true,
                foreground: true,
              }}
              onPress={onPress}
            >
              <Icon
                name={icon}
                style={{
                  color: !!scheme ? scheme.primary : theme.scheme.primary,
                  fontSize: 24,
                }}
              />
            </Pressable>
          )}
        </View>
        {children}
      </View>
    </View>
  )
}

export default InnerScreen
