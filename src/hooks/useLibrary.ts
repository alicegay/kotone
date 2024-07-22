import Item from 'jellyfin-api/lib/types/media/Item'
import itemToType from 'lib/itemToType'
import { Album, Playlist, Track } from 'types/ItemTypes'
import { create } from 'zustand'

interface LibraryStore {
  views: Item[]
  viewIDs: { [key: string]: string }
  songs: Track[]
  albums: Album[]
  artists: Item[]
  playlists: Playlist[]
  favorites: Track[]
  musicvideos: Item[]

  setViews: (views: Item[]) => void
  setViewIDs: (viewIDs: { [key: string]: string }) => void
  setSongs: (songs: Item[]) => void
  setAlbums: (albums: Item[]) => void
  setArtists: (artists: Item[]) => void
  setPlaylists: (playlists: Item[]) => void
  setFavorites: (favorites: Item[]) => void
  setMusicvideos: (musicvideos: Item[]) => void
}

const useLibrary = create<LibraryStore>()((set) => ({
  views: null,
  viewIDs: null,
  songs: null,
  albums: null,
  artists: null,
  playlists: null,
  favorites: null,
  musicvideos: null,

  setViews: (views) => {
    set(() => ({ views: views }))
  },
  setViewIDs: (viewIDs) => {
    set(() => ({ viewIDs: viewIDs }))
  },
  setSongs: (songs) => {
    const items = songs.map((item) => itemToType(item) as Track)
    set(() => ({ songs: items }))
  },
  setAlbums: (albums) => {
    const items = albums.map((item) => itemToType(item) as Album)
    set(() => ({ albums: items }))
  },
  setArtists: (artists) => {
    set(() => ({ artists: artists }))
  },
  setPlaylists: (playlists) => {
    const items = playlists.map((item) => itemToType(item) as Playlist)
    set(() => ({ playlists: items }))
  },
  setFavorites: (favorites) => {
    const items = favorites.map((item) => itemToType(item) as Track)
    set(() => ({ favorites: items }))
  },
  setMusicvideos: (musicvideos) => {
    set(() => ({ musicvideos: musicvideos }))
  },
}))

export default useLibrary
