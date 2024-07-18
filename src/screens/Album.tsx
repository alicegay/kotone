import { useState } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { FlashList } from '@shopify/flash-list'
import Item from 'jellyfin-api/lib/types/media/Item'

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

const Albums = ({
  navigation,
  route,
}: NativeStackScreenProps<MusicStack, 'Album'>) => {
  const { album: albumParam } = route.params

  const player = usePlayer()

  const albumQuery = useSingleItem(
    typeof albumParam === 'string' ? albumParam : albumParam.Id,
  )

  const album = typeof albumParam === 'string' ? albumQuery.data : albumParam
  const playlist = album?.Type === 'Playlist'

  const params = {
    ParentId: typeof albumParam === 'string' ? albumParam : albumParam.Id,
    SortBy: playlist ? undefined : 'ParentIndexNumber,IndexNumber,Name',
  }
  const { data, isLoading } = useItems(
    params,
    typeof albumParam === 'string' && !albumQuery.data ? false : true,
  )

  const [trackModal, setTrackModal] = useState<Track>(null)
  const [showTrackModal, setShowTrackModal] = useState<boolean>(false)

  const [albumModal, setAlbumModal] = useState<Album>(null)
  const [showAlbumModal, setShowAlbumModal] = useState<boolean>(false)

  return (
    <>
      <InnerScreen
        title={album?.Name}
        icon="more_horiz"
        onPress={() => {
          setAlbumModal(album as Album)
          setShowAlbumModal(true)
        }}
      >
        {!isLoading && !!data && (
          <FlashList
            data={data.Items}
            estimatedItemSize={56}
            keyExtractor={(item, index) => index + '_' + item.Id}
            renderItem={({ item, index }) => (
              <TrackListItem
                track={item}
                trackNumber={!playlist && item.IndexNumber}
                showAlbumArt={playlist}
                showArtist={playlist || !sameAlbumArtists(item)}
                onPress={() => {
                  player.setQueue(data.Items, index)
                  player.play()
                }}
                onLongPress={() => {
                  setTrackModal(item as Track)
                  setShowTrackModal(true)
                }}
              />
            )}
            ListFooterComponent={
              <EndOfList text={playlist ? 'End of playlist' : 'End of album'} />
            }
          />
        )}
      </InnerScreen>

      <TrackModal
        visible={showTrackModal}
        onClose={() => setShowTrackModal(false)}
        track={trackModal}
        navigation={navigation}
      />

      <AlbumModal
        visible={showAlbumModal}
        onClose={() => setShowAlbumModal(false)}
        album={albumModal}
        navigation={navigation}
      />
    </>
  )
}

export default Albums
