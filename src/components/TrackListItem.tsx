import { useEffect, useState } from 'react'
import {
  GestureResponderEvent,
  Image,
  Pressable,
  Text,
  View,
} from 'react-native'
import Item from 'jellyfin-api/lib/types/media/Item'
import useClient from 'hooks/useClient'
import useTheme from 'hooks/useTheme'
import ticksToTime from 'lib/ticksToTime'

interface Props {
  track: Item
  onPress?: (e: GestureResponderEvent) => void
  onLongPress?: (e: GestureResponderEvent) => void
  showAlbumArt?: boolean
  showArtist?: boolean
  trackNumber?: number
}

const TrackListItem = ({
  track,
  onPress,
  onLongPress,
  showAlbumArt = true,
  showArtist = true,
  trackNumber,
}: Props) => {
  const client = useClient()
  const theme = useTheme()

  // const [image, setImage] = useState<string>(null)

  // useEffect(() => {
  //   if ('Primary' in track.ImageTags) {
  //     setImage(client.server + '/Items/' + track.Id + '/Images/Primary')
  //   } else if (track.AlbumPrimaryImageTag) {
  //     setImage(client.server + '/Items/' + track.AlbumId + '/Images/Primary')
  //   } else {
  //     setImage(null)
  //   }
  // }, [])

  const image =
    'Primary' in track.ImageTags
      ? client.server + '/Items/' + track.Id + '/Images/Primary'
      : track.AlbumPrimaryImageTag
      ? client.server + '/Items/' + track.AlbumId + '/Images/Primary'
      : null

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={{
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
          style={{ width: 48, height: 48, borderRadius: 8, overflow: 'hidden' }}
        >
          {!!image && (
            <Image
              source={{ uri: image }}
              style={{ width: '100%', height: '100%' }}
            />
          )}
        </View>
      )}

      {(!!trackNumber || trackNumber === 0) && (
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

      <Text
        style={{
          color: theme.foregroundAlt,
          fontFamily: theme.font400,
          fontSize: 14,
        }}
      >
        {ticksToTime(track.RunTimeTicks)}
      </Text>
    </Pressable>
  )
}

export default TrackListItem
