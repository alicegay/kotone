import { FlatList, RefreshControl, ScrollView, View } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

import MusicStack from 'types/MusicStack'
import useTheme from 'hooks/useTheme'
import Button from 'components/Button'
import InnerScreen from 'components/InnerScreen'
import useLatest from 'api/useLatest'
import useLibrary from 'hooks/useLibrary'
import SquareListItem from 'components/SquareListItem'
import useItems from 'api/useItems'
import TrackListItem from 'components/TrackListItem'
import useSettings from 'hooks/useSettings'
import CenterLoading from 'components/CenterLoading'
import HomeHeader from 'components/HomeHeader'
import usePlayer from 'hooks/usePlayer'
import TrackModal from 'components/modals/TrackModal'
import AlbumModal from 'components/modals/AlbumModal'
import PlaylistModal from 'components/modals/PlaylistModal'
import { useState } from 'react'
import { Album, Track } from 'types/ItemTypes'
import { useQueryClient } from '@tanstack/react-query'

const Music = ({
  navigation,
}: NativeStackScreenProps<MusicStack, 'MusicHome'>) => {
  const player = usePlayer()
  const library = useLibrary()
  const settings = useSettings()
  const theme = useTheme()
  const queryClient = useQueryClient()

  const musicView =
    library.viewIDs && 'music' in library.viewIDs ? library.viewIDs.music : null
  const playlistView =
    library.viewIDs && 'playlists' in library.viewIDs
      ? library.viewIDs.playlists
      : null

  const playlists = useItems(
    {
      ParentId: playlistView,
      SortBy: 'PlayCount,SortName',
      SortOrder: 'Descending',
      Limit: 2,
    },
    !!playlistView,
  )
  const frequent = useItems({
    SortBy: 'PlayCount',
    SortOrder: 'Descending',
    IncludeItemTypes: 'Audio',
    Recursive: true,
    Filter: 'IsPlayed',
    Limit: 2,
    Fields: 'MediaSources',
  })
  const recentlyPlayed = useItems(
    {
      SortBy: 'DatePlayed',
      SortOrder: 'Descending',
      IncludeItemTypes: 'Audio',
      Recursive: true,
      Filter: 'IsPlayed',
      Limit: 2,
      Fields: 'MediaSources',
    },
    !!musicView,
  )
  const recentlyAdded = useLatest(musicView, { Limit: 50 }, !!musicView)

  const [trackModal, setTrackModal] = useState<Track>(null)
  const [showTrackModal, setShowTrackModal] = useState<boolean>(false)

  const [albumModal, setAlbumModal] = useState<Album>(null)
  const [showAlbumModal, setShowAlbumModal] = useState<boolean>(false)

  const [playlistModal, setPlaylistModal] = useState<string[]>(null)
  const [showPlaylistModal, setShowPlaylistModal] = useState<boolean>(false)

  return (
    <>
      <InnerScreen title="Home" showBackButton={false}>
        {!playlists.isLoading &&
        !!playlists.data &&
        !frequent.isLoading &&
        !!frequent.data &&
        !recentlyPlayed.isLoading &&
        !!recentlyPlayed.data &&
        !recentlyAdded.isLoading &&
        !!recentlyAdded.data ? (
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={
                  playlists.isLoading ||
                  playlists.isFetching ||
                  frequent.isLoading ||
                  frequent.isFetching ||
                  recentlyPlayed.isLoading ||
                  recentlyPlayed.isFetching ||
                  recentlyAdded.isLoading ||
                  recentlyAdded.isFetching
                }
                onRefresh={() => {
                  queryClient.invalidateQueries()
                }}
              />
            }
          >
            <View
              style={{
                gap: 16,
                paddingBottom: 64 + 32,
              }}
            >
              <View>
                <HomeHeader
                  title="Playlists"
                  onPress={() => {
                    navigation.push('AlbumList', { type: 'playlists' })
                  }}
                />
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                  }}
                >
                  {playlists.data.Items.map((item) => (
                    <View style={{ width: '50%' }} key={item.Id}>
                      <TrackListItem
                        track={item}
                        onPress={() => {
                          navigation.push('Album', { album: item })
                        }}
                        onLongPress={() => {
                          setAlbumModal(item as Album)
                          setShowAlbumModal(true)
                        }}
                        showDuration={false}
                        scheme={theme.scheme}
                      />
                    </View>
                  ))}
                </View>
              </View>

              <View>
                <HomeHeader
                  title="Frequently Played"
                  onPress={() => {
                    navigation.push('SongList', { type: 'frequent' })
                  }}
                />
                {frequent.data.Items.map((item) => (
                  <TrackListItem
                    key={item.Id}
                    track={item}
                    onPress={() => {
                      player.setQueue([item])
                      player.play()
                    }}
                    onLongPress={() => {
                      setTrackModal(item as Track)
                      setShowTrackModal(true)
                    }}
                    showDuration
                    showLike={settings.showLikes}
                    scheme={theme.scheme}
                  />
                ))}
              </View>

              <View>
                <HomeHeader
                  title="Recently Played"
                  onPress={() => {
                    navigation.push('SongList', { type: 'recent' })
                  }}
                />
                {recentlyPlayed.data.Items.map((item) => (
                  <TrackListItem
                    key={item.Id}
                    track={item}
                    onPress={() => {
                      player.setQueue([item])
                      player.play()
                    }}
                    onLongPress={() => {
                      setTrackModal(item as Track)
                      setShowTrackModal(true)
                    }}
                    showDuration
                    showLike={settings.showLikes}
                    scheme={theme.scheme}
                  />
                ))}
              </View>

              <View>
                <HomeHeader title="Recently Added" />
                <FlatList
                  data={recentlyAdded.data}
                  keyExtractor={(item) => item.Id}
                  renderItem={({ item }) => (
                    <SquareListItem
                      item={item}
                      onPress={() => {
                        navigation.push('Album', { album: item })
                      }}
                      onLongPress={() => {
                        setAlbumModal(item as Album)
                        setShowAlbumModal(true)
                      }}
                      style={{ padding: 8 }}
                    />
                  )}
                  horizontal={true}
                  contentContainerStyle={{ paddingHorizontal: 8 }}
                />
              </View>

              <View style={{ paddingHorizontal: 16, gap: 8 }}>
                <Button
                  onPress={() => {
                    navigation.push('SongList', { type: 'songs' })
                  }}
                >
                  All Songs
                </Button>
                <Button
                  onPress={() => {
                    navigation.push('SongList', { type: 'favorites' })
                  }}
                >
                  All Favorites
                </Button>
                <Button
                  onPress={() => {
                    navigation.push('AlbumList', { type: 'albums' })
                  }}
                >
                  All Albums
                </Button>
                {/* <Button
                  onPress={() => {
                    navigation.push('SongList', { type: 'musicvideos' })
                  }}
                >
                  Music Videos
                </Button> */}
              </View>
            </View>
          </ScrollView>
        ) : (
          <CenterLoading />
        )}
      </InnerScreen>

      <TrackModal
        visible={showTrackModal}
        onClose={() => setShowTrackModal(false)}
        track={trackModal}
        navigation={navigation}
        setPlaylistModal={setPlaylistModal}
        setShowPlaylistModal={setShowPlaylistModal}
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

export default Music
