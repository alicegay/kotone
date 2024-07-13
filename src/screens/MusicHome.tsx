import { View } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import MusicStack from 'types/MusicStack'
import useTheme from 'hooks/useTheme'
import Button from 'components/Button'
import InnerScreen from 'components/InnerScreen'

const MusicHome = ({
  navigation,
}: NativeStackScreenProps<MusicStack, 'MusicHome'>) => {
  const theme = useTheme()
  const insets = useSafeAreaInsets()

  return (
    <InnerScreen title="Home" showBackButton={false}>
      <View style={{ paddingHorizontal: 16, gap: 8 }}>
        <Button
          onPress={() => {
            navigation.push('Songs')
          }}
        >
          Songs
        </Button>
        <Button
          onPress={() => {
            navigation.push('Favorites')
          }}
        >
          Favorites
        </Button>
        <Button
          onPress={() => {
            navigation.push('Albums')
          }}
        >
          Albums
        </Button>
      </View>
    </InnerScreen>
  )
}

export default MusicHome
