import 'react-native-gesture-handler'
import { AppRegistry, useWindowDimensions } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import TrackPlayer from 'react-native-track-player'

import RootStack from 'types/RootStack'
import Player from 'screens/Player'
import SelectServer from 'screens/SelectServer'
import SelectUser from 'screens/SelectUser'
import Tabs from 'screens/Tabs'
import PlaybackService from 'services/PlaybackService'

const Stack = createStackNavigator<RootStack>()
const queryClient = new QueryClient()

const App = () => {
  const { height } = useWindowDimensions()

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
          <Stack.Screen name="SelectServer" component={SelectServer} />
          <Stack.Screen name="SelectUser" component={SelectUser} />
        </Stack.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
  )
}

AppRegistry.registerComponent('Kotone', () => App)
TrackPlayer.registerPlaybackService(() => PlaybackService)
