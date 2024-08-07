import { FasterImageView } from '@candlefinance/faster-image'
import useClient from 'hooks/useClient'
import useTheme from 'hooks/useTheme'
import Item from 'jellyfin-api/lib/types/media/Item'
import {
  GestureResponderEvent,
  Pressable,
  StyleProp,
  Text,
  View,
  ViewStyle,
} from 'react-native'
import { Album, Playlist, Track } from 'types/ItemTypes'

type NewType = GestureResponderEvent

interface Props {
  item: Item
  onPress?: (e: GestureResponderEvent) => void
  onLongPress?: (e: NewType) => void
  style?: StyleProp<ViewStyle>
}

const SquareListItem = ({ item, onPress, onLongPress, style }: Props) => {
  const client = useClient()
  const theme = useTheme()

  const image =
    'Primary' in item.ImageTags
      ? client.server + '/Items/' + item.Id + '/Images/Primary?maxHeight=256'
      : 'AlbumPrimaryImageTag' in item && item.AlbumPrimaryImageTag
      ? client.server +
        '/Items/' +
        item.AlbumId +
        '/Images/Primary?maxHeight=256'
      : null

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={[{ width: 128 }, style]}
      android_ripple={{ color: theme.scheme.ripple, foreground: true }}
    >
      <View
        style={{
          width: 128,
          height: 128,
          borderRadius: 8,
          overflow: 'hidden',
          backgroundColor: '#0000',
        }}
      >
        <FasterImageView
          source={{ url: image, resizeMode: 'cover' }}
          style={{ width: '100%', height: '100%' }}
        />
      </View>
      <View>
        <Text
          style={{
            color: theme.scheme.primary,
            fontFamily: theme.font500,
          }}
          numberOfLines={2}
        >
          {item.Name}
        </Text>
        <Text
          style={{
            color: theme.scheme.secondary,
            fontFamily: theme.font400,
          }}
          numberOfLines={1}
        >
          {item.AlbumArtist}
        </Text>
      </View>
    </Pressable>
  )
}

export default SquareListItem
