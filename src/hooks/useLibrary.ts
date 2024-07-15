import Item from 'jellyfin-api/lib/types/media/Item'
import { create } from 'zustand'

interface LibraryStore {
  views: Item[]
  viewIDs: { [key: string]: string }
  songs: Item[]
  albums: Item[]
  artists: Item[]
  playlists: Item[]
  favorites: Item[]
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
    set(() => ({ songs: songs }))
  },
  setAlbums: (albums) => {
    set(() => ({ albums: albums }))
  },
  setArtists: (artists) => {
    set(() => ({ artists: artists }))
  },
  setPlaylists: (playlists) => {
    set(() => ({ playlists: playlists }))
  },
  setFavorites: (favorites) => {
    set(() => ({ favorites: favorites }))
  },
  setMusicvideos: (musicvideos) => {
    set(() => ({ musicvideos: musicvideos }))
  },
}))

export default useLibrary
