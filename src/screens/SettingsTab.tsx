import { useEffect, useState } from 'react'
import { useWindowDimensions, View } from 'react-native'
import Modal from 'react-native-modal'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import ColorPicker, {
  HueSlider,
  Panel1,
  Preview,
  Swatches,
} from 'reanimated-color-picker'

import useClient from 'hooks/useClient'
import useSettings from 'hooks/useSettings'
import useTheme from 'hooks/useTheme'
import InnerScreen from 'components/InnerScreen'
import SettingsList from 'components/SettingsList'
import Switch from 'components/Switch'
import Button from 'components/Button'
import ModalButton from 'components/modals/ModalButton'
import usePlayer from 'hooks/usePlayer'

const SettingsTab = () => {
  const client = useClient()
  const player = usePlayer()
  const settings = useSettings()
  const theme = useTheme()
  const { height } = useWindowDimensions()
  const insets = useSafeAreaInsets()

  const [colorModal, setColorModal] = useState<boolean>(false)
  const [color, setColor] = useState<string>(theme.tint)

  const [bitrateModal, setBitrateModal] = useState<boolean>(false)
  const [bitrateChanged, setBitrateChanged] = useState<boolean>(false)

  useEffect(() => {
    if (bitrateChanged) {
      if (player.queue.length > 0) player.setQueue(player.queue, player.track)
      setBitrateChanged(false)
    }
  }, [settings.bitrate])

  return (
    <>
      <InnerScreen title="Settings" showBackButton={false}>
        <SettingsList title={client.name} icon="public" onPress={() => {}} />

        <SettingsList
          title="Audio Normalization"
          description="Normalizes volume of each track"
          icon="headphones"
          right={<Switch state={settings.gain} />}
          onPress={() => {
            settings.setGain(!settings.gain)
          }}
        />

        <SettingsList
          title="Bitrate Limit"
          description={
            settings.bitrate === 140_000_000
              ? 'None'
              : Math.round(settings.bitrate / 1000) + ' kbps'
          }
          icon="audio_file"
          onPress={() => {
            setBitrateModal(true)
          }}
        />

        <SettingsList
          title="Dark Mode"
          description=""
          icon="dark_mode"
          right={<Switch state={theme.dark} />}
          onPress={() => {
            theme.setDark(!theme.dark)
          }}
        />
        <SettingsList
          title="Theme Color"
          description={theme.tint}
          icon="palette"
          right={
            <View
              style={{
                backgroundColor: theme.tint,
                width: 24,
                height: 24,
                borderRadius: 12,
                overflow: 'hidden',
              }}
            />
          }
          onPress={() => {
            setColorModal(true)
          }}
        />
      </InnerScreen>

      <Modal
        isVisible={colorModal}
        onBackButtonPress={() => setColorModal(false)}
        onBackdropPress={() => setColorModal(false)}
        animationIn="fadeInUp"
        animationOut="fadeOutDown"
        animationInTiming={200}
        animationOutTiming={200}
        useNativeDriver={true}
        statusBarTranslucent={true}
        deviceHeight={height + insets.top + insets.bottom}
        swipeDirection="down"
      >
        <View style={{ paddingHorizontal: 16 }}>
          <View
            style={{
              backgroundColor: theme.scheme.background,
              borderRadius: 16,
              overflow: 'hidden',
              padding: 16,
            }}
          >
            <ColorPicker
              value={theme.tint}
              onComplete={(color) => setColor(color.hex)}
            >
              <Preview style={{ marginBottom: 8 }} />
              <Panel1 style={{ marginBottom: 8 }} />
              <HueSlider style={{ marginBottom: 8 }} />
              <Swatches
                colors={[
                  '#ffd7f4',
                  '#9e515f',
                  '#bc8e68',
                  '#549e68',
                  '#4398a9',
                  '#54549e',
                ]}
              />
            </ColorPicker>
            <Button
              onPress={() => {
                theme.setTint(color)
                setColorModal(false)
              }}
            >
              Select
            </Button>
          </View>
        </View>
      </Modal>

      <Modal
        isVisible={bitrateModal}
        onBackButtonPress={() => setBitrateModal(false)}
        onBackdropPress={() => setBitrateModal(false)}
        animationIn="fadeInUp"
        animationOut="fadeOutDown"
        animationInTiming={200}
        animationOutTiming={200}
        useNativeDriver={true}
        statusBarTranslucent={true}
        deviceHeight={height + insets.top + insets.bottom}
        swipeDirection="down"
      >
        <View style={{ paddingHorizontal: 16 }}>
          <View
            style={{
              backgroundColor: theme.scheme.background,
              borderRadius: 16,
              overflow: 'hidden',
            }}
          >
            <ModalButton
              text="128 kbps"
              icon="music_note"
              onPress={() => {
                settings.setBitrate(128_000)
                setBitrateChanged(true)
                setBitrateModal(false)
              }}
              useTheme={true}
            />
            <ModalButton
              text="320 kbps"
              icon="music_note"
              onPress={() => {
                settings.setBitrate(320_000)
                setBitrateChanged(true)
                setBitrateModal(false)
              }}
              useTheme={true}
            />
            <ModalButton
              text="448 kbps"
              icon="music_note"
              onPress={() => {
                settings.setBitrate(448_000)
                setBitrateChanged(true)
                setBitrateModal(false)
              }}
              useTheme={true}
            />
            <ModalButton
              text="640 kbps"
              icon="music_note"
              onPress={() => {
                settings.setBitrate(640_000)
                setBitrateChanged(true)
                setBitrateModal(false)
              }}
              useTheme={true}
            />
            <ModalButton
              text="1000 kbps"
              icon="music_note"
              onPress={() => {
                settings.setBitrate(1_000_000)
                setBitrateChanged(true)
                setBitrateModal(false)
              }}
              useTheme={true}
            />
            <ModalButton
              text="2000 kbps"
              icon="music_note"
              onPress={() => {
                settings.setBitrate(2_000_000)
                setBitrateChanged(true)
                setBitrateModal(false)
              }}
              useTheme={true}
            />
            <ModalButton
              text="No limit"
              icon="music_note"
              onPress={() => {
                settings.setBitrate(140_000_000)
                setBitrateChanged(true)
                setBitrateModal(false)
              }}
              useTheme={true}
            />
          </View>
        </View>
      </Modal>
    </>
  )
}

export default SettingsTab
