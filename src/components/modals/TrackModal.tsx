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
import QueueStack from 'types/QueueStack'
import { Dispatch, SetStateAction } from 'react'
import { playlists } from 'jellyfin-api'
import useClient from 'hooks/useClient'
import { AxiosError } from 'axios'

interface Props {
  visible: boolean
  onClose: () => void
  track: Track
  queue?: boolean
  index?: number
  navigation:
    | NativeStackNavigationProp<MusicStack>
    | NativeStackNavigationProp<QueueStack>
  setPlaylistModal: Dispatch<SetStateAction<string[]>>
  setShowPlaylistModal: Dispatch<SetStateAction<boolean>>
  removePlaylist?: string
}

const TrackModal = ({
  visible,
  onClose,
  track,
  queue = false,
  index,
  navigation,
  setPlaylistModal,
  setShowPlaylistModal,
  removePlaylist,
}: Props) => {
  const client = useClient()
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
            <TrackListItem
              track={track}
              playing={false}
              showArtist={false}
              showDuration={false}
            />
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

            {removePlaylist ? (
              <ModalButton
                text="Remove from playlist"
                icon="playlist_remove"
                onPress={() => {
                  onClose()
                  playlists
                    .remove(client.api, removePlaylist, [track.Id])
                    .catch((error: AxiosError) => {
                      if (error.status === 403) console.log('Permission denied')
                    })
                }}
              />
            ) : (
              <ModalButton
                text="Add to playlist"
                icon="playlist_add"
                onPress={() => {
                  onClose()
                  setPlaylistModal([track.Id])
                  setShowPlaylistModal(true)
                }}
              />
            )}

            <Separator />

            <ModalButton
              text="View album"
              icon="album"
              onPress={() => {
                onClose()
                // @ts-ignore
                navigation.push('Album', { album: track.AlbumId })
              }}
              disabled={!track.Album}
            />

            <ModalButton
              text="View artist"
              icon="artist"
              iconFilled={true}
              onPress={() => {
                onClose()
                // @ts-ignore
                navigation.push('Artist', { artist: track.AlbumArtists[0].Id })
              }}
              //disabled={true}
            />
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default TrackModal
