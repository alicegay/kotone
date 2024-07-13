import Item from 'jellyfin-api/lib/types/media/Item'

const sameAlbumArtists = (item: Item) => {
  const album = item.AlbumArtists
  const artists = item.ArtistItems

  let same = true

  if (album.length !== artists.length) return false

  try {
    artists.map((artist, i) => {
      if (artist.Id !== album[i].Id) same = false
    })
  } catch (error) {
    same = false
  }

  return same
}

export default sameAlbumArtists
