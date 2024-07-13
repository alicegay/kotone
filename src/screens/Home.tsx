import { useState } from 'react'
import { Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { FlashList } from '@shopify/flash-list'
import Item from 'jellyfin-api/lib/types/media/Item'

import useClient from 'hooks/useClient'
import useTheme from 'hooks/useTheme'
import useItems from 'api/useItems'
import TrackListItem from 'components/TrackListItem'
import usePlayer from 'hooks/usePlayer'
import Button from 'components/Button'
import TrackModal from 'components/modals/TrackModal'
import EndOfList from 'components/EndOfList'

const Home = () => {
  const client = useClient()
  const theme = useTheme()
  const player = usePlayer()
  const insets = useSafeAreaInsets()

  const [trackModal, setTrackModal] = useState<Item>(null)

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
    <>
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
                    //player.addQueue([item])
                    setTrackModal(item)
                  }}
                />
              )}
              contentContainerStyle={{ paddingBottom: 64 + 32 }}
              ListFooterComponent={<EndOfList text="End of favorites" />}
            />
          )}
        </View>
      </View>

      <TrackModal
        visible={!!trackModal}
        onClose={() => setTrackModal(null)}
        track={trackModal}
      />
    </>
  )
}

export default Home
