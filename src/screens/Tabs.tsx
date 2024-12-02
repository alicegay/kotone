import { useEffect } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import BootSplash from 'react-native-bootsplash'

import RootStack from 'types/RootStack'
import TabStack from 'types/TabStack'
import useTheme from 'hooks/useTheme'
import useLibrary from 'hooks/useLibrary'
import useViews from 'api/useViews'
import useItems from 'api/useItems'
import FloatingPlayer from 'components/FloatingPlayer'
import { Icon } from 'components/Icon'
import MusicTab from './MusicTab'
import SearchTab from './SearchTab'
import SettingsTab from './SettingsTab'
import QueueTab from './QueueTab'
import { emitSoftReset } from 'lib/events'

const Tab = createBottomTabNavigator<TabStack>()

const Tabs = ({ navigation }: StackScreenProps<RootStack, 'Tabs'>) => {
  useEffect(() => {
    BootSplash.isVisible().then(async (visible) => {
      if (visible) await BootSplash.hide({ fade: true })
    })
  }, [])

  const theme = useTheme()
  const library = useLibrary()
  const insets = useSafeAreaInsets()

  const views = useViews()
  useEffect(() => {
    if (views.data) {
      library.setViews(views.data)
      let ids = {}
      for (let i = 0; i < views.data.length; i++) {
        ids[views.data[i].CollectionType] = views.data[i].Id
      }
      library.setViewIDs(ids)
    }
  }, [views.data])

  const musicView =
    library.viewIDs && 'music' in library.viewIDs ? library.viewIDs.music : null
  const albums = useItems(
    {
      ParentId: musicView,
      SortBy: 'Name',
      SortOrder: 'Ascending',
      IncludeItemTypes: 'MusicAlbum',
      Recursive: true,
    },
    !!musicView,
  )
  useEffect(() => {
    if (albums.data) library.setAlbums(albums.data.Items)
  }, [albums.data])

  const songs = useItems({
    SortBy: 'Name',
    SortOrder: 'Ascending',
    IncludeItemTypes: 'Audio',
    Recursive: true,
    Fields: 'MediaSources',
  })
  useEffect(() => {
    if (songs.data) library.setSongs(songs.data.Items)
  }, [songs.data])

  const musicvideoView =
    library.viewIDs && 'musicvideos' in library.viewIDs
      ? library.viewIDs.musicvideos
      : null
  const musicvideos = useItems(
    {
      ParentId: musicvideoView,
      SortBy: 'Name',
      SortOrder: 'Ascending',
      IncludeItemTypes: 'MusicVideo',
      Recursive: true,
      Fields: 'MediaSources',
    },
    !!musicvideoView,
  )
  useEffect(() => {
    if (musicvideos.data) library.setMusicvideos(musicvideos.data.Items)
  }, [musicvideos.data])

  const styles = StyleSheet.create({
    tabIcon: {
      top: 13,
      paddingHorizontal: 16,
      paddingVertical: 6,
      borderRadius: 24,
      fontSize: 24,
      width: 56,
      height: 42,
    },
    tabIconFocus: { backgroundColor: theme.scheme.surfaceVariant },
  })

  const icons = {
    Music: 'library_music',
    Search: 'search',
    Queue: 'queue_music',
    Settings: 'settings',
  }

  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: false,
          tabBarActiveTintColor: theme.scheme.onSurface,
          tabBarInactiveTintColor: theme.scheme.surfaceVariant,
          tabBarStyle: {
            height: 64 + insets.bottom,
            backgroundColor: theme.scheme.surface,
            borderTopWidth: 0,
          },
          tabBarIcon: ({ focused, color }) => {
            return (
              <Icon
                name={icons[route.name]}
                style={[
                  styles.tabIcon,
                  focused && styles.tabIconFocus,
                  {
                    color: color,
                  },
                ]}
              />
            )
          },
          tabBarButton: (props) => (
            <Pressable
              {...props}
              android_ripple={{
                radius: 32,
                color: theme.scheme.ripple,
              }}
              onPress={(e) => {
                props.onPress(e)
                emitSoftReset()
              }}
            />
          ),
        })}
      >
        <Tab.Screen name="Music" component={MusicTab} />
        <Tab.Screen name="Search" component={SearchTab} />
        <Tab.Screen name="Queue" component={QueueTab} />
        <Tab.Screen name="Settings" component={SettingsTab} />
      </Tab.Navigator>
      <FloatingPlayer navigation={navigation} />
    </>
  )
}

export default Tabs
