import { View } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import MusicStack from 'types/MusicStack'
import useTheme from 'hooks/useTheme'
import Button from 'components/Button'
import InnerScreen from 'components/InnerScreen'

const Music = ({
  navigation,
}: NativeStackScreenProps<MusicStack, 'MusicHome'>) => {
  const theme = useTheme()
  const insets = useSafeAreaInsets()

  return (
    <InnerScreen title="Home" showBackButton={false}>
      <View style={{ paddingHorizontal: 16, gap: 8 }}>
        <Button
          onPress={() => {
            navigation.push('SongList', { type: 'songs' })
          }}
        >
          Songs
        </Button>
        <Button
          onPress={() => {
            navigation.push('SongList', { type: 'favorites' })
          }}
        >
          Favorites
        </Button>
        <Button
          onPress={() => {
            navigation.push('SongList', { type: 'frequent' })
          }}
        >
          Frequently Played
        </Button>
        <Button
          onPress={() => {
            navigation.push('SongList', { type: 'recent' })
          }}
        >
          Recently Played
        </Button>
        <Button
          onPress={() => {
            navigation.push('AlbumList', { type: 'albums' })
          }}
        >
          Albums
        </Button>
        <Button
          onPress={() => {
            navigation.push('AlbumList', { type: 'playlists' })
          }}
        >
          Playlists
        </Button>
      </View>
    </InnerScreen>
  )
}

export default Music
