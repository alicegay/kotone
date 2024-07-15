import { useWindowDimensions, View } from 'react-native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import Modal from 'react-native-modal'
import { Blurhash } from 'react-native-blurhash'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Item from 'jellyfin-api/lib/types/media/Item'

import MusicStack from 'types/MusicStack'
import usePlayer from 'hooks/usePlayer'
import useTheme from 'hooks/useTheme'
import TrackListItem from 'components/TrackListItem'
import ModalButton from './ModalButton'
import Separator from './Separator'

interface Props {
  visible: boolean
  onClose: () => void
  onPlay: () => void
  track: Item
  navigation: NativeStackNavigationProp<MusicStack>
}

const TrackModal = ({ visible, onClose, onPlay, track, navigation }: Props) => {
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
            backgroundColor: '#222',
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
            <TrackListItem
              track={track}
              playing={false}
              showDuration={track.Type === 'Audio'}
            />
            <ModalButton
              text={
                track.Type === 'MusicAlbum'
                  ? 'Play album'
                  : track.Type === 'Playlist'
                  ? 'Play playlist'
                  : 'Play'
              }
              icon="play_arrow"
              iconFilled={true}
              onPress={() => {
                onPlay()
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
            <ModalButton
              text="Add to playlist"
              icon="playlist_add"
              onPress={() => {}}
            />

            {track.Type !== 'Playlist' && (
              <>
                <Separator />

                {track.Type === 'Audio' && (
                  <ModalButton
                    text="View album"
                    icon="album"
                    onPress={() => {
                      onClose()
                      navigation.push('Album', { album: track.AlbumId })
                    }}
                  />
                )}
                <ModalButton
                  text="View artist"
                  icon="artist"
                  iconFilled={true}
                  onPress={() => {}}
                />
              </>
            )}
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default TrackModal
