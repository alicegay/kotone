import { createNativeStackNavigator } from '@react-navigation/native-stack'

import MusicStack from 'types/MusicStack'
import MusicHome from './MusicHome'
import Album from './Album'
import SongList from './SongList'
import AlbumList from './AlbumList'

const Home = () => {
  const Stack = createNativeStackNavigator<MusicStack>()

  return (
    <Stack.Navigator
      initialRouteName="MusicHome"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="MusicHome" component={MusicHome} />
      <Stack.Screen name="SongList" component={SongList} />
      <Stack.Screen name="AlbumList" component={AlbumList} />
      <Stack.Screen name="Album" component={Album} />
    </Stack.Navigator>
  )
}

export default Home
