import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'

import TabStack from 'types/TabStack'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Search from './Search'
import SearchStack from 'types/SearchStack'
import SongList from './SongList'
import AlbumList from './AlbumList'
import Album from './Album'
import Artist from './Artist'

const Stack = createNativeStackNavigator<SearchStack>()

const SearchTab = ({}: BottomTabScreenProps<TabStack, 'Search'>) => {
  return (
    <Stack.Navigator
      initialRouteName="SearchHome"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="SearchHome" component={Search} />
      <Stack.Screen name="SongList" component={SongList} />
      <Stack.Screen name="AlbumList" component={AlbumList} />
      <Stack.Screen name="Album" component={Album} />
      <Stack.Screen name="Artist" component={Artist} />
    </Stack.Navigator>
  )
}

export default SearchTab
