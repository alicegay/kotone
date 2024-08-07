import { useQuery } from '@tanstack/react-query'
import { items } from 'jellyfin-api'
import ItemsQuery from 'jellyfin-api/lib/types/queries/ItemsQuery'
import useClient from '../hooks/useClient'

const useLatest = (
  parentID: string,
  params?: ItemsQuery,
  enabled: boolean = true,
) => {
  const client = useClient()

  return useQuery({
    queryKey: ['latest', parentID, params],
    queryFn: () => items.latest(client.api, parentID, params),
    enabled: enabled,
  })
}

export default useLatest
