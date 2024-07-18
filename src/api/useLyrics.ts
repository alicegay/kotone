import { useQuery } from '@tanstack/react-query'
import { audio } from 'jellyfin-api'
import useClient from '../hooks/useClient'

const useLyrics = (itemID: string, enabled: boolean = true) => {
  const client = useClient()

  return useQuery({
    queryKey: ['lyrics', itemID],
    queryFn: async () => audio.lyrics(client.api, itemID),
    enabled: enabled,
  })
}

export default useLyrics
