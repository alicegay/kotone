import { useRef, useState } from 'react'
import { Pressable, View } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { FlashList } from '@shopify/flash-list'

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
import { Album } from 'types/ItemTypes'
import { Icon } from 'components/Icon'

const Search = ({
  navigation,
}: NativeStackScreenProps<SearchStack, 'SearchHome'>) => {
  const theme = useTheme()
  const library = useLibrary()

  const [albumModal, setAlbumModal] = useState<Album>(null)
  const [showAlbumModal, setShowAlbumModal] = useState<boolean>(false)

  const [search, setSearch] = useState<string>('')

  const searchRef = useRef<any>()

  const albums =
    !!search && !!library.albums
      ? library.albums.filter((album) =>
          album.Search.includes(formatName(search)),
        )
      : null

  return (
    <>
      <InnerScreen title="Search" showBackButton={false}>
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 16,
            paddingBottom: 16,
            gap: 8,
          }}
        >
          <TextInput
            ref={searchRef}
            value={search}
            onChangeText={setSearch}
            autoCapitalize={'none'}
            placeholder="Search..."
          />
          <Pressable
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
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
              name="backspace"
              style={{ color: theme.scheme.onPrimaryContainer, fontSize: 18 }}
            />
          </Pressable>
        </View>
        {!!library.albums ? (
          !!albums && (
            <FlashList
              data={albums}
              estimatedItemSize={56}
              keyExtractor={(item) => item.Id}
              renderItem={({ item }) => (
                <TrackListItem
                  track={item}
                  onPress={() => {
                    navigation.push('Album', { album: item })
                  }}
                  onLongPress={() => {
                    setAlbumModal(item)
                    setShowAlbumModal(true)
                  }}
                  showDuration={false}
                  scheme={theme.scheme}
                />
              )}
              ListFooterComponent={<EndOfList text="End of search" />}
            />
          )
        ) : (
          <CenterLoading />
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

export default Search
