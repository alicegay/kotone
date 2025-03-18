import { ReactNode, Ref, useState } from 'react'
import {
  GestureResponderEvent,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import useTheme from 'hooks/useTheme'

interface Props {
  children?: ReactNode
  type?: 'primary'
  icon?: string
  onPress?: (e: GestureResponderEvent) => void
  onLongPress?: (e: GestureResponderEvent) => void
  style?: StyleProp<ViewStyle>
  ref?: Ref<View>
}

const Button = ({
  children,
  type = 'primary',
  icon,
  onPress,
  onLongPress,
  style,
  ref,
}: Props) => {
  const theme = useTheme()
  const [focus, setFocus] = useState(false)

  const styles = StyleSheet.create({
    root: {
      minWidth: 36,
      overflow: 'hidden',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 20,
      minHeight: 36,
      backgroundColor: theme.scheme.primaryContainer,
    },
    rootFocus: {
      backgroundColor: theme.scheme.onPrimaryContainer,
    },
    rootWithLabel: {
      minWidth: 96,
    },
    icon: {
      fontSize: 14,
      color: theme.scheme.onPrimaryContainer,
    },
    iconFocus: {
      color: theme.scheme.primaryContainer,
    },
    iconWithLabel: {
      marginLeft: 16,
      marginRight: -16,
    },
    label: {
      fontFamily: theme.font700,
      fontSize: 14,
      textAlign: 'center',
      marginVertical: 8,
      marginHorizontal: 24,
      color: theme.scheme.onPrimaryContainer,
    },
    labelFocus: {
      color: theme.scheme.primaryContainer,
    },
  })

  return (
    <Pressable
      ref={ref}
      onFocus={() => {
        setFocus(true)
      }}
      onBlur={() => {
        setFocus(false)
      }}
      onPress={onPress}
      onLongPress={onLongPress}
      style={[
        styles.root,
        focus && styles.rootFocus,
        children && styles.rootWithLabel,
        style,
      ]}
    >
      {icon && (
        <Icon
          name={icon}
          style={[
            styles.icon,
            focus && styles.iconFocus,
            children && styles.iconWithLabel,
          ]}
        />
      )}
      {children && (
        <Text
          numberOfLines={1}
          style={[styles.label, focus && styles.labelFocus]}
        >
          {children}
        </Text>
      )}
    </Pressable>
  )
}

export default Button
