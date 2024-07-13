import { DimensionValue, Image, Pressable, Text, View } from 'react-native'
import { StackNavigationProp } from '@react-navigation/stack'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Blurhash } from 'react-native-blurhash'
import { State, usePlaybackState, useProgress } from 'react-native-track-player'
import { Shadow } from 'react-native-shadow-2'

import RootStack from 'types/RootStack'
import useClient from 'hooks/useClient'
import useTheme from 'hooks/useTheme'
import usePlayer from 'hooks/usePlayer'
import IconI from 'components/icons/MaterialIcons'

interface Props {
  navigation: StackNavigationProp<RootStack>
}

const FloatingPlayer = ({ navigation }: Props) => {
  const client = useClient()
  const theme = useTheme()
  const player = usePlayer()
  const insets = useSafeAreaInsets()
  const playerProgress = useProgress()
  const playerState = usePlaybackState()

  const track = player.queue.length > 0 ? player.queue[player.track] : null
  if (!track) return null

  const image =
    'Primary' in track.ImageTags
      ? client.server + '/Items/' + track.Id + '/Images/Primary'
      : track.AlbumPrimaryImageTag
      ? client.server + '/Items/' + track.AlbumId + '/Images/Primary'
      : null
  const blurhash =
    'Primary' in track.ImageBlurHashes
      ? track.ImageBlurHashes.Primary[
          'Primary' in track.ImageTags
            ? track.ImageTags.Primary
            : track.AlbumPrimaryImageTag
        ]
      : null

  return (
    <View
      style={{
        position: 'absolute',
        bottom: 64 + insets.bottom + 16,
        width: '100%',
        height: 64,
        paddingHorizontal: 16,
      }}
    >
      <Shadow distance={32} offset={[0, 8]} startColor="#0002">
        <Pressable
          style={{
            flex: 1,
            //marginHorizontal: 16,
            backgroundColor: theme.background,
            width: '100%',
            height: 64,
            borderRadius: 16,
            overflow: 'hidden',
            flexDirection: 'row',
            alignItems: 'center',
          }}
          onPress={() => {
            navigation.push('Player')
          }}
        >
          {Blurhash.isBlurhashValid(blurhash) && (
            <Blurhash
              blurhash={blurhash}
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
              }}
            />
          )}
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
              uri: image,
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
              paddingLeft: 16,
            }}
          >
            <Text
              style={{
                fontFamily: theme.font500,
                fontSize: 18,
                color: theme.foreground,
              }}
              numberOfLines={1}
            >
              {track.Name}
            </Text>
            <Text
              style={{
                fontFamily: theme.font400,
                fontSize: 14,
                color: theme.foregroundAlt,
              }}
              numberOfLines={1}
            >
              {track.Artists.join(', ')}
            </Text>
          </View>

          <Pressable
            style={{
              width: 48,
              height: 64,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            android_ripple={{
              color: theme.ripple,
              radius: 24,
              foreground: true,
              borderless: true,
            }}
            onPress={() => {
              if (playerState.state === State.Playing) {
                player.pause()
              } else {
                player.play()
              }
            }}
          >
            <IconI
              name={
                playerState.state === State.Playing ? 'pause' : 'play_arrow'
              }
              style={{ fontSize: 32, color: theme.foreground }}
            />
          </Pressable>
          <Pressable
            style={{
              width: 48,
              height: 64,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            android_ripple={{
              color: theme.ripple,
              radius: 24,
              foreground: true,
              borderless: true,
            }}
            onPress={() => {
              player.nextTrack()
            }}
          >
            <IconI
              name="skip_next"
              style={{ fontSize: 32, color: theme.foreground }}
            />
          </Pressable>

          <View
            style={{
              position: 'absolute',
              bottom: 0,
              width: ((playerProgress.position / playerProgress.duration) *
                100 +
                '%') as DimensionValue,
              height: 3,
              borderRadius: 3,
              backgroundColor: theme.foregroundAlt,
            }}
          ></View>
        </Pressable>
      </Shadow>
    </View>
  )
}

export default FloatingPlayer
