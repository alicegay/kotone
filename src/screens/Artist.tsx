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
import useTheme from 'hooks/useTheme'
import { Pressable, Text, useWindowDimensions, View } from 'react-native'
import { FasterImageView } from '@candlefinance/faster-image'
import useClient from 'hooks/useClient'
import useSingleItem from 'api/useSingleItem'
import tinycolor from 'tinycolor2'
import { Blurhash } from 'react-native-blurhash'
import getTheme from 'lib/getTheme'

const Artist = ({
  navigation,
  route,
}: NativeStackScreenProps<MusicStack, 'Artist'>) => {
  const { artist: artistID } = route.params
  const client = useClient()
  const queryClient = useQueryClient()
  const theme = useTheme()
  const { width } = useWindowDimensions()

  const [albumModal, setAlbumModal] = useState<Album | Playlist>(null)
  const [showAlbumModal, setShowAlbumModal] = useState<boolean>(false)

  const params: ItemsQuery = {
    SortBy: 'Name',
    SortOrder: 'Ascending',
    IncludeItemTypes: 'MusicAlbum',
    Recursive: true,
    ArtistIds: artistID,
  }
  const { data, isLoading, isFetching } = useItems(params)
  const { data: artist } = useSingleItem(artistID)

  const image = client.server + '/Items/' + artistID + '/Images/Primary'

  const blurhash = !!artist
    ? 'Primary' in artist?.ImageBlurHashes
      ? artist?.ImageBlurHashes.Primary[
          'Primary' in artist?.ImageTags
            ? artist?.ImageTags.Primary
            : artist?.AlbumPrimaryImageTag
        ]
      : null
    : null
  const average = !!blurhash
    ? tinycolor(Blurhash.getAverageColor(blurhash)).toHex8String()
    : null
  const scheme = !average ? theme.scheme : getTheme(average, theme.dark)

  return (
    <>
      <InnerScreen scheme={scheme}>
        {!isLoading && data && (
          <FlashList
            data={data.Items}
            extraData={theme.scheme}
            estimatedItemSize={56}
            keyExtractor={(item, index) => index + '_' + item.Id}
            renderItem={({ item }) => (
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
                showArtist={false}
                scheme={scheme}
              />
            )}
            ListFooterComponent={<EndOfList text={'End of artist'} />}
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
                </View>
                <Text
                  style={{
                    color: scheme.primary,
                    fontFamily: theme.font700,
                    fontSize: 24,
                  }}
                  numberOfLines={2}
                >
                  {artist?.Name}
                </Text>
              </View>
            }
            refreshing={isLoading || isFetching}
            onRefresh={() => {
              queryClient.invalidateQueries({
                queryKey: ['items', params],
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

export default Artist
