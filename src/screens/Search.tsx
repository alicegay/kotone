import { useCallback, useRef, useState } from 'react'
import { Pressable, View } from 'react-native'
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack'
import { FlashList } from '@shopify/flash-list'
import { TabView } from 'react-native-tab-view'

import useTheme from 'hooks/useTheme'
import useLibrary from 'hooks/useLibrary'
import InnerScreen from 'components/InnerScreen'
import TextInput from 'components/TextInput'
import TrackListItem from 'components/TrackListItem'
import formatName from 'lib/formatName'
import SearchStack from 'types/SearchStack'
import CenterLoading from 'components/CenterLoading'
import EndOfList from 'components/EndOfList'
import AlbumModal from 'components/modals/AlbumModal'
import { Album, Track } from 'types/ItemTypes'
import { Icon } from 'components/Icon'
import Item from 'jellyfin-api/lib/types/media/Item'
import usePlayer from 'hooks/usePlayer'
import TrackModal from 'components/modals/TrackModal'
import { useFocusEffect } from '@react-navigation/native'
import { listenSoftReset } from 'lib/events'

const Search = ({
  navigation,
}: NativeStackScreenProps<SearchStack, 'SearchHome'>) => {
  const theme = useTheme()
  const library = useLibrary()

  const [search, setSearch] = useState<string>('')
  const formattedSearch = formatName(search)

  const searchRef = useRef<any>()

  // const albums =
  //   !!search && !!library.albums
  //     ? library.albums.filter((album) =>
  //         album.Search.includes(formatName(search)),
  //       )
  //     : null

  // const songs =
  //   !!search && !!library.songs
  //     ? library.songs.filter((song) => song.Search.includes(formatName(search)))
  //     : null

  const [index, setIndex] = useState(0)

  const onSoftReset = useCallback(() => {
    searchRef.current?.focus()
  }, [])

  useFocusEffect(
    useCallback(() => {
      return listenSoftReset(onSoftReset)
    }, [onSoftReset]),
  )

  return (
    <>
      <InnerScreen title="Search" showBackButton={false}>
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 16,
            paddingBottom: 16,
          }}
        >
          <TextInput
            ref={searchRef}
            value={search}
            onChangeText={setSearch}
            autoCapitalize={'none'}
            placeholder="Search..."
            style={{
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
            }}
          />
          <Pressable
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
              overflow: 'hidden',
              backgroundColor: theme.scheme.primaryContainer,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            android_ripple={{ color: theme.scheme.ripple, radius: 22 }}
            onPress={() => {
              setSearch('')
              searchRef.current.focus()
            }}
          >
            <Icon
              name="close"
              style={{ color: theme.scheme.onPrimaryContainer, fontSize: 18 }}
            />
          </Pressable>
        </View>

        <TabView
          navigationState={{
            index,
            routes: [
              { key: 'albums', title: 'Albums' },
              { key: 'songs', title: 'Songs' },
              { key: 'musicvideos', title: 'Music Videos' },
              // { key: 'artists', title: 'Artists' },
            ],
          }}
          onIndexChange={setIndex}
          renderScene={({ route }) => {
            switch (route.key) {
              case 'albums':
                return (
                  <InnerTab
                    search={formattedSearch}
                    type="albums"
                    navigation={navigation}
                    isLoading={!library.albums}
                  />
                )
              case 'songs':
                return (
                  <InnerTab
                    search={formattedSearch}
                    type="songs"
                    navigation={navigation}
                    isLoading={!library.songs}
                  />
                )
              case 'musicvideos':
                return (
                  <InnerTab
                    search={formattedSearch}
                    type="musicvideos"
                    navigation={navigation}
                    isLoading={!library.musicvideos}
                  />
                )
            }
          }}
        />
      </InnerScreen>
    </>
  )
}

const InnerTab = ({
  search,
  type,
  navigation,
  isLoading,
}: {
  search: string
  type: 'albums' | 'songs' | 'artists' | 'musicvideos'
  navigation: NativeStackNavigationProp<SearchStack>
  isLoading: boolean
}) => {
  const theme = useTheme()
  const library = useLibrary()
  const player = usePlayer()

  const [albumModal, setAlbumModal] = useState<Album>(null)
  const [showAlbumModal, setShowAlbumModal] = useState<boolean>(false)

  const [trackModal, setTrackModal] = useState<Track>(null)
  const [showTrackModal, setShowTrackModal] = useState<boolean>(false)

  const items = search
    ? type === 'albums'
      ? library.albums
        ? library.albums.filter((album) =>
            album.Search.includes(formatName(search)),
          )
        : null
      : type === 'songs'
      ? library.songs
        ? library.songs.filter((song) =>
            song.Search.includes(formatName(search)),
          )
        : null
      : type === 'musicvideos'
      ? library.musicvideos
        ? library.musicvideos.filter((mv) =>
            mv.Search.includes(formatName(search)),
          )
        : null
      : null
    : null

  return (
    <>
      {!isLoading ? (
        !!items && (
          <FlashList
            data={items as Item[]}
            estimatedItemSize={56}
            keyExtractor={(item) => item.Id}
            renderItem={({ item }) => (
              <TrackListItem
                track={item}
                onPress={() => {
                  if (type === 'albums') {
                    navigation.push('Album', { album: item })
                  } else if (type === 'songs') {
                    player.setQueue([item])
                    player.play()
                  }
                }}
                onLongPress={() => {
                  if (type === 'albums') {
                    setAlbumModal(item as Album)
                    setShowAlbumModal(true)
                  } else if (type === 'songs') {
                    setTrackModal(item as Track)
                    setShowTrackModal(true)
                  }
                }}
                showDuration={type === 'songs'}
                scheme={theme.scheme}
              />
            )}
            ListFooterComponent={<EndOfList text="End of search" />}
          />
        )
      ) : (
        <CenterLoading />
      )}

      <AlbumModal
        visible={showAlbumModal}
        onClose={() => setShowAlbumModal(false)}
        album={albumModal}
        navigation={navigation}
      />

      <TrackModal
        visible={showTrackModal}
        onClose={() => setShowTrackModal(false)}
        track={trackModal}
        // @ts-ignore
        navigation={navigation}
      />
    </>
  )
}

export default Search
