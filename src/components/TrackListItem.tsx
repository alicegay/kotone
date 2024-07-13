import {
  GestureResponderEvent,
  Image,
  Pressable,
  Text,
  View,
} from 'react-native'
import Item from 'jellyfin-api/lib/types/media/Item'

import useClient from 'hooks/useClient'
import usePlayer from 'hooks/usePlayer'
import useTheme from 'hooks/useTheme'
import ticksToTime from 'lib/ticksToTime'
import { Icon } from 'components/Icon'

interface Props {
  track: Item
  onPress?: (e: GestureResponderEvent) => void
  onLongPress?: (e: GestureResponderEvent) => void
  onDragStart?: (e: GestureResponderEvent) => void
  onDragEnd?: (e: GestureResponderEvent) => void
  isDragging?: boolean
  showAlbumArt?: boolean
  showArtist?: boolean
  trackNumber?: number
  playing?: boolean | 'auto'
}

const TrackListItem = ({
  track,
  onPress,
  onLongPress,
  onDragStart,
  onDragEnd,
  isDragging = false,
  showAlbumArt = true,
  showArtist = true,
  trackNumber,
  playing = 'auto',
}: Props) => {
  const client = useClient()
  const player = usePlayer()
  const theme = useTheme()

  if (!track) return null

  const image =
    'Primary' in track.ImageTags
      ? client.server + '/Items/' + track.Id + '/Images/Primary'
      : track.AlbumPrimaryImageTag
      ? client.server + '/Items/' + track.AlbumId + '/Images/Primary'
      : null

  const isPlaying = playing === 'auto' ? player.trackID == track.Id : playing

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      disabled={isDragging}
      style={{
        //flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 4,
        gap: 16,
      }}
      android_ripple={{ color: '#fff2' }}
    >
      {showAlbumArt && (
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 8,
            overflow: 'hidden',
          }}
        >
          {!!image && (
            <Image
              source={{ uri: image }}
              style={{ width: '100%', height: '100%' }}
            />
          )}
          {isPlaying && (
            <View
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                backgroundColor: '#0006',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon
                name="music_note"
                style={{ color: theme.foreground, fontSize: 32 }}
              />
            </View>
          )}
        </View>
      )}

      {(!!trackNumber || trackNumber === 0) && isPlaying ? (
        <Icon
          name="music_note"
          style={{ color: theme.foreground, fontSize: 24, width: 24 }}
        />
      ) : (
        (!!trackNumber || trackNumber === 0) && (
          <Text
            style={{
              color: theme.foreground,
              fontFamily: theme.font700,
              fontSize: 14,
              width: 24,
              textAlign: 'center',
            }}
          >
            {trackNumber}
          </Text>
        )
      )}

      <View
        style={{
          flexGrow: 1,
          flexShrink: 1,
          height: 48,
          justifyContent: 'center',
        }}
      >
        <Text
          style={{
            color: theme.foreground,
            fontFamily: theme.font500,
            fontSize: 16,
          }}
          numberOfLines={showAlbumArt && !showArtist ? 2 : 1}
        >
          {track.Name}
        </Text>
        {showArtist && (
          <Text
            style={{
              color: theme.foregroundAlt,
              fontFamily: theme.font400,
              fontSize: 14,
            }}
            numberOfLines={1}
          >
            {track.Artists.join(', ')}
          </Text>
        )}
      </View>

      {!onDragStart && (
        <Text
          style={{
            color: theme.foregroundAlt,
            fontFamily: theme.font400,
            fontSize: 14,
          }}
        >
          {ticksToTime(track.RunTimeTicks)}
        </Text>
      )}

      {!!onDragStart && !!onDragEnd && (
        <Pressable
          onPressIn={onDragStart}
          onPressOut={onDragEnd}
          style={{
            height: 48,
            width: 48,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          android_ripple={{
            color: theme.ripple,
            borderless: true,
            foreground: true,
          }}
        >
          <Icon
            name="menu"
            style={{ color: theme.foregroundAlt, fontSize: 20 }}
          />
        </Pressable>
      )}
    </Pressable>
  )
}

export default TrackListItem
