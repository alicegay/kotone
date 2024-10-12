import { createNativeStackNavigator } from '@react-navigation/native-stack'

import MusicStack from 'types/MusicStack'
import Music from './Music'
import Album from './Album'
import SongList from './SongList'
import AlbumList from './AlbumList'
import Artist from './Artist'

const Stack = createNativeStackNavigator<MusicStack>()

const MusicTab = () => {
  return (
    <Stack.Navigator
      initialRouteName="MusicHome"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="MusicHome" component={Music} />
      <Stack.Screen name="SongList" component={SongList} />
      <Stack.Screen name="AlbumList" component={AlbumList} />
      <Stack.Screen name="Album" component={Album} />
      <Stack.Screen name="Artist" component={Artist} />
    </Stack.Navigator>
  )
}

export default MusicTab
