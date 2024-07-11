import { StyleSheet, Text, View } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import RootStack from 'types/RootStack'
import TabStack from 'types/TabStack'
import useTheme from 'hooks/useTheme'
import FloatingPlayer from 'components/FloatingPlayer'
import Home from './Home'
import Queue from './Queue'

const Tab = createBottomTabNavigator<TabStack>()

const Tabs = ({ navigation }: StackScreenProps<RootStack, 'Tabs'>) => {
  const theme = useTheme()
  const insets = useSafeAreaInsets()

  const styles = StyleSheet.create({
    tabIcon: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
      overflow: 'hidden',
    },
    tabIconFocus: { backgroundColor: theme.ripple },
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
          tabBarActiveTintColor: theme.foreground,
          tabBarInactiveTintColor: theme.foregroundAlt,
          tabBarStyle: {
            paddingBottom: insets.bottom,
            height: 64 + insets.bottom,
            backgroundColor: theme.background,
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
