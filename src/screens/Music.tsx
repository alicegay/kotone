import { ScrollView, Text, View } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import MusicStack from 'types/MusicStack'
import useTheme from 'hooks/useTheme'
import Button from 'components/Button'
import InnerScreen from 'components/InnerScreen'
import useLatest from 'api/useLatest'
import useLibrary from 'hooks/useLibrary'
import { FlashList } from '@shopify/flash-list'
import TrackListItem from 'components/TrackListItem'
import SquareListItem from 'components/SquareListItem'

const Music = ({
  navigation,
}: NativeStackScreenProps<MusicStack, 'MusicHome'>) => {
  const library = useLibrary()
  const theme = useTheme()

  const musicView =
    library.viewIDs && 'music' in library.viewIDs ? library.viewIDs.music : null

  const latest = useLatest(musicView, { Limit: 50 }, !!musicView)

  return (
    <InnerScreen title="Home" showBackButton={false}>
      <View style={{ flex: 1 }}>
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

        <ScrollView>
          {!latest.isLoading && !!latest.data && (
            <View>
              <Text
                style={{
                  color: theme.scheme.primary,
                  fontFamily: theme.font700,
                  fontSize: 20,
                  paddingHorizontal: 16,
                }}
              >
                Recently Added
              </Text>
              <FlashList
                data={latest.data}
                estimatedItemSize={144}
                keyExtractor={(item) => item.Id}
                renderItem={({ item }) => (
                  <SquareListItem
                    item={item}
                    onPress={() => {
                      navigation.push('Album', { album: item })
                    }}
                    style={{ margin: 8 }}
                  />
                )}
                horizontal={true}
                contentContainerStyle={{ paddingHorizontal: 8 }}
              />
            </View>
          )}
        </ScrollView>
      </View>
    </InnerScreen>
  )
}

export default Music
