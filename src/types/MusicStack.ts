import Item from 'jellyfin-api/lib/types/media/Item'

type MusicStack = {
  MusicHome: undefined
  Favorites: undefined
  Songs: undefined
  Albums: undefined
  Album: { album: Item }
}

export default MusicStack
