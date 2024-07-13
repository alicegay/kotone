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

const Albums = ({
  navigation,
}: NativeStackScreenProps<MusicStack, 'Albums'>) => {
  const player = usePlayer()
  const library = useLibrary()

  const [trackModal, setTrackModal] = useState<Item>(null)

  return (
    <>
      <InnerScreen title="Albums" icon="more_horiz" onPress={() => {}}>
        {!!library.albums && (
          <FlashList
            data={library.albums}
            estimatedItemSize={56}
            renderItem={({ item }) => (
              <TrackListItem
                key={item.Id}
                track={item}
                onPress={() => {
                  navigation.push('Album', { album: item })
                }}
                onLongPress={() => {
                  // setTrackModal(item)
                }}
                showDuration={false}
              />
            )}
            ListFooterComponent={<EndOfList text="End of albums" />}
          />
        )}
      </InnerScreen>

      {/* <TrackModal
        visible={!!trackModal}
        onClose={() => setTrackModal(null)}
        track={trackModal}
      /> */}
    </>
  )
}

export default Albums
