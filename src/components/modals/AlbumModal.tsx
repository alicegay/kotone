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
import useItems from 'api/useItems'
import { Album, Playlist } from 'types/ItemTypes'
import SearchStack from 'types/SearchStack'

interface Props {
  visible: boolean
  onClose: () => void
  album: Album | Playlist
  navigation:
    | NativeStackNavigationProp<MusicStack>
    | NativeStackNavigationProp<SearchStack>
}

const AlbumModal = ({ visible, onClose, album, navigation }: Props) => {
  const player = usePlayer()
  const theme = useTheme()
  const { height } = useWindowDimensions()
  const insets = useSafeAreaInsets()

  const list = useItems(
    {
      ParentId: !!album ? album.Id : null,
      SortBy:
        !!album && album.Type === 'Playlist'
          ? undefined
          : 'ParentIndexNumber,IndexNumber,Name',
      Fields: 'MediaSources',
    },
    !!album,
  )

  if (!album) return null

  const blurhash =
    'Primary' in album.ImageBlurHashes
      ? album.ImageBlurHashes.Primary[
          'Primary' in album.ImageTags ? album.ImageTags.Primary : null
        ]
      : null

  const playlist = album.Type === 'Playlist'

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
              track={album}
              playing={false}
              showDuration={!album}
            />
            <ModalButton
              text={playlist ? 'Play playlist' : 'Play album'}
              icon="play_arrow"
              iconFilled={true}
              onPress={() => {
                player.setQueue(list.data?.Items)
                player.play()
                onClose()
              }}
              disabled={list.isLoading || !list.data}
            />
            <ModalButton
              text={playlist ? 'Shuffle playlist' : 'Shuffle album'}
              icon="shuffle"
              onPress={() => {
                player.setQueue(
                  [...list.data?.Items].sort(() => Math.random() - 0.5),
                )
                player.play()
                onClose()
              }}
              disabled={list.isLoading || !list.data}
            />
            <ModalButton
              text="Play next"
              icon="playlist_play"
              onPress={() => {
                player.nextQueue(list.data?.Items)
                onClose()
              }}
              disabled={(album && list.isLoading) || (album && !list.data)}
            />
            <ModalButton
              text="Add to queue"
              icon="playlist_add"
              onPress={() => {
                player.addQueue(list.data?.Items)
                onClose()
              }}
              disabled={(album && list.isLoading) || (album && !list.data)}
            />

            <Separator />

            <ModalButton
              text="Add to playlist"
              icon="playlist_add"
              onPress={() => {}}
              disabled={true}
            />

            {!playlist && (
              <>
                <Separator />

                <ModalButton
                  text="View album"
                  icon="album"
                  onPress={() => {
                    onClose()
                    // @ts-ignore
                    navigation.push('Album', { album: album.Id })
                  }}
                />

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

export default AlbumModal
