import Item from 'jellyfin-api/lib/types/media/Item'
import { Album, Playlist, Track } from 'types/ItemTypes'

const itemToType = (item: Item): Track | Album | Playlist | Item => {
  let base = {
    Name: item.Name,
    SortName: item.SortName,
    Id: item.Id,
    RunTimeTicks: item.RunTimeTicks,
    ImageTags: item.ImageTags,
    ImageBlurHashes: item.ImageBlurHashes,
  }
  if (item.Type === 'Audio') {
    const result: Track = {
      ...base,
      Type: 'Audio',
      CanDownload: item.CanDownload,
      IndexNumber: item.IndexNumber,
      ParentIndexNumber: item.ParentIndexNumber,
      Album: item.Album,
      AlbumId: item.AlbumId,
      Artists: item.Artists,
      AlbumArtist: item.AlbumArtist,
      AlbumArtists: item.AlbumArtists,
      AlbumPrimaryImageTag: item.AlbumPrimaryImageTag,
      NormalizationGain: item.NormalizationGain,
    }
    return result
  } else if (item.Type === 'MusicAlbum') {
    const result: Album = {
      ...base,
      Type: 'MusicAlbum',
      ParentId: item.ParentId,
      ChildCount: item.ChildCount,
      Artists: item.Artists,
      AlbumArtist: item.AlbumArtist,
      AlbumArtists: item.AlbumArtists,
      NormalizationGain: item.NormalizationGain,
    }
    return result
  } else if (item.Type === 'Playlist') {
    const result: Playlist = {
      ...base,
      Type: 'Playlist',
      ParentId: item.ParentId,
      ChildCount: item.ChildCount,
    }
    return result
  } else {
    return item
  }
}

export default itemToType
