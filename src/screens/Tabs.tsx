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

  const styles = StyleSheet.create({
    tabIcon: {
      paddingHorizontal: 16,
      paddingVertical: 6,
      borderRadius: 32,
      overflow: 'hidden',
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
            paddingBottom: insets.bottom,
            height: 64 + insets.bottom,
            backgroundColor: theme.scheme.surface,
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
