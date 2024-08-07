import {
  DimensionValue,
  Image,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Blurhash } from 'react-native-blurhash'
import { Shadow } from 'react-native-shadow-2'
import { State, usePlaybackState, useProgress } from 'react-native-track-player'

import RootStack from 'types/RootStack'
import useClient from 'hooks/useClient'
import useTheme from 'hooks/useTheme'
import usePlayer from 'hooks/usePlayer'
import secsToTime from 'lib/secsToTime'
import { Icon, IconFilled } from 'components/Icon'
import useSingleItem from 'api/useSingleItem'
import useLyrics from 'api/useLyrics'
import { useEffect, useState } from 'react'
import secsToTicks from 'lib/secsToTicks'
import useInterval from 'hooks/useInterval'
import useFavItem from 'api/useFavItem'
import { ticksToSecs } from 'lib/ticksToTime'
import useSettings from 'hooks/useSettings'

//let accuratePosition = 0

const Player = ({ navigation }: StackScreenProps<RootStack, 'Tabs'>) => {
  const client = useClient()
  const settings = useSettings()
  const theme = useTheme()
  const player = usePlayer()
  const insets = useSafeAreaInsets()
  const { width } = useWindowDimensions()
  const playerProgress = useProgress()
  const playerState = usePlaybackState()
  const navigationHook = useNavigation()

  const track = player.queue.length > 0 ? player.queue[player.track] : null

  const item = useSingleItem(!!track ? track.Id : null, !!track)
  const stream =
    !!item.data && item.data.MediaStreams.length > 0
      ? item.data.MediaStreams.find((stream) => stream.Type === 'Audio')
      : null
  const favorite = !!item.data && item.data.UserData.IsFavorite
  const favItem = useFavItem(!!item.data ? item.data.Id : null)
  const lyrics = useLyrics(!!track ? track.Id : null, !!track)
  const timedLyrics = !!lyrics.data ? 'Start' in lyrics.data.Lyrics[0] : false
  const [currentLyric, setCurrentLyric] = useState<string>(null)
  const [accuratePosition, setAccuratePosition] = useState<number>(0)

  useEffect(() => {
    if (timedLyrics && !!lyrics.data) {
      const position = secsToTicks(accuratePosition)
      for (let i = 0; i < lyrics.data.Lyrics.length; i++) {
        const start = lyrics.data.Lyrics[i].Start
        if (start >= position) {
          if (i == 0) {
            setCurrentLyric(null)
            break
          }
          setCurrentLyric(lyrics.data.Lyrics[i - 1].Text)
          if (lyrics.data.Lyrics[i - 1].Text === currentLyric) break
          break
        }
      }
    }
  }, [accuratePosition])

  useEffect(() => {
    setAccuratePosition(playerProgress.position)
  }, [playerProgress.position])

  useInterval(() => {
    if (
      timedLyrics &&
      playerState.state === State.Playing &&
      playerProgress.position !== accuratePosition + 0.1
    ) {
      setAccuratePosition(accuratePosition + 0.1)
    }
  }, 100)

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

  const androidRipple = {
    color: theme.ripple,
    foreground: true,
    borderless: true,
  }

  const styles = StyleSheet.create({
    buttonSmall: {
      width: 32,
      height: 32,
      alignItems: 'center',
      justifyContent: 'center',
    },
  })

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      {Blurhash.isBlurhashValid(blurhash) && (
        <Blurhash
          blurhash={blurhash}
          style={{ position: 'absolute', width: '100%', height: '100%' }}
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
                uri: image,
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
                color: theme.foreground,
                fontSize: 24,
                fontFamily: theme.font700,
              }}
              numberOfLines={2}
            >
              {track.Name}
            </Text>
            <Text
              style={{
                color: theme.foregroundAlt,
                fontSize: 18,
                fontFamily: theme.font700,
              }}
              numberOfLines={1}
            >
              {track.Artists.join(', ')}
            </Text>
            {track.Album !== track.Name && (
              <Text
                style={{
                  color: theme.foregroundAlt,
                  fontSize: 16,
                  fontFamily: theme.font500,
                }}
                numberOfLines={1}
              >
                {track.Album}
              </Text>
            )}
          </View>

          <View style={{ gap: 8 }}>
            <View
              style={{
                backgroundColor: theme.foregroundAlt,
                width: '100%',
                height: 6,
                borderRadius: 3,
                overflow: 'hidden',
              }}
            >
              <View
                style={{
                  backgroundColor: theme.foreground,
                  width: ((playerProgress.position /
                    ticksToSecs(track.RunTimeTicks)) *
                    100 +
                    '%') as DimensionValue,
                  height: 6,
                  borderRadius: 3,
                  overflow: 'hidden',
                }}
              />
            </View>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <Text
                style={{
                  color: theme.foregroundAlt,
                  fontFamily: theme.font400,
                }}
              >
                {secsToTime(playerProgress.position)}
              </Text>
              {!!stream && (
                <View
                  style={{
                    flexDirection: 'row',
                    gap: 8,
                    alignItems: 'center',
                  }}
                >
                  {(stream.SampleRate > 48000 || stream.BitDepth > 16) &&
                    stream.BitRate <= settings.bitrate && (
                      <IconFilled
                        name="high_res"
                        style={{ color: theme.foregroundAlt, fontSize: 16 }}
                      />
                    )}
                  <Text
                    style={{
                      color: theme.foregroundAlt,
                      fontFamily: theme.font400,
                      fontSize: 10,
                    }}
                  >
                    {stream.Codec.toUpperCase()}
                  </Text>

                  {stream.BitRate <= settings.bitrate && (
                    <Text
                      style={{
                        color: theme.foregroundAlt,
                        fontFamily: theme.font400,
                        fontSize: 10,
                      }}
                    >
                      {stream.SampleRate / 1000 + ' ' + 'kHz'}
                    </Text>
                  )}
                  <Text
                    style={{
                      color: theme.foregroundAlt,
                      fontFamily: theme.font400,
                      fontSize: 10,
                    }}
                  >
                    {Math.round(stream.BitRate / 1000) + ' ' + 'kbps'}
                  </Text>
                  {stream.BitRate > settings.bitrate && (
                    <>
                      <Icon
                        name="arrow_forward"
                        style={{ color: theme.foregroundAlt, fontSize: 12 }}
                      />
                      <Text
                        style={{
                          color: theme.foregroundAlt,
                          fontFamily: theme.font400,
                          fontSize: 10,
                        }}
                      >
                        {Math.round(settings.bitrate / 1000) + ' ' + 'kbps'}
                      </Text>
                    </>
                  )}
                </View>
              )}
              <Text
                style={{
                  color: theme.foregroundAlt,
                  fontFamily: theme.font400,
                }}
              >
                {secsToTime(ticksToSecs(track.RunTimeTicks))}
              </Text>
            </View>
          </View>

          {timedLyrics && (
            <View>
              <Text
                style={{
                  color: '#fff',
                  fontFamily: theme.font400,
                  textAlign: 'center',
                }}
                numberOfLines={1}
              >
                {currentLyric}
              </Text>
            </View>
          )}
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            alignItems: 'center',
          }}
        >
          <Pressable
            onPress={async () => {
              player.prevTrack()
            }}
            android_ripple={androidRipple}
          >
            <IconFilled
              name="skip_previous"
              style={{ color: theme.foreground, fontSize: 48 }}
            />
          </Pressable>
          <Pressable
            onPress={() => {
              if (playerState.state == State.Playing) {
                player.pause()
              } else {
                player.play()
              }
            }}
            android_ripple={androidRipple}
          >
            <IconFilled
              name={playerState.state == State.Playing ? 'pause' : 'play_arrow'}
              style={{ color: theme.foreground, fontSize: 80 }}
            />
          </Pressable>
          <Pressable
            onPress={async () => {
              player.nextTrack()
            }}
            android_ripple={androidRipple}
          >
            <IconFilled
              name="skip_next"
              style={{ color: theme.foreground, fontSize: 48 }}
            />
          </Pressable>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            alignItems: 'center',
          }}
        >
          <Pressable
            style={styles.buttonSmall}
            android_ripple={androidRipple}
            onPress={() => {}}
          >
            <Icon
              name="lyrics"
              style={{
                color: !!lyrics.data ? theme.foreground : theme.foregroundAlt,
                fontSize: 20,
              }}
            />
          </Pressable>
          <Pressable
            style={styles.buttonSmall}
            android_ripple={androidRipple}
            onPress={() => {
              player.cycleRepeat()
            }}
          >
            <Icon
              name={player.repeat === 'track' ? 'repeat_one' : 'repeat'}
              style={{
                color:
                  player.repeat === 'off'
                    ? theme.foregroundAlt
                    : theme.foreground,
                fontSize: 20,
              }}
            />
          </Pressable>
          <Pressable
            style={styles.buttonSmall}
            android_ripple={androidRipple}
            onPress={() => {
              if (!!item.data) {
                favItem.mutate(favorite)
              }
            }}
          >
            {favorite ? (
              <IconFilled
                name="favorite"
                style={{ color: theme.foreground, fontSize: 20 }}
              />
            ) : (
              <Icon
                name="favorite"
                style={{ color: theme.foregroundAlt, fontSize: 20 }}
              />
            )}
          </Pressable>
          <Pressable
            style={styles.buttonSmall}
            android_ripple={androidRipple}
            onPress={() => {
              navigation.goBack()
              navigationHook.navigate('Queue')
            }}
          >
            <Icon
              name="queue_music"
              style={{ color: theme.foreground, fontSize: 20 }}
            />
          </Pressable>
          <Pressable
            style={styles.buttonSmall}
            android_ripple={androidRipple}
            onPress={() => {}}
          >
            <Icon
              name="more_vert"
              style={{ color: theme.foreground, fontSize: 20 }}
            />
          </Pressable>
        </View>
      </View>
    </View>
  )
}

export default Player
