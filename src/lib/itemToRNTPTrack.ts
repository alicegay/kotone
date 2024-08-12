import { Track as RNTPTrack, TrackType } from 'react-native-track-player'
import Item from 'jellyfin-api/lib/types/media/Item'
import useClient from 'hooks/useClient'
import { Track } from 'types/ItemTypes'
import useSettings from 'hooks/useSettings'
import { Platform } from 'react-native'

const itemToRNTPTrack = (item: Item | Track): RNTPTrack => {
  const server = useClient.getState().server

  let transcode = false

  const containers = ['opus', 'webm', 'mp3', 'aac', 'm4a', 'flac', 'wav', 'ogg']

  if (
    'Bitrate' in item &&
    'Container' in item &&
    item.Bitrate &&
    item.Container
  ) {
    if (item.Bitrate > useSettings.getState().bitrate) transcode = true
    if (!containers.includes(item.Container)) transcode = true
  } else if ('MediaSources' in item) {
    if (item.MediaSources[0].Bitrate > useSettings.getState().bitrate)
      transcode = true
    if (!containers.includes(item.MediaSources[0].Container)) transcode = true
  }
  if (item.Type === 'MusicVideo') transcode = false

  const image =
    'Primary' in item.ImageTags
      ? server + '/Items/' + item.Id + '/Images/Primary'
      : item.AlbumPrimaryImageTag
      ? server + '/Items/' + item.AlbumId + '/Images/Primary'
      : null

  const url = server + '/Audio/' + item.Id + '/universal?'
  const params = [
    'userId=' + useClient.getState().user,
    'deviceId=' + useClient.getState().deviceID,
    transcode
      ? 'audioBitRate=' + useSettings.getState().bitrate
      : 'maxStreamingBitrate=' +
        (item.Type === 'MusicVideo' && useSettings.getState().bitrate > 640_000
          ? 640_000
          : useSettings.getState().bitrate),
    transcode ? '' : 'container=' + containers.join(','),
    transcode ? 'transcodingProtocol=hls' : 'transcodingProtocol=http',
    transcode
      ? 'transcodingContainer=ts'
      : Platform.OS === 'ios'
      ? 'transcodingContainer=aac'
      : 'transcodingContainer=ogg',
    transcode || Platform.OS === 'ios' ? 'audioCodec=aac' : 'audioCodec=opus',
    'maxAudioSampleRate=48000',
    'maxAudioBitDepth=16',
    'transcodingAudioChannels=2',
    'apiKey=' + useClient.getState().token,
  ]

  return {
    url: url + params.join('&'),
    id: item.Id,
    title: item.Name,
    artist: item.Artists.join(', '),
    album: item.Album,
    artwork: image,
    type: transcode ? TrackType.HLS : TrackType.Default,
  }
}

export default itemToRNTPTrack
