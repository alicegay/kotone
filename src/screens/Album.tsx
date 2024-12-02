import { useState } from 'react'
import { Pressable, Text, useWindowDimensions, View } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { FlashList } from '@shopify/flash-list'
import { FasterImageView } from '@candlefinance/faster-image'
import tinycolor from 'tinycolor2'

import useClient from 'hooks/useClient'
import MusicStack from 'types/MusicStack'
import TrackListItem from 'components/TrackListItem'
import usePlayer from 'hooks/usePlayer'
import TrackModal from 'components/modals/TrackModal'
import EndOfList from 'components/EndOfList'
import InnerScreen from 'components/InnerScreen'
import useItems from 'api/useItems'
import sameAlbumArtists from 'lib/sameAlbumArtists'
import useSingleItem from 'api/useSingleItem'
import AlbumModal from 'components/modals/AlbumModal'
import { Album, Track } from 'types/ItemTypes'
import useTheme from 'hooks/useTheme'
import { Blurhash } from 'react-native-blurhash'
import getTheme from 'lib/getTheme'
import { Icon, IconFilled } from 'components/Icon'
import PlaylistModal from 'components/modals/PlaylistModal'
import useSettings from 'hooks/useSettings'

const Albums = ({
  navigation,
  route,
}: NativeStackScreenProps<MusicStack, 'Album'>) => {
  const { album: albumParam } = route.params

  const client = useClient()
  const player = usePlayer()
  const theme = useTheme()
  const settings = useSettings()
  const { width } = useWindowDimensions()

  const albumQuery = useSingleItem(
    typeof albumParam === 'string' ? albumParam : albumParam.Id,
  )

  const album = typeof albumParam === 'string' ? albumQuery.data : albumParam
  const playlist = album?.Type === 'Playlist'

  const params = {
    ParentId: typeof albumParam === 'string' ? albumParam : albumParam.Id,
    SortBy: playlist ? undefined : 'ParentIndexNumber,IndexNumber,Name',
    Fields: 'MediaSources',
  }
  const { data, isLoading } = useItems(
    params,
    typeof albumParam === 'string' && !albumQuery.data ? false : true,
  )

  const [trackModal, setTrackModal] = useState<Track>(null)
  const [showTrackModal, setShowTrackModal] = useState<boolean>(false)

  const [albumModal, setAlbumModal] = useState<Album>(null)
  const [showAlbumModal, setShowAlbumModal] = useState<boolean>(false)

  const [playlistModal, setPlaylistModal] = useState<string[]>(null)
  const [showPlaylistModal, setShowPlaylistModal] = useState<boolean>(false)

  const image = client.server + '/Items/' + album?.Id + '/Images/Primary'

  const blurhash = album
    ? 'Primary' in album?.ImageBlurHashes
      ? album?.ImageBlurHashes.Primary[
          'Primary' in album?.ImageTags
            ? album?.ImageTags.Primary
            : album?.AlbumPrimaryImageTag
        ]
      : null
    : null
  const average = blurhash
    ? tinycolor(Blurhash.getAverageColor(blurhash)).toHex8String()
    : null
  const scheme = !average ? theme.scheme : getTheme(average, theme.dark)

  return (
    <>
      <InnerScreen
        icon="more_horiz"
        scheme={scheme}
        onPress={() => {
          setAlbumModal(album as Album)
          setShowAlbumModal(true)
        }}
      >
        {!isLoading && !!data && (
          <FlashList
            data={data.Items}
            extraData={scheme}
            estimatedItemSize={56}
            keyExtractor={(item, index) => index + '_' + item.Id}
            renderItem={({ item, index }) => (
              <TrackListItem
                track={item}
                trackNumber={!playlist && item.IndexNumber}
                showAlbumArt={playlist}
                showArtist={playlist || !sameAlbumArtists(item)}
                showLike={settings.showLikes}
                onPress={() => {
                  player.setQueue(data.Items, index)
                  player.play()
                }}
                onLongPress={() => {
                  setTrackModal(item as Track)
                  setShowTrackModal(true)
                }}
                scheme={scheme}
              />
            )}
            ListFooterComponent={
              <EndOfList
                text={playlist ? 'End of playlist' : 'End of album'}
                scheme={scheme}
              />
            }
            ListHeaderComponent={
              <View
                style={{
                  paddingHorizontal: 16,
                  gap: 8,
                  paddingBottom: 16,
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                  }}
                >
                  <View
                    style={{
                      width: width / 2,
                      height: width / 2,
                      borderRadius: 16,
                      overflow: 'hidden',
                      backgroundColor: scheme.primaryContainer,
                    }}
                  >
                    <FasterImageView
                      source={{
                        url: image,
                        resizeMode: 'cover',
                        blurhash: blurhash,
                      }}
                      style={{
                        width: '100%',
                        height: '100%',
                      }}
                    />
                  </View>
                  <View style={{ gap: 16 }}>
                    <Pressable
                      android_ripple={{
                        color: scheme.ripple,
                        foreground: true,
                        borderless: true,
                      }}
                      style={{
                        width: 32,
                        height: 32,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      onPress={() => {
                        player.setQueue(
                          [...data.Items].sort(() => Math.random() - 0.5),
                        )
                        player.play()
                      }}
                    >
                      <Icon
                        name="shuffle"
                        style={{ color: scheme.primary, fontSize: 24 }}
                      />
                    </Pressable>
                    <Pressable
                      android_ripple={{
                        color: scheme.ripple,
                        foreground: true,
                        borderless: true,
                      }}
                      style={{
                        width: 32,
                        height: 32,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      onPress={() => {
                        player.setQueue(data.Items)
                        player.play()
                      }}
                    >
                      <IconFilled
                        name="play_arrow"
                        style={{ color: scheme.primary, fontSize: 24 }}
                      />
                    </Pressable>
                  </View>
                </View>
                <Text
                  style={{
                    color: scheme.primary,
                    fontFamily: theme.font700,
                    fontSize: 24,
                  }}
                  numberOfLines={2}
                >
                  {album?.Name}
                </Text>
                {album?.Type !== 'Playlist' && (
                  <Text
                    style={{
                      color: scheme.secondary,
                      fontFamily: theme.font700,
                      fontSize: 18,
                    }}
                    numberOfLines={1}
                  >
                    {album?.AlbumArtist}
                  </Text>
                )}
              </View>
            }
          />
        )}
      </InnerScreen>

      <TrackModal
        visible={showTrackModal}
        onClose={() => setShowTrackModal(false)}
        track={trackModal}
        navigation={navigation}
        setPlaylistModal={setPlaylistModal}
        setShowPlaylistModal={setShowPlaylistModal}
        removePlaylist={playlist ? album?.Id : null}
      />

      <AlbumModal
        visible={showAlbumModal}
        onClose={() => setShowAlbumModal(false)}
        album={albumModal}
        navigation={navigation}
      />

      <PlaylistModal
        visible={showPlaylistModal}
        onClose={() => setShowPlaylistModal(false)}
        tracks={playlistModal}
      />
    </>
  )
}

export default Albums
