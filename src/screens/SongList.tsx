import { useState } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { FlashList } from '@shopify/flash-list'
import { useQueryClient } from '@tanstack/react-query'
import Item from 'jellyfin-api/lib/types/media/Item'
import ItemsQuery from 'jellyfin-api/lib/types/queries/ItemsQuery'

import MusicStack from 'types/MusicStack'
import TrackListItem from 'components/TrackListItem'
import usePlayer from 'hooks/usePlayer'
import useLibrary from 'hooks/useLibrary'
import TrackModal from 'components/modals/TrackModal'
import EndOfList from 'components/EndOfList'
import InnerScreen from 'components/InnerScreen'
import useItems from 'api/useItems'
import { Track } from 'types/ItemTypes'
import ListModal from 'components/modals/ListModal'
import useTheme from 'hooks/useTheme'

const SongList = ({
  navigation,
  route,
}: NativeStackScreenProps<MusicStack, 'SongList'>) => {
  const { type } = route.params
  const queryClient = useQueryClient()
  const player = usePlayer()
  const library = useLibrary()
  const theme = useTheme()

  const [trackModal, setTrackModal] = useState<Track>(null)
  const [showTrackModal, setShowTrackModal] = useState<boolean>(false)

  const [listModal, setListModal] = useState<Track[]>(null)
  const [showListModal, setShowListModal] = useState<boolean>(false)

  const titles = {
    songs: 'Songs',
    favorites: 'Favorites',
    frequent: 'Frequently Played',
    recent: 'Recently Played',
  }
  const footers = {
    songs: 'songs',
    favorites: 'favorites',
    frequent: 'list',
    recent: 'list',
  }

  const params: { [key: string]: ItemsQuery } = {
    songs: {
      SortBy: 'Name',
      SortOrder: 'Ascending',
      IncludeItemTypes: 'Audio',
      Recursive: true,
    },
    favorites: {
      SortBy: 'Name',
      SortOrder: 'Ascending',
      IncludeItemTypes: 'Audio',
      Recursive: true,
      IsFavorite: true,
    },
    frequent: {
      SortBy: 'PlayCount',
      SortOrder: 'Descending',
      IncludeItemTypes: 'Audio',
      Recursive: true,
      Filter: 'IsPlayed',
      Limit: 50,
    },
    recent: {
      SortBy: 'DatePlayed',
      SortOrder: 'Descending',
      IncludeItemTypes: 'Audio',
      Recursive: true,
      Filter: 'IsPlayed',
      Limit: 50,
    },
  }

  const { data, isLoading, isFetching } = useItems(params[type])

  return (
    <>
      <InnerScreen
        title={titles[type]}
        icon="more_horiz"
        onPress={() => {
          setListModal(data?.Items as Track[])
          setShowListModal(true)
        }}
      >
        {!isLoading && data && (
          <FlashList
            data={data.Items}
            estimatedItemSize={56}
            keyExtractor={(item, index) => index + '_' + item.Id}
            renderItem={({ item, index }) => (
              <TrackListItem
                track={item}
                onPress={() => {
                  player.setQueue(data.Items, index)
                  player.play()
                }}
                onLongPress={() => {
                  setTrackModal(item as Track)
                  setShowTrackModal(true)
                }}
                scheme={theme.scheme}
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

      <TrackModal
        visible={showTrackModal}
        onClose={() => setShowTrackModal(false)}
        track={trackModal}
        navigation={navigation}
      />

      <ListModal
        visible={showListModal}
        onClose={() => setShowListModal(false)}
        tracks={listModal}
        navigation={navigation}
      />
    </>
  )
}

export default SongList
