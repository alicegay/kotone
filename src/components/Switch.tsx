import { useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, {
  Easing,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

interface Props {
  state: boolean
}

const Switch = ({ state }: Props) => {
  const backgroundStates = ['#000', '#00a000']
  const positionStates = [1, 15]

  const background = useSharedValue(
    state ? backgroundStates[1] : backgroundStates[0],
  )
  const position = useSharedValue(state ? positionStates[1] : positionStates[0])

  useEffect(() => {
    background.value = withTiming(backgroundStates[state ? 1 : 0], {
      duration: 200,
      easing: Easing.out(Easing.exp),
    })
    position.value = withTiming(positionStates[state ? 1 : 0], {
      duration: 200,
      easing: Easing.out(Easing.exp),
    })
  }, [state])

  const styles = StyleSheet.create({
    root: {
      width: 32,
      height: 18,
      borderRadius: 10,
      overflow: 'hidden',
    },
    circle: {
      width: 16,
      height: 16,
      borderRadius: 8,
      overflow: 'hidden',
      backgroundColor: '#fff',
      top: 1,
    },
  })

  return (
    <Animated.View style={[styles.root, { backgroundColor: background }]}>
      <Animated.View style={[styles.circle, { left: position }]} />
    </Animated.View>
  )
}

export default Switch
