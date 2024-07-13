import { useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import BootSplash from 'react-native-bootsplash'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import RootStack from 'types/RootStack'
import TabStack from 'types/TabStack'
import useTheme from 'hooks/useTheme'
import FloatingPlayer from 'components/FloatingPlayer'
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
  const insets = useSafeAreaInsets()

  const styles = StyleSheet.create({
    tabIcon: {
      paddingHorizontal: 16,
      paddingVertical: 6,
      borderRadius: 8,
      overflow: 'hidden',
    },
    tabIconFocus: { backgroundColor: '#493939' },
  })

  const icons = {
    Music: 'music-box-multiple-outline',
    Queue: 'playlist-music',
    Search: 'magnify',
    Settings: 'cog',
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
