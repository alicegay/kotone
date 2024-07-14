import usePlayer from 'hooks/usePlayer'
import { playing, stopped } from 'lib/progress'
import TrackPlayer, { Event, State } from 'react-native-track-player'

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

  TrackPlayer.addEventListener(
    Event.PlaybackActiveTrackChanged,
    async (event) => {
      if (usePlayer.getState().queue.length > event.index) {
        usePlayer.getState().setTrack(event.index, true)
        if ('NormalizationGain' in usePlayer.getState().queue[event.index]) {
          const gain = Math.pow(
            10,
            usePlayer.getState().queue[event.index].NormalizationGain / 20,
          )
          await TrackPlayer.setVolume(gain)
        } else {
          await TrackPlayer.setVolume(1.0)
        }
      }

      if ('track' in event && event.lastTrack) {
        const lastID = usePlayer.getState().queue[event.lastIndex].Id
        await stopped(lastID, event.lastTrack.duration)
      }
      const trackID = usePlayer.getState().queue[event.index].Id
      await playing(undefined, trackID)
    },
  )

  TrackPlayer.addEventListener(Event.PlaybackProgressUpdated, async (event) => {
    await playing('timeupdate')
  })

  TrackPlayer.addEventListener(Event.PlaybackState, async (event) => {
    if (event.state === State.Paused) {
      await playing('pause')
    } else if (event.state === State.Playing) {
      await playing('unpause')
    } else if (event.state === State.Stopped) {
      await stopped()
    }
  })
}

export default PlaybackService
