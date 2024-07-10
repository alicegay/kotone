import { Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import useClient from 'hooks/useClient'
import useTheme from 'hooks/useTheme'
import useItems from 'api/useItems'
import TrackListItem from 'components/TrackListItem'
import usePlayer from 'hooks/usePlayer'
import Button from 'components/Button'

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
          //gap: 8,
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
        {!tracks.isLoading &&
          tracks.data.Items.map((item, i) => (
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
          ))}

        <View
          style={{
            paddingHorizontal: 16,
            paddingBottom: 8,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              color: theme.foreground,
              fontFamily: theme.font700,
              fontSize: 24,
            }}
          >
            Queue
          </Text>
          <Button
            onPress={() => {
              player.clearQueue()
            }}
          >
            Clear
          </Button>
        </View>
        {player.hasHydrated &&
          player.queue.map((item, i) => (
            <TrackListItem
              key={item.Id}
              track={item}
              onPress={() => {
                player.setTrack(i)
              }}
            />
          ))}
      </View>
    </View>
  )
}

export default Home
