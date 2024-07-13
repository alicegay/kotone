import { Text, View } from 'react-native'
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import DragList from 'react-native-draglist'

import TabStack from 'types/TabStack'
import useClient from 'hooks/useClient'
import usePlayer from 'hooks/usePlayer'
import useTheme from 'hooks/useTheme'
import Button from 'components/Button'
import TrackListItem from 'components/TrackListItem'
import EndOfList from 'components/EndOfList'

const Queue = ({ navigation }: BottomTabScreenProps<TabStack, 'Queue'>) => {
  const client = useClient()
  const theme = useTheme()
  const player = usePlayer()
  const insets = useSafeAreaInsets()

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <View
        style={{
          flex: 1,
          paddingTop: insets.top + 8,
        }}
      >
        <View
          style={{
            paddingHorizontal: 16,
            paddingBottom: 16,
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
          <DragList
            data={player.queue}
            extraData={player.track}
            keyExtractor={(item, index) => index + '_' + item.Id}
            renderItem={({ item, index, isActive, onDragStart, onDragEnd }) => (
              <TrackListItem
                track={item}
                onPress={() => {
                  player.setTrack(index)
                }}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
                isDragging={isActive}
                playing={index === player.track}
              />
            )}
            onReordered={(fromIndex, toIndex) => {
              player.moveQueue(fromIndex, toIndex)
            }}
            //initialScrollIndex={player.track}
            //estimatedItemSize={56}
            //itemsSize={56}
            contentContainerStyle={{ paddingBottom: 64 + 32 }}
            ListFooterComponent={<EndOfList text="End of queue" />}
          />
        )}
      </View>
    </View>
  )
}

export default Queue
