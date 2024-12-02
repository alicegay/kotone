import { useWindowDimensions, View } from 'react-native'
import Modal from 'react-native-modal'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import usePlayer from 'hooks/usePlayer'
import useTheme from 'hooks/useTheme'
import ModalButton from './ModalButton'

interface Props {
  visible: boolean
  onClose: () => void
}

const QueueModal = ({ visible, onClose }: Props) => {
  const player = usePlayer()
  const theme = useTheme()
  const { height } = useWindowDimensions()
  const insets = useSafeAreaInsets()

  return (
    <Modal
      isVisible={visible}
      onBackButtonPress={onClose}
      onBackdropPress={onClose}
      animationIn="fadeInUp"
      animationOut="fadeOutDown"
      animationInTiming={200}
      animationOutTiming={200}
      useNativeDriver={true}
      statusBarTranslucent={true}
      deviceHeight={height + insets.top + insets.bottom}
    >
      <View style={{ paddingHorizontal: 16 }}>
        <View
          style={{
            backgroundColor: theme.scheme.background,
            borderRadius: 16,
            overflow: 'hidden',
          }}
        >
          <View style={{ paddingVertical: 8, gap: 4 }}>
            <ModalButton
              text="Play queue"
              icon="play_arrow"
              iconFilled={true}
              useTheme={true}
              onPress={() => {
                player.setTrack(0)
                player.play()
                onClose()
              }}
              disabled={player.queue.length === 0}
            />
            <ModalButton
              text="Shuffle queue"
              icon="shuffle"
              useTheme={true}
              onPress={() => {
                player.setQueue(
                  [...player.queue].sort(() => Math.random() - 0.5),
                )
                player.setTrack(0)
                player.play()
                onClose()
              }}
              disabled={player.queue.length === 0}
            />

            <ModalButton
              text="Clear queue"
              icon="playlist_remove"
              useTheme={true}
              onPress={() => {
                player.clearQueue()
                onClose()
              }}
              disabled={player.queue.length === 0}
            />
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default QueueModal
