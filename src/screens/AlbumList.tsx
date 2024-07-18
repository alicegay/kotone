import { useState } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { FlashList } from '@shopify/flash-list'
import { useQueryClient } from '@tanstack/react-query'
import ItemsQuery from 'jellyfin-api/lib/types/queries/ItemsQuery'

import MusicStack from 'types/MusicStack'
import TrackListItem from 'components/TrackListItem'
import usePlayer from 'hooks/usePlayer'
import useLibrary from 'hooks/useLibrary'
import EndOfList from 'components/EndOfList'
import InnerScreen from 'components/InnerScreen'
import useItems from 'api/useItems'
import { Album, Playlist } from 'types/ItemTypes'
import AlbumModal from 'components/modals/AlbumModal'

const AlbumList = ({
  navigation,
  route,
}: NativeStackScreenProps<MusicStack, 'AlbumList'>) => {
  const { type } = route.params
  const queryClient = useQueryClient()
  const library = useLibrary()

  const [albumModal, setAlbumModal] = useState<Album | Playlist>(null)
  const [showAlbumModal, setShowAlbumModal] = useState<boolean>(false)

  const titles = {
    albums: 'Albums',
    playlists: 'Playlists',
  }
  const footers = {
    albums: 'albums',
    playlists: 'playlists',
  }

  const params: { [key: string]: ItemsQuery } = {
    albums: {
      ParentId: library.viewIDs.music,
      SortBy: 'Name',
      SortOrder: 'Ascending',
      IncludeItemTypes: 'MusicAlbum',
      Recursive: true,
    },
    playlists: {
      ParentId: library.viewIDs.playlists,
      SortBy: 'IsFolder,Name',
      SortOrder: 'Ascending',
    },
  }

  const { data, isLoading, isFetching } = useItems(params[type])

  return (
    <>
      <InnerScreen title={titles[type]}>
        {!isLoading && data && (
          <FlashList
            data={data.Items}
            estimatedItemSize={56}
            keyExtractor={(item, index) => index + '_' + item.Id}
            renderItem={({ item }) => (
              <TrackListItem
                track={item}
                onPress={() => {
                  navigation.push('Album', { album: item })
                }}
                onLongPress={() => {
                  setAlbumModal(
                    item.Type !== 'Playlist'
                      ? (item as Album)
                      : (item as Playlist),
                  )
                  setShowAlbumModal(true)
                }}
                showDuration={false}
                showArtist={item.Type !== 'Playlist'}
              />
            )}
            ListFooterComponent={<EndOfList text={'End of ' + footers[type]} />}
            refreshing={isLoading || isFetching}
            onRefresh={() => {
              queryClient.invalidateQueries({
                queryKey: ['items', params[type]],
              })
            }}
          />
        )}
      </InnerScreen>

      <AlbumModal
        visible={showAlbumModal}
        onClose={() => setShowAlbumModal(false)}
        album={albumModal}
        navigation={navigation}
      />
    </>
  )
}

export default AlbumList
