import Item from 'jellyfin-api/lib/types/media/Item'

type MusicStack = {
  MusicHome: undefined
  SongList: { type: string }
  AlbumList: { type: string }
  ArtistList: { type: string }
  Album: { album: Item | string }
  Artist: { artist: Item | string }
}

export default MusicStack
