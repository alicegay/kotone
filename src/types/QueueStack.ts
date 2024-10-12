import Item from 'jellyfin-api/lib/types/media/Item'
import { Album } from './ItemTypes'

type QueueStack = {
  QueueHome: undefined
  SongList: { type: string }
  AlbumList: { type: string }
  ArtistList: { type: string }
  Album: { album: Album | Item | string }
  Artist: { artist: string }
}

export default QueueStack
