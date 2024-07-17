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
import useItems from 'api/useItems'

interface Props {
  visible: boolean
  onClose: () => void
  track: Item
  title?: string
  songs?: Item[]
  navigation: NativeStackNavigationProp<MusicStack>
}

const TrackModal = ({
  visible,
  onClose,
  track,
  title,
  songs,
  navigation,
}: Props) => {
  const player = usePlayer()
  const theme = useTheme()
  const { height } = useWindowDimensions()
  const insets = useSafeAreaInsets()

  const list = useItems(
    {
      ParentId: !!track ? track.Id : null,
      SortBy:
        !!track && track.Type === 'Playlist'
          ? undefined
          : 'ParentIndexNumber,IndexNumber,Name',
    },
    (!!track && track.Type === 'MusicAlbum') ||
      (!!track && track.Type === 'Playlist'),
  )

  if (track === null && !songs) return null
  const hasSongs = !!songs

  const blurhash = hasSongs
    ? null
    : 'Primary' in track.ImageBlurHashes
    ? track.ImageBlurHashes.Primary[
        'Primary' in track.ImageTags
          ? track.ImageTags.Primary
          : track.AlbumPrimaryImageTag
      ]
    : null

  const album = hasSongs
    ? false
    : track.Type === 'MusicAlbum' || track.Type === 'Playlist'
  const playlist = hasSongs ? false : track.Type === 'Playlist'

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
            {!hasSongs && (
              <TrackListItem
                track={track}
                useTheme={false}
                playing={false}
                showDuration={!album}
              />
            )}
            <ModalButton
              text={
                !!songs
                  ? 'Play all'
                  : album
                  ? playlist
                    ? 'Play playlist'
                    : 'Play album'
                  : 'Play'
              }
              icon="play_arrow"
              iconFilled={true}
              onPress={() => {
                if (album) {
                  player.setQueue(list.data?.Items)
                } else if (!!songs) {
                  player.setQueue(songs)
                } else if (!hasSongs) {
                  player.setQueue([track])
                }
                player.play()
                onClose()
              }}
              disabled={(album && list.isLoading) || (album && !list.data)}
            />
            {(album || !!songs) && (
              <ModalButton
                text={
                  !!songs
                    ? 'Shuffle all'
                    : playlist
                    ? 'Shuffle playlist'
                    : 'Shuffle album'
                }
                icon="shuffle"
                onPress={() => {
                  if (album) {
                    player.setQueue(
                      [...list.data?.Items].sort(() => Math.random() - 0.5),
                    )
                  } else {
                    player.setQueue([...songs].sort(() => Math.random() - 0.5))
                  }
                  player.play()
                  onClose()
                }}
                disabled={(album && list.isLoading) || (album && !list.data)}
              />
            )}
            <ModalButton
              text="Play next"
              icon="playlist_play"
              onPress={() => {
                if (album) {
                  player.nextQueue(list.data?.Items)
                } else if (!!songs) {
                  player.nextQueue(songs)
                } else if (!hasSongs) {
                  player.nextQueue([track])
                }
                onClose()
              }}
              disabled={(album && list.isLoading) || (album && !list.data)}
            />
            <ModalButton
              text="Add to queue"
              icon="playlist_add"
              onPress={() => {
                if (album) {
                  player.addQueue(list.data?.Items)
                } else if (!!songs) {
                  player.addQueue(songs)
                } else if (!hasSongs) {
                  player.addQueue([track])
                }
                onClose()
              }}
              disabled={(album && list.isLoading) || (album && !list.data)}
            />
            <ModalButton
              text="Add to playlist"
              icon="playlist_add"
              onPress={() => {}}
              disabled={true}
            />

            {!playlist && !hasSongs && (
              <>
                <Separator />

                {!album && (
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
                  disabled={true}
                />
              </>
            )}

            {playlist && (
              <>
                <Separator />

                <ModalButton
                  text="Delete playlist"
                  icon="playlist_remove"
                  onPress={() => {}}
                  disabled={true}
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
