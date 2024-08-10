import { useEffect, useRef, useState } from 'react'
import { FlatList, Pressable, Text, View } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { State, usePlaybackState, useProgress } from 'react-native-track-player'
import { Blurhash } from 'react-native-blurhash'

import RootStack from 'types/RootStack'
import useClient from 'hooks/useClient'
import useTheme from 'hooks/useTheme'
import usePlayer from 'hooks/usePlayer'
import useLyrics from 'api/useLyrics'
import useInterval from 'hooks/useInterval'
import { Icon } from 'components/Icon'
import Switch from 'components/Switch'
import secsToTicks from 'lib/secsToTicks'

const Lyrics = ({ navigation }: StackScreenProps<RootStack, 'Lyrics'>) => {
  const client = useClient()
  const theme = useTheme()
  const player = usePlayer()
  const playerProgress = useProgress()
  const playerState = usePlaybackState()
  const insets = useSafeAreaInsets()

  const track = player.queue.length > 0 ? player.queue[player.track] : null
  const lyrics = useLyrics(!!track ? track.Id : null, !!track)
  const [timed, setTimed] = useState<boolean>(false)
  const [follow, setFollow] = useState<boolean>(true)
  const [current, setCurrent] = useState<number>(null)
  const [accuratePosition, setAccuratePosition] = useState<number>(0)
  const lyricsRef = useRef<FlatList>()

  useEffect(() => {
    if (lyrics.data && 'Start' in lyrics.data.Lyrics[0]) {
      setTimed(true)
    } else {
      setTimed(false)
    }
  }, [lyrics])

  useEffect(() => {
    if (timed && !!lyrics.data) {
      const position = secsToTicks(accuratePosition)
      for (let i = 0; i < lyrics.data.Lyrics.length; i++) {
        const start = lyrics.data.Lyrics[i].Start
        if (start >= position + 200_0000) {
          if (i == 0) {
            setCurrent(null)
            break
          }
          setCurrent(i - 1)
          break
        }
      }
    }
  }, [accuratePosition])

  useEffect(() => {
    if (timed && follow && current)
      lyricsRef.current.scrollToIndex({
        index: current,
        animated: true,
        viewPosition: 0.5,
      })
  }, [follow, current])

  useEffect(() => {
    setAccuratePosition(playerProgress.position)
  }, [playerProgress.position])

  useInterval(() => {
    if (
      playerState.state === State.Playing &&
      playerProgress.position !== accuratePosition + 0.1
    ) {
      setAccuratePosition(accuratePosition + 0.1)
    }
  }, 100)

  const blurhash =
    'Primary' in track.ImageBlurHashes
      ? track.ImageBlurHashes.Primary[
          'Primary' in track.ImageTags
            ? track.ImageTags.Primary
            : track.AlbumPrimaryImageTag
        ]
      : null

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
          flex: 1,
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom + 16,
        }}
      >
        <View
          style={{
            paddingHorizontal: 24,
            paddingBottom: 16,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 16,
            justifyContent: 'space-between',
          }}
        >
          <Pressable
            style={{
              width: 32,
              height: 32,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            android_ripple={{
              color: theme.ripple,
              borderless: true,
              foreground: true,
            }}
            onPress={() => {
              navigation.goBack()
            }}
          >
            <Icon
              name="arrow_back"
              style={{
                color: theme.foreground,
                fontSize: 24,
              }}
            />
          </Pressable>
          {timed && (
            <Pressable
              style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}
              onPress={() => setFollow(!follow)}
            >
              <Text
                style={{
                  color: theme.foreground,
                  fontSize: 16,
                  fontFamily: theme.font400,
                }}
              >
                Follow
              </Text>
              <Switch state={follow} />
            </Pressable>
          )}
        </View>
        {!!lyrics.data && (
          <FlatList
            ref={lyricsRef}
            data={lyrics.data.Lyrics}
            renderItem={({ item: lyric, index }) => (
              <Text
                style={{
                  color: timed
                    ? current === index
                      ? theme.foreground
                      : theme.foregroundAlt
                    : theme.foreground,
                  fontSize: 20,
                  fontFamily: theme.font500,
                  paddingHorizontal: 32,
                }}
              >
                {lyric.Text}
              </Text>
            )}
            contentContainerStyle={{ gap: 8 }}
            onScrollToIndexFailed={() => {}}
            onContentSizeChange={() => {
              if (timed && follow && current)
                lyricsRef.current.scrollToIndex({
                  index: current,
                  animated: true,
                  viewPosition: 0.5,
                })
            }}
            scrollEnabled={!follow}
          />
        )}
      </View>
    </View>
  )
}

export default Lyrics
