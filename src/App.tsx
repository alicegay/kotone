import { useEffect } from 'react'
import 'react-native-gesture-handler'
import { AppRegistry, useWindowDimensions } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import TrackPlayer, { Capability, RatingType } from 'react-native-track-player'

import RootStack from 'types/RootStack'
import PlaybackService from 'services/PlaybackService'
import useClient from 'hooks/useClient'
import usePlayer from 'hooks/usePlayer'
import Player from 'screens/Player'
import SelectServer from 'screens/SelectServer'
import SelectUser from 'screens/SelectUser'
import Tabs from 'screens/Tabs'
import Queue from 'screens/Queue'

const Stack = createStackNavigator<RootStack>()
const queryClient = new QueryClient()

let playerSetup = false

const App = () => {
  const client = useClient()
  const player = usePlayer()
  const { height } = useWindowDimensions()

  useEffect(() => {
    const setupPlayer = async () => {
      await TrackPlayer.setupPlayer()
      await TrackPlayer.updateOptions({
        ratingType: RatingType.Heart,
        progressUpdateEventInterval: 10,
        capabilities: [
          Capability.Play,
          Capability.PlayFromId,
          Capability.PlayFromSearch,
          Capability.Pause,
          Capability.Stop,
          Capability.SeekTo,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
          Capability.Skip,
          Capability.SetRating,
        ],
        notificationCapabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
          Capability.SetRating,
        ],
        compactCapabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
        ],
      })
    }

    if (!playerSetup) {
      setupPlayer()
      console.log('PLAYER SETUP')
      playerSetup = true
    }
  })

  useEffect(() => {
    const restoreQueue = async () => {
      const queue = await TrackPlayer.getQueue()
      if (player.queue.length > 0 && queue.length === 0) {
        player.setQueue(player.queue, player.track)
        console.log('RESTORED QUEUE')
      }
      player.setRepeat(player.repeat)
    }
    if (client.hasHydrated && player.hasHydrated) {
      restoreQueue()
    }
  }, [client.hasHydrated, player.hasHydrated])

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="SelectServer"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Tabs" component={Tabs} />
          <Stack.Screen
            name="Player"
            component={Player}
            options={{
              presentation: 'card',
              gestureEnabled: true,
              gestureDirection: 'vertical',
              gestureResponseDistance: height / 2,
              cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
            }}
          />
          <Stack.Screen name="Queue" component={Queue} />
          <Stack.Screen name="SelectServer" component={SelectServer} />
          <Stack.Screen name="SelectUser" component={SelectUser} />
        </Stack.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
  )
}

AppRegistry.registerComponent('Kotone', () => App)
TrackPlayer.registerPlaybackService(() => PlaybackService)
