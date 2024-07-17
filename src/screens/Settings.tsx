import { useState } from 'react'
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

const Settings = () => {
  const client = useClient()
  const settings = useSettings()
  const theme = useTheme()
  const { height } = useWindowDimensions()
  const insets = useSafeAreaInsets()

  const [colorModal, setColorModal] = useState<boolean>(false)
  const [color, setColor] = useState<string>(theme.tint)

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
                  '#b696c0',
                  '#9e515f',
                  // '#741224',
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
    </>
  )
}

export default Settings
