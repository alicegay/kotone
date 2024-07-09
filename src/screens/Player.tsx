import {
  ColorValue,
  Image,
  Text,
  useWindowDimensions,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Blurhash } from 'react-native-blurhash'
import { Shadow } from 'react-native-shadow-2'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import useClient from 'hooks/useClient'
import useTheme from 'hooks/useTheme'

import { hash, itemid } from 'temp'

const Player = () => {
  const client = useClient()
  const theme = useTheme()
  const insets = useSafeAreaInsets()
  const { width } = useWindowDimensions()

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <Blurhash
        blurhash={hash}
        style={{ position: 'absolute', width: '100%', height: '100%' }}
      />
      <View
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backgroundColor: '#0004',
        }}
      />

      <View
        style={{
          paddingTop: insets.top + 8,
          paddingBottom: insets.bottom + 32,
          paddingHorizontal: 32,
          flex: 1,
          justifyContent: 'space-between',
        }}
      >
        <View style={{ gap: 32 }}>
          <Shadow distance={32} offset={[0, 8]} startColor="#0002">
            <Image
              source={{
                uri: client.server + '/Items/' + itemid + '/Images/Primary',
              }}
              style={{
                width: width - 32 * 2,
                height: width - 32 * 2,
                borderRadius: 16,
                overflow: 'hidden',
              }}
            />
          </Shadow>

          <View style={{ gap: 8 }}>
            <Text
              style={{
                color: '#fff',
                fontSize: 24,
                fontFamily: theme.font700,
              }}
              numberOfLines={2}
            >
              アイドル
            </Text>
            <Text
              style={{
                color: '#fff6',
                fontSize: 18,
                fontFamily: theme.font700,
              }}
              numberOfLines={1}
            >
              YOASOBI
            </Text>
            {/* <Text
              style={{
                color: '#fff6',
                fontSize: 16,
                fontFamily: theme.font500,
              }}
              numberOfLines={1}
            >
              アイドル
            </Text> */}
          </View>

          <View style={{ gap: 8 }}>
            <View
              style={{
                backgroundColor: '#fff6',
                width: '100%',
                height: 6,
                borderRadius: 3,
                overflow: 'hidden',
              }}
            >
              <View
                style={{
                  backgroundColor: '#fff',
                  width: '40%',
                  height: 6,
                  borderRadius: 3,
                  overflow: 'hidden',
                }}
              />
            </View>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <Text style={{ color: '#fff6', fontFamily: theme.font400 }}>
                01:20
              </Text>
              <Text style={{ color: '#fff6', fontFamily: theme.font400 }}>
                FLAC
              </Text>
              <Text style={{ color: '#fff6', fontFamily: theme.font400 }}>
                03:33
              </Text>
            </View>
          </View>

          <View>
            <Text
              style={{
                color: '#fff',
                fontFamily: theme.font400,
                textAlign: 'center',
              }}
              numberOfLines={1}
            >
              無敵の笑顔で荒らすメディア
            </Text>
            <Text
              style={{
                color: '#fff6',
                fontFamily: theme.font400,
                textAlign: 'center',
              }}
              numberOfLines={1}
            >
              知りたいその秘密ミステリアス
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            alignItems: 'center',
          }}
        >
          <Icon name="skip-previous" style={{ color: '#fff', fontSize: 60 }} />
          <Icon name="play" style={{ color: '#fff', fontSize: 80 }} />
          <Icon name="skip-next" style={{ color: '#fff', fontSize: 60 }} />
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            alignItems: 'center',
          }}
        >
          <Icon
            name="text-box-outline"
            style={{ color: '#fff4', fontSize: 20 }}
          />
          <Icon name="repeat" style={{ color: '#fff4', fontSize: 20 }} />
          <Icon name="heart" style={{ color: '#fff', fontSize: 20 }} />
          <Icon name="playlist-music" style={{ color: '#fff', fontSize: 20 }} />
          <Icon name="dots-vertical" style={{ color: '#fff', fontSize: 20 }} />
        </View>
      </View>
    </View>
  )
}

export default Player
