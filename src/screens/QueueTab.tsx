import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'

import QueueStack from 'types/QueueStack'
import TabStack from 'types/TabStack'
import SongList from './SongList'
import AlbumList from './AlbumList'
import Album from './Album'
import Queue from './Queue'
import Artist from './Artist'

const Stack = createNativeStackNavigator<QueueStack>()

const QueueTab = ({}: BottomTabScreenProps<TabStack, 'Queue'>) => {
  return (
    <Stack.Navigator
      initialRouteName="QueueHome"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="QueueHome" component={Queue} />
      <Stack.Screen name="SongList" component={SongList} />
      <Stack.Screen name="AlbumList" component={AlbumList} />
      <Stack.Screen name="Album" component={Album} />
      <Stack.Screen name="Artist" component={Artist} />
    </Stack.Navigator>
  )
}

export default QueueTab
