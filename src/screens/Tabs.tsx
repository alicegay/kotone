import { useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
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
import Home from './Home'
import Queue from './Queue'

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
  const musicView = views.data?.filter(
    (view) => view.CollectionType === 'music',
  )[0].Id
  const songs = useItems({
    SortBy: 'Name',
    SortOrder: 'Ascending',
    IncludeItemTypes: 'Audio',
    Recursive: true,
  })
  const favorites = useItems({
    SortBy: 'Name',
    SortOrder: 'Ascending',
    IncludeItemTypes: 'Audio',
    Recursive: true,
    IsFavorite: true,
  })
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
    if (views.data) library.setViews(views.data)
  }, [views.data])
  useEffect(() => {
    if (songs.data) library.setSongs(songs.data.Items)
  }, [songs.data])
  useEffect(() => {
    if (favorites.data) library.setFavorites(favorites.data.Items)
  }, [favorites.data])
  useEffect(() => {
    if (albums.data) library.setAlbums(albums.data.Items)
  }, [albums.data])

  const styles = StyleSheet.create({
    tabIcon: {
      paddingHorizontal: 16,
      paddingVertical: 6,
      borderRadius: 32,
      overflow: 'hidden',
    },
    tabIconFocus: { backgroundColor: '#493939' },
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
          tabBarActiveTintColor: '#FADCD6',
          tabBarInactiveTintColor: '#493939',
          tabBarStyle: {
            paddingBottom: insets.bottom,
            height: 64 + insets.bottom,
            backgroundColor: '#201818',
            borderTopWidth: 0,
          },
          tabBarIcon: ({ focused, color, size }) => {
            return (
              <Icon
                name={icons[route.name]}
                style={[
                  styles.tabIcon,
                  focused && styles.tabIconFocus,
                  { fontSize: size, color: color },
                ]}
              />
            )
          },
        })}
      >
        <Tab.Screen name="Music" component={Home} />
        <Tab.Screen name="Search" component={Temp} />
        <Tab.Screen name="Queue" component={Queue} />
        <Tab.Screen name="Settings" component={Temp} />
      </Tab.Navigator>
      <FloatingPlayer navigation={navigation} />
    </>
  )
}

function Temp({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Temporary screen!</Text>
    </View>
  )
}

export default Tabs
