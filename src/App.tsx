import { useEffect } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { AppRegistry, useWindowDimensions } from 'react-native'
import { NavigationContainer, Theme } from '@react-navigation/native'
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import TrackPlayer, { Capability, RatingType } from 'react-native-track-player'
import SystemNavigationBar from 'react-native-system-navigation-bar'
import * as Sentry from '@sentry/react-native'

import RootStack from 'types/RootStack'
import PlaybackService from 'services/PlaybackService'
import useClient from 'hooks/useClient'
import usePlayer from 'hooks/usePlayer'
import Player from 'screens/Player'
import SelectServer from 'screens/SelectServer'
import SelectUser from 'screens/SelectUser'
import Tabs from 'screens/Tabs'
import TabStack from 'types/TabStack'
import MusicStack from 'types/MusicStack'
import useTheme from 'hooks/useTheme'
import useSettings from 'hooks/useSettings'
import Lyrics from 'screens/Lyrics'

const Stack = createStackNavigator<RootStack>()
const queryClient = new QueryClient()

let playerSetup = false

const App = () => {
  const client = useClient()
  const player = usePlayer()
  const settings = useSettings()
  const theme = useTheme()
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
          Capability.SeekTo,
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
      console.log('PLAYER SETUP')
      playerSetup = true
    }

    if (!playerSetup) {
      setupPlayer()
    }

    SystemNavigationBar.setNavigationColor(0x00000000, 'light')
  }, [])

  useEffect(() => {
    if (playerSetup) {
      const restoreQueue = async () => {
        const queue = await TrackPlayer.getQueue()
        if (player.queue.length > 0 && queue.length === 0) {
          player.setQueue(player.queue, player.track)
          console.log('RESTORED QUEUE')
        }
        player.setRepeat(player.repeat)
      }
      if (client.hasHydrated && player.hasHydrated && settings.hasHydrated) {
        restoreQueue()
      }
    }
  }, [
    client.hasHydrated,
    player.hasHydrated,
    settings.hasHydrated,
    playerSetup,
  ])

  useEffect(() => {
    if (theme.hasHydrated) {
      theme.setTheme(theme.tint)
      console.log('SET THEME', theme.tint, theme.dark ? 'DARK' : 'LIGHT')
    }
  }, [theme.hasHydrated, theme.tint, theme.dark])

  const navTheme: Theme = {
    dark: theme.dark ?? true,
    colors: {
      primary: theme.scheme?.primary ?? '#fff',
      background: theme.scheme?.background ?? '#000',
      card: theme.scheme?.surface ?? '#000',
      text: theme.scheme?.primary ?? '#fff',
      border: theme.scheme?.primary ?? '#fff',
      notification: theme.scheme?.primary ?? '#fff',
    },
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer theme={navTheme}>
          {!!theme.scheme && (
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
              <Stack.Screen name="Lyrics" component={Lyrics} />
              <Stack.Screen name="SelectServer" component={SelectServer} />
              <Stack.Screen name="SelectUser" component={SelectUser} />
            </Stack.Navigator>
          )}
        </NavigationContainer>
      </QueryClientProvider>
    </GestureHandlerRootView>
  )
}

Sentry.init({
  dsn: 'https://78b9c94067abaf569468855f4b921dad@o4507548984016896.ingest.us.sentry.io/4507733341962240',
  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // We recommend adjusting this value in production.
  tracesSampleRate: 1.0,
  _experiments: {
    // profilesSampleRate is relative to tracesSampleRate.
    // Here, we'll capture profiles for 100% of transactions.
    profilesSampleRate: 1.0,
  },
})

AppRegistry.registerComponent('Kotone', () => Sentry.wrap(App))
TrackPlayer.registerPlaybackService(() => PlaybackService)

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStack, TabStack, MusicStack {}
  }
}
