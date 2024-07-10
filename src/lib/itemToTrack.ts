import DeviceInfo from 'react-native-device-info'
import { Track } from 'react-native-track-player'
import Item from 'jellyfin-api/lib/types/media/Item'
import useClient from 'hooks/useClient'

const itemToTrack = (item: Item): Track => {
  const server = useClient.getState().server

  // const auth =
  //   'MediaBrowser Client="' +
  //   DeviceInfo.getApplicationName() +
  //   '", Device="' +
  //   useClient.getState().deviceName +
  //   '", DeviceId="' +
  //   useClient.getState().deviceID +
  //   '", Version="' +
  //   DeviceInfo.getVersion() +
  //   '", Token="' +
  //   useClient.getState().token +
  //   '"'

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
    'maxStreamingBitrate=140000000',
    'container=' +
      'opus,webm|opus,mp3,aac,m4a|aac,m4b|aac,flac,webma,webm|webma,wav,ogg',
    'transcodingContainer=ts',
    'transcodingProtocol=hls',
    'audioCodec=aac',
    'api_key=' + useClient.getState().token,
  ]

  return {
    url: url + params.join('&'),
    // headers: {
    //   Authorization: auth,
    // },
    id: item.Id,
    title: item.Name,
    artist: item.Artists.join(', '),
    album: item.Album,
    artwork: image,
  }
}

export default itemToTrack
