import { Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { FlashList } from '@shopify/flash-list'

import useClient from 'hooks/useClient'
import useTheme from 'hooks/useTheme'
import useItems from 'api/useItems'
import TrackListItem from 'components/TrackListItem'
import usePlayer from 'hooks/usePlayer'

const Home = () => {
  const client = useClient()
  const theme = useTheme()
  const player = usePlayer()
  const insets = useSafeAreaInsets()

  const tracks = useItems({
    SortBy: 'SortName',
    SortOrder: 'Ascending',
    IncludeItemTypes: 'Audio',
    Recursive: true,
    IsFavorite: true,
    StartIndex: 0,
    Limit: 50,
  })

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <View
        style={{
          flex: 1,
          paddingTop: insets.top,
          paddingBottom: 64 + 32,
        }}
      >
        <View style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
          <Text
            style={{
              color: theme.foreground,
              fontFamily: theme.font700,
              fontSize: 24,
            }}
          >
            Favorite Songs
          </Text>
        </View>
        {!tracks.isLoading && (
          <FlashList
            data={tracks.data.Items}
            estimatedItemSize={56}
            renderItem={({ item }) => (
              <TrackListItem
                key={item.Id}
                track={item}
                onPress={() => {
                  player.setQueue([item])
                  player.play()
                }}
                onLongPress={() => {
                  player.addQueue([item])
                }}
              />
            )}
          />
        )}
      </View>
    </View>
  )
}

export default Home
