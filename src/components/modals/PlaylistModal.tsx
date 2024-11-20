import { FlatList, useWindowDimensions, View } from 'react-native'
import Modal from 'react-native-modal'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import usePlayer from 'hooks/usePlayer'
import useTheme from 'hooks/useTheme'
import ModalButton from './ModalButton'
import Separator from './Separator'
import useItems from 'api/useItems'
import useLibrary from 'hooks/useLibrary'
import { playlists } from 'jellyfin-api'
import useClient from 'hooks/useClient'
import { AxiosError, AxiosResponse } from 'axios'

interface Props {
  visible: boolean
  onClose: () => void
  tracks: string[]
  //navigation: NativeStackNavigationProp<MusicStack>
}

const PlaylistModal = ({ visible, onClose, tracks }: Props) => {
  const client = useClient()
  const player = usePlayer()
  const theme = useTheme()
  const { height } = useWindowDimensions()
  const insets = useSafeAreaInsets()
  const library = useLibrary()

  const playlistView =
    library.viewIDs && 'playlists' in library.viewIDs
      ? library.viewIDs.playlists
      : null

  const { data, isLoading, isFetching } = useItems(
    {
      ParentId: playlistView,
      SortBy: 'SortName',
      SortOrder: 'Ascending',
    },
    !!tracks && !!playlistView,
  )

  if (!tracks) return null

  return (
    <Modal
      isVisible={visible}
      onBackButtonPress={onClose}
      onBackdropPress={onClose}
      animationIn="fadeInUp"
      animationOut="fadeOutDown"
      animationInTiming={200}
      animationOutTiming={200}
      useNativeDriver={true}
      statusBarTranslucent={true}
      deviceHeight={height + insets.top + insets.bottom}
    >
      <View style={{ paddingHorizontal: 16 }}>
        <View
          style={{
            backgroundColor: theme.scheme.background,
            borderRadius: 16,
            overflow: 'hidden',
          }}
        >
          <View style={{ paddingVertical: 8, gap: 4 }}>
            {!isLoading && !!data.Items && (
              <FlatList
                data={data.Items}
                keyExtractor={(item) => item.Id}
                renderItem={({ item }) => (
                  <ModalButton
                    text={item.Name}
                    icon="playlist_add"
                    useTheme={true}
                    onPress={() => {
                      playlists
                        .add(client.api, item.Id, tracks)
                        .catch((error: AxiosError) => {
                          if (error.status === 403)
                            console.log('Permission denied')
                        })
                      onClose()
                    }}
                  />
                )}
                ListHeaderComponent={() => (
                  <>
                    <ModalButton
                      text="New Playlist..."
                      icon="playlist_add"
                      useTheme={true}
                      disabled={true}
                      onPress={() => {
                        onClose()
                      }}
                    />

                    <Separator />
                  </>
                )}
                style={{ maxHeight: height / 2 }}
              />
            )}
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default PlaylistModal
