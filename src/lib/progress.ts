import { sessions } from 'jellyfin-api'
import ProgressQuery, {
  ProgressStoppedQuery,
} from 'jellyfin-api/lib/types/queries/ProgressQuery'
import TrackPlayer, { State } from 'react-native-track-player'

import useClient from 'hooks/useClient'
import usePlayer from 'hooks/usePlayer'
import secsToTicks from './secsToTicks'

export const playing = async (
  event: 'timeupdate' | 'pause' | 'unpause' | undefined,
  itemID?: string,
) => {
  const position = (await TrackPlayer.getProgress()).position
  const state = (await TrackPlayer.getPlaybackState()).state
  const payload: ProgressQuery = {
    CanSeek: true,
    ItemId: itemID ?? usePlayer.getState().trackID,
    MediaSourceId: itemID ?? usePlayer.getState().trackID,
    EventName: event,
    IsPaused: state !== State.Playing,
    IsMuted: false,
    VolumeLevel: 100,
    PositionTicks: secsToTicks(position),
    PlayMethod: 'Transcode',
    RepeatMode:
      usePlayer.getState().repeat === 'off'
        ? 'RepeatNone'
        : usePlayer.getState().repeat === 'queue'
        ? 'RepeatAll'
        : 'RepeatOne',
  }
  if (event === undefined) {
    await sessions.playing(useClient.getState().api, payload)
  } else {
    await sessions.playingProgress(useClient.getState().api, payload)
  }
}

export const stopped = async (
  itemID?: string,
  position?: number,
  failed: boolean = false,
) => {
  const payload: ProgressStoppedQuery = {
    ItemId: itemID ?? usePlayer.getState().trackID,
    MediaSourceId: itemID ?? usePlayer.getState().trackID,
    PositionTicks: secsToTicks(position),
    Failed: failed,
  }
  await sessions.playingStopped(useClient.getState().api, payload)
}
