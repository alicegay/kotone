import { useEffect, useState } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { FlashList } from '@shopify/flash-list'
import Item from 'jellyfin-api/lib/types/media/Item'

import MusicStack from 'types/MusicStack'
import TrackListItem from 'components/TrackListItem'
import usePlayer from 'hooks/usePlayer'
import useLibrary from 'hooks/useLibrary'
import TrackModal from 'components/modals/TrackModal'
import EndOfList from 'components/EndOfList'
import InnerScreen from 'components/InnerScreen'
import useSingleItem from 'api/useSingleItem'
import useItems from 'api/useItems'
import sameAlbumArtists from 'lib/sameAlbumArtists'

const Albums = ({
  navigation,
  route,
}: NativeStackScreenProps<MusicStack, 'Album'>) => {
  const { album } = route.params

  const player = usePlayer()

  const { data, isLoading } = useItems({
    ParentId: album.Id,
    SortBy: 'ParentIndexNumber,IndexNumber,Name',
  })

  const [trackModal, setTrackModal] = useState<Item>(null)

  return (
    <>
      <InnerScreen title={album.Name} icon="more_horiz" onPress={() => {}}>
        {!isLoading && !!data && (
          <FlashList
            data={data.Items}
            estimatedItemSize={56}
            renderItem={({ item }) => (
              <TrackListItem
                key={item.Id}
                track={item}
                trackNumber={item.IndexNumber}
                showAlbumArt={false}
                showArtist={!sameAlbumArtists(item)}
                onPress={() => {
                  player.setQueue([item])
                  player.play()
                }}
                onLongPress={() => {
                  setTrackModal(item)
                }}
              />
            )}
            ListFooterComponent={<EndOfList text="End of album" />}
          />
        )}
      </InnerScreen>

      <TrackModal
        visible={!!trackModal}
        onClose={() => setTrackModal(null)}
        track={trackModal}
      />
    </>
  )
}

export default Albums
