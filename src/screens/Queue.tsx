import { useState } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import DragList from 'react-native-draglist'

import QueueStack from 'types/QueueStack'
import usePlayer from 'hooks/usePlayer'
import useTheme from 'hooks/useTheme'
import TrackListItem from 'components/TrackListItem'
import EndOfList from 'components/EndOfList'
import InnerScreen from 'components/InnerScreen'
import TrackModal from 'components/modals/TrackModal'
import QueueModal from 'components/modals/QueueModal'
import { Track } from 'types/ItemTypes'

const Queue = ({
  navigation,
}: NativeStackScreenProps<QueueStack, 'QueueHome'>) => {
  const theme = useTheme()
  const player = usePlayer()
  const insets = useSafeAreaInsets()

  const [trackModal, setTrackModal] = useState<Track>(null)
  const [trackIndex, setTrackIndex] = useState<number>(0)
  const [showTrackModal, setShowTrackModal] = useState<boolean>(false)

  const [showQueueModal, setShowQueueModal] = useState<boolean>(false)

  return (
    <>
      <InnerScreen
        title="Queue"
        showBackButton={false}
        icon="more_horiz"
        onPress={() => {
          setShowQueueModal(true)
        }}
      >
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
                  player.play()
                }}
                onLongPress={() => {
                  setTrackModal(item as Track)
                  setTrackIndex(index)
                  setShowTrackModal(true)
                }}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
                isDragging={isActive}
                playing={index === player.track}
                scheme={theme.scheme}
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

      <TrackModal
        visible={showTrackModal}
        onClose={() => setShowTrackModal(false)}
        track={trackModal}
        queue={true}
        index={trackIndex}
        navigation={navigation}
      />

      <QueueModal
        visible={showQueueModal}
        onClose={() => setShowQueueModal(false)}
      />
    </>
  )
}

export default Queue
