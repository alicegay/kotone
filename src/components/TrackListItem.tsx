import { GestureResponderEvent, Pressable, Text, View } from 'react-native'
import Item from 'jellyfin-api/lib/types/media/Item'

import useClient from 'hooks/useClient'
import usePlayer from 'hooks/usePlayer'
import useTheme, { Scheme } from 'hooks/useTheme'
import ticksToTime from 'lib/ticksToTime'
import { Icon } from 'components/Icon'
import { FasterImageView } from '@candlefinance/faster-image'
import { Album, Playlist, Track } from 'types/ItemTypes'

interface Props {
  track: Track | Album | Playlist | Item
  onPress?: (e: GestureResponderEvent) => void
  onLongPress?: (e: GestureResponderEvent) => void
  onDragStart?: (e: GestureResponderEvent) => void
  onDragEnd?: (e: GestureResponderEvent) => void
  isDragging?: boolean
  showAlbumArt?: boolean
  showArtist?: boolean
  showDuration?: boolean
  trackNumber?: number
  playing?: boolean | 'auto'
  scheme?: Scheme
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
  showDuration = true,
  trackNumber,
  playing = 'auto',
  scheme,
}: Props) => {
  const client = useClient()
  const player = usePlayer()
  const theme = useTheme()

  if (!track) return null

  const image =
    'Primary' in track.ImageTags
      ? client.server + '/Items/' + track.Id + '/Images/Primary?maxHeight=96'
      : 'AlbumPrimaryImageTag' in track && track.AlbumPrimaryImageTag
      ? client.server +
        '/Items/' +
        track.AlbumId +
        '/Images/Primary?maxHeight=96'
      : null

  const isPlaying = playing === 'auto' ? player.trackID == track.Id : playing

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={300}
      disabled={isDragging || (!onPress && !onLongPress)}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 4,
        gap: 16,
      }}
      android_ripple={{ color: !!scheme ? scheme.ripple : theme.ripple }}
    >
      {showAlbumArt && (
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 8,
            overflow: 'hidden',
            backgroundColor: !!scheme ? scheme.primaryContainer : '#222',
          }}
        >
          {!!image && (
            <FasterImageView
              source={{ url: image, resizeMode: 'cover' }}
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
                name="equalizer"
                style={{ color: theme.foreground, fontSize: 32 }}
              />
            </View>
          )}
        </View>
      )}

      {(!!trackNumber || trackNumber === 0) && isPlaying ? (
        <Icon
          name="equalizer"
          style={{
            color: !!scheme ? scheme.primary : theme.foreground,
            fontSize: 24,
            width: 24,
          }}
        />
      ) : (
        (!!trackNumber || trackNumber === 0) && (
          <Text
            style={{
              color: !!scheme ? scheme.primary : theme.foreground,
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
            color: !!scheme ? scheme.primary : theme.foreground,
            fontFamily: theme.font500,
            fontSize: 16,
          }}
          numberOfLines={showAlbumArt && !showArtist ? 2 : 1}
        >
          {track.Name}
        </Text>
        {showArtist && track.Type !== 'Playlist' && (
          <Text
            style={{
              color: !!scheme ? scheme.secondary : theme.foregroundAlt,
              fontFamily: theme.font400,
              fontSize: 14,
            }}
            numberOfLines={1}
          >
            {track.Type === 'MusicAlbum'
              ? track.AlbumArtist
              : // @ts-ignore
                track.Artists.join(', ')}
          </Text>
        )}
      </View>

      {!onDragStart && showDuration && (
        <Text
          style={{
            color: !!scheme ? scheme.secondary : theme.foregroundAlt,
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
            style={{
              color: !!scheme ? scheme.secondary : theme.foregroundAlt,
              fontSize: 20,
            }}
          />
        </Pressable>
      )}
    </Pressable>
  )
}

export default TrackListItem
