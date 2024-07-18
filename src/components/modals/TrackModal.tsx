import { useWindowDimensions, View } from 'react-native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import Modal from 'react-native-modal'
import { Blurhash } from 'react-native-blurhash'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import MusicStack from 'types/MusicStack'
import usePlayer from 'hooks/usePlayer'
import useTheme from 'hooks/useTheme'
import TrackListItem from 'components/TrackListItem'
import ModalButton from './ModalButton'
import Separator from './Separator'
import { Track } from 'types/ItemTypes'

interface Props {
  visible: boolean
  onClose: () => void
  track: Track
  queue?: boolean
  index?: number
  navigation: NativeStackNavigationProp<MusicStack>
}

const TrackModal = ({
  visible,
  onClose,
  track,
  queue = false,
  index,
  navigation,
}: Props) => {
  const player = usePlayer()
  const theme = useTheme()
  const { height } = useWindowDimensions()
  const insets = useSafeAreaInsets()

  if (!track) return null

  const blurhash =
    'Primary' in track.ImageBlurHashes
      ? track.ImageBlurHashes.Primary[
          'Primary' in track.ImageTags
            ? track.ImageTags.Primary
            : track.AlbumPrimaryImageTag
        ]
      : null

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
            backgroundColor: theme.background,
            borderRadius: 16,
            overflow: 'hidden',
          }}
        >
          {!!blurhash && (
            <>
              <Blurhash
                blurhash={blurhash}
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                }}
              />
              <View
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#0004',
                }}
              />
            </>
          )}
          <View style={{ paddingVertical: 8, gap: 4 }}>
            <TrackListItem track={track} useTheme={false} playing={false} />
            <ModalButton
              text="Play"
              icon="play_arrow"
              iconFilled={true}
              onPress={() => {
                if (queue) {
                  player.setTrack(index)
                } else {
                  player.setQueue([track])
                }
                player.play()
                onClose()
              }}
            />
            <ModalButton
              text="Play next"
              icon="playlist_play"
              onPress={() => {
                player.nextQueue([track])
                onClose()
              }}
            />
            <ModalButton
              text="Add to queue"
              icon="playlist_add"
              onPress={() => {
                player.addQueue([track])
                onClose()
              }}
            />
            {queue && (
              <ModalButton
                text="Remove from queue"
                icon="playlist_remove"
                onPress={() => {
                  player.removeQueue(index)
                  onClose()
                }}
              />
            )}

            <Separator />

            <ModalButton
              text="Add to playlist"
              icon="playlist_add"
              onPress={() => {}}
              disabled={true}
            />

            <Separator />

            <ModalButton
              text="View album"
              icon="album"
              onPress={() => {
                onClose()
                navigation.push('Album', { album: track.AlbumId })
              }}
            />

            <ModalButton
              text="View artist"
              icon="artist"
              iconFilled={true}
              onPress={() => {}}
              disabled={true}
            />
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default TrackModal
