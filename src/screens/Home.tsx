import { createNativeStackNavigator } from '@react-navigation/native-stack'

import MusicStack from 'types/MusicStack'
import MusicHome from './MusicHome'
import Songs from './Songs'
import Favorites from './Favorites'
import Albums from './Albums'
import Album from './Album'

const Home = () => {
  const Stack = createNativeStackNavigator<MusicStack>()

  return (
    <Stack.Navigator
      initialRouteName="MusicHome"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="MusicHome" component={MusicHome} />
      <Stack.Screen name="Songs" component={Songs} />
      <Stack.Screen name="Favorites" component={Favorites} />
      <Stack.Screen name="Albums" component={Albums} />
      <Stack.Screen name="Album" component={Album} />
    </Stack.Navigator>
  )
}

export default Home
