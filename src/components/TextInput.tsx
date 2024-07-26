import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import {
  StyleSheet,
  TextInput as TextInputOrig,
  TextInputProps,
  Pressable,
} from 'react-native'
import useTheme from 'hooks/useTheme'

interface TypeInputHandle extends TextInputOrig {
  focus: () => void | null
  blur: () => void | null
}

const TextInput = forwardRef<Partial<TypeInputHandle>, TextInputProps>(
  ({ style, ...props }: TextInputProps, ref) => {
    useImperativeHandle(ref, () => ({
      focus: () => {
        textRef.current.focus()
      },
      blur: () => {
        textRef.current.blur()
      },
    }))

    const theme = useTheme()

    const [focus, setFocus] = useState(false)
    const textRef = useRef<TextInputOrig>()

    const styles = StyleSheet.create({
      input: {
        backgroundColor: theme.scheme.primaryContainer,
        color: theme.scheme.onPrimaryContainer,
        fontFamily: theme.font500,
        fontSize: 18,
        borderRadius: 32,
        overflow: 'hidden',
        paddingHorizontal: 24,
        paddingVertical: 8,
      },
      focus: {},
    })

    return (
      <Pressable
        // @ts-ignore
        ref={ref}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        onPress={() => textRef.current.focus()}
        style={{ flexGrow: 1, flexShrink: 1 }}
      >
        <TextInputOrig
          ref={textRef}
          placeholderTextColor={
            theme.scheme.onPrimaryContainer.slice(0, 7) + '66'
          }
          {...props}
          style={[styles.input, focus && styles.focus, style]}
        />
      </Pressable>
    )
  },
)

export default TextInput
