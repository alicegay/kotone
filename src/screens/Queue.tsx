import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Text, View } from 'react-native'

import useClient from 'hooks/useClient'
import usePlayer from 'hooks/usePlayer'
import useTheme from 'hooks/useTheme'
import Button from 'components/Button'
import { FlashList } from '@shopify/flash-list'
import TrackListItem from 'components/TrackListItem'

const Queue = () => {
  const client = useClient()
  const theme = useTheme()
  const player = usePlayer()
  const insets = useSafeAreaInsets()

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <View
        style={{
          flex: 1,
          paddingTop: insets.top,
        }}
      >
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

        {player.hasHydrated && (
          <FlashList
            data={player.queue}
            extraData={player.track}
            renderItem={({ item, index }) => (
              <TrackListItem
                key={index}
                track={item}
                onPress={() => {
                  player.setTrack(index)
                }}
                playing={index === player.track}
              />
            )}
            estimatedItemSize={56}
            contentContainerStyle={{ paddingBottom: 64 + 32 }}
          />
        )}
      </View>
    </View>
  )
}

export default Queue
