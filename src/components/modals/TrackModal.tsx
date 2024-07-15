import {
  GestureResponderEvent,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from 'react-native'
import Modal from 'react-native-modal'
import { Blurhash } from 'react-native-blurhash'
import tinycolor from 'tinycolor2'
import Item from 'jellyfin-api/lib/types/media/Item'

import usePlayer from 'hooks/usePlayer'
import useTheme from 'hooks/useTheme'
import { Icon, IconFilled } from 'components/Icon'
import TrackListItem from 'components/TrackListItem'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface Props {
  visible: boolean
  onClose: () => void
  track: Item
}

const TrackModal = ({ visible, onClose, track }: Props) => {
  const player = usePlayer()
  const theme = useTheme()
  const { height } = useWindowDimensions()
  const insets = useSafeAreaInsets()

  if (!track) return null

  const blurhash =
    'Primary' in track.ImageBlurHashes
      ? track.ImageBlurHashes.Primary[
          'Primary' in track.ImageTags
            ? track.ImageTags.Primary
            : track.AlbumPrimaryImageTag
        ]
      : null
  // const averageColor = blurhash
  //   ? tinycolor(Blurhash.getAverageColor(blurhash))
  //   : tinycolor(theme.background)

  // const finalColor = averageColor.isDark()
  //   ? averageColor.toHex8String()
  //   : averageColor.darken(10).toHex8String()

  return (
    <Modal
      isVisible={visible}
      onBackButtonPress={onClose}
      onBackdropPress={onClose}
      animationIn="fadeInUp"
      animationOut="fadeOutDown"
      animationInTiming={200}
      animationOutTiming={200}
      useNativeDriver={true}
      statusBarTranslucent={true}
      deviceHeight={height + insets.top + insets.bottom}
    >
      <View style={{ paddingHorizontal: 16 }}>
        <View
          style={{
            backgroundColor: '#000',
            borderRadius: 16,
            overflow: 'hidden',
          }}
        >
          {!!blurhash && (
            <>
              <Blurhash
                blurhash={blurhash}
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
            </>
          )}
          <View style={{ paddingVertical: 8, gap: 4 }}>
            <TrackListItem track={track} playing={false} />
            <Button
              text="Play"
              icon="play_arrow"
              iconFilled={true}
              onPress={() => {
                player.setQueue([track])
                player.play()
                onClose()
              }}
            />
            <Button
              text="Play next"
              icon="playlist_play"
              onPress={() => {
                player.nextQueue([track])
                onClose()
              }}
            />
            <Button
              text="Add to queue"
              icon="playlist_add"
              onPress={() => {
                player.addQueue([track])
                onClose()
              }}
            />
            <Button
              text="Add to playlist"
              icon="playlist_add"
              onPress={() => {}}
            />

            <Separator />

            <Button text="View album" icon="album" onPress={() => {}} />
            <Button
              text="View artist"
              icon="artist"
              iconFilled={true}
              onPress={() => {}}
            />
          </View>
        </View>
      </View>
    </Modal>
  )
}

interface ButtonProps {
  text: string
  icon: string
  iconFilled?: boolean
  onPress?: (e: GestureResponderEvent) => void
}

const Button = ({ text, icon, iconFilled = false, onPress }: ButtonProps) => {
  const theme = useTheme()

  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 8,
        gap: 16,
      }}
      android_ripple={{ color: theme.ripple }}
    >
      {iconFilled ? (
        <IconFilled
          name={icon}
          style={{ color: theme.foreground, fontSize: 24 }}
        />
      ) : (
        <Icon name={icon} style={{ color: theme.foreground, fontSize: 24 }} />
      )}
      <Text
        style={{
          color: theme.foreground,
          fontFamily: theme.font500,
          fontSize: 20,
        }}
      >
        {text}
      </Text>
    </Pressable>
  )
}

const Separator = () => {
  const theme = useTheme()

  return (
    <View
      style={{
        flexGrow: 1,
        height: 1,
        backgroundColor: theme.foregroundAlt,
        marginHorizontal: 16,
        marginVertical: 4,
      }}
    />
  )
}

export default TrackModal
