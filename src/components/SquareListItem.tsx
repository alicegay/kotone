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

  const blurhash =
    'Primary' in item.ImageBlurHashes
      ? item.ImageBlurHashes.Primary[
          'Primary' in item.ImageTags
            ? item.ImageTags.Primary
            : item.AlbumPrimaryImageTag
        ]
      : null

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={[style]}
      android_ripple={{ color: theme.scheme.ripple, foreground: true }}
    >
      <View
        style={{
          width: 128,
          height: 128,
          borderRadius: 16,
          overflow: 'hidden',
          backgroundColor: '#0000',
        }}
      >
        <FasterImageView
          source={{ url: image, resizeMode: 'cover', blurhash: blurhash }}
          style={{ width: '100%', height: '100%' }}
        />
      </View>
      <View style={{ width: 128 }}>
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
