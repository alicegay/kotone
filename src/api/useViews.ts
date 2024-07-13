import { useQuery } from '@tanstack/react-query'
import { users } from 'jellyfin-api'
import useClient from '../hooks/useClient'

const useViews = () => {
  const client = useClient()

  return useQuery({
    queryKey: ['views'],
    queryFn: async () => {
      const res = await users.views(client.api)
      return res.Items.filter(
        (item) =>
          item.CollectionType === 'music' ||
          item.CollectionType === 'playlists' ||
          item.CollectionType === 'musicvideos',
      )
    },
  })
}

export default useViews
