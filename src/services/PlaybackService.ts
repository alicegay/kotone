import usePlayer from 'hooks/usePlayer'
import TrackPlayer, { Event } from 'react-native-track-player'

const PlaybackService = async () => {
  TrackPlayer.addEventListener(Event.RemotePlay, () =>
    usePlayer.getState().play(),
  )
  TrackPlayer.addEventListener(Event.RemotePause, () =>
    usePlayer.getState().pause(),
  )

  // TrackPlayer.addEventListener(Event.PlaybackState, (state) =>
  //   console.log(state),
  // )
  TrackPlayer.addEventListener(Event.PlayerError, (error) => console.log(error))

  TrackPlayer.addEventListener(Event.PlaybackActiveTrackChanged, (event) => {
    if (usePlayer.getState().queue.length > event.index) {
      usePlayer.getState().setTrack(event.index, true)
      if ('NormalizationGain' in usePlayer.getState().queue[event.index]) {
        const gain = Math.pow(
          10,
          usePlayer.getState().queue[event.index].NormalizationGain / 20,
        )
        console.log('gain', gain)
        TrackPlayer.setVolume(gain)
      } else {
        TrackPlayer.setVolume(1.0)
      }
    }
  })

  TrackPlayer.addEventListener(Event.PlaybackProgressUpdated, (event) => {
    // TODO)) playback reporting
  })
}

export default PlaybackService
