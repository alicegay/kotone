import { useQuery } from '@tanstack/react-query'
import { users } from 'jellyfin-api'
import ItemsQuery from 'jellyfin-api/lib/types/queries/ItemsQuery'
import useClient from '../hooks/useClient'

const useItems = (params: ItemsQuery) => {
  const client = useClient()

  return useQuery({
    queryKey: ['items', params],
    queryFn: () => users.items(client.api, params),
  })
}

export default useItems
