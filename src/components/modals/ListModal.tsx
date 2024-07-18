import { useWindowDimensions, View } from 'react-native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import Modal from 'react-native-modal'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import MusicStack from 'types/MusicStack'
import usePlayer from 'hooks/usePlayer'
import useTheme from 'hooks/useTheme'
import ModalButton from './ModalButton'
import { Track } from 'types/ItemTypes'

interface Props {
  visible: boolean
  onClose: () => void
  tracks?: Track[]
  navigation: NativeStackNavigationProp<MusicStack>
}

const ListModal = ({ visible, onClose, tracks, navigation }: Props) => {
  const player = usePlayer()
  const theme = useTheme()
  const { height } = useWindowDimensions()
  const insets = useSafeAreaInsets()

  if (!tracks) return null

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
              text="Play all"
              icon="play_arrow"
              iconFilled={true}
              useTheme={true}
              onPress={() => {
                player.setQueue(tracks)
                player.play()
                onClose()
              }}
            />
            <ModalButton
              text="Shuffle all"
              icon="shuffle"
              useTheme={true}
              onPress={() => {
                player.setQueue([...tracks].sort(() => Math.random() - 0.5))
                player.play()
                onClose()
              }}
            />
            <ModalButton
              text="Play next"
              icon="playlist_play"
              useTheme={true}
              onPress={() => {
                player.nextQueue(tracks)
                onClose()
              }}
            />
            <ModalButton
              text="Add to queue"
              icon="playlist_add"
              useTheme={true}
              onPress={() => {
                player.addQueue(tracks)
                onClose()
              }}
            />
            <ModalButton
              text="Add to playlist"
              icon="playlist_add"
              useTheme={true}
              onPress={() => {}}
              disabled={true}
            />
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default ListModal
