import { Button, StyleSheet, Text, View } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import RootStack from 'types/RootStack'
import TabStack from 'types/TabStack'
import useTheme from 'hooks/useTheme'
import FloatingPlayer from 'components/FloatingPlayer'
import Home from './Home'

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
    tabIconFocus: { backgroundColor: '#fff2' },
  })

  const icons = {
    Home: 'home',
    Music: 'music-box-multiple-outline',
    Search: 'magnify',
  }

  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: false,
          tabBarActiveTintColor: '#fff',
          tabBarInactiveTintColor: '#fff6',
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
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Music" component={SettingsScreen} />
        <Tab.Screen name="Search" component={SettingsScreen} />
      </Tab.Navigator>
      <FloatingPlayer navigation={navigation} />
    </>
  )
}

function SettingsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings!</Text>
      <Button title="Go to Home" onPress={() => navigation.navigate('Home')} />
    </View>
  )
}

export default Tabs
