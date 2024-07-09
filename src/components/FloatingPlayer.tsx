import { Image, Pressable, Text, View } from 'react-native'
import { StackNavigationProp } from '@react-navigation/stack'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Blurhash } from 'react-native-blurhash'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import { hash, itemid } from 'temp'

import RootStack from 'types/RootStack'
import useClient from 'hooks/useClient'
import useTheme from 'hooks/useTheme'

interface Props {
  navigation: StackNavigationProp<RootStack>
}

const FloatingPlayer = ({ navigation }: Props) => {
  const client = useClient()
  const theme = useTheme()
  const insets = useSafeAreaInsets()

  return (
    <View
      style={{
        position: 'absolute',
        bottom: 64 + insets.bottom + 16,
        width: '100%',
        height: 64,
      }}
    >
      <Pressable
        style={{
          flex: 1,
          marginHorizontal: 16,
          backgroundColor: '#000',
          height: 64,
          borderRadius: 16,
          overflow: 'hidden',
          flexDirection: 'row',
          gap: 16,
          alignItems: 'center',
        }}
        onPress={() => {
          navigation.push('Player')
        }}
      >
        <Blurhash
          blurhash={hash}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
          }}
        />
        <View
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: '#0004',
          }}
        />

        <Image
          source={{
            uri: client.server + '/Items/' + itemid + '/Images/Primary',
          }}
          style={{
            width: 64,
            height: 64,
            borderRadius: 16,
            overflow: 'hidden',
          }}
        />

        <View
          style={{
            flexShrink: 1,
            flexGrow: 1,
          }}
        >
          <Text
            style={{
              fontFamily: theme.font500,
              fontSize: 18,
              color: '#fff',
            }}
            numberOfLines={1}
          >
            アイドル
          </Text>
          <Text
            style={{
              fontFamily: theme.font400,
              fontSize: 14,
              color: '#fff6',
            }}
            numberOfLines={1}
          >
            YOASOBI
          </Text>
        </View>

        <Icon name="play" style={{ fontSize: 32, color: '#fff' }} />
        <Icon
          name="skip-next"
          style={{ fontSize: 32, color: '#fff', paddingRight: 16 }}
        />
      </Pressable>
    </View>
  )
}

export default FloatingPlayer
