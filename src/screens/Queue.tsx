import { Pressable, Text, View } from 'react-native'
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import DragList from 'react-native-draglist'

import TabStack from 'types/TabStack'
import usePlayer from 'hooks/usePlayer'
import useTheme from 'hooks/useTheme'
import TrackListItem from 'components/TrackListItem'
import EndOfList from 'components/EndOfList'
import { Icon } from 'components/Icon'
import InnerScreen from 'components/InnerScreen'

const Queue = ({ navigation }: BottomTabScreenProps<TabStack, 'Queue'>) => {
  const theme = useTheme()
  const player = usePlayer()
  const insets = useSafeAreaInsets()

  return (
    <InnerScreen title="Queue" showBackButton={false} icon="more_horiz">
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
          contentContainerStyle={{ paddingBottom: 64 }}
          ListFooterComponent={<EndOfList text="End of queue" />}
        />
      )}
    </InnerScreen>
  )
}

export default Queue
