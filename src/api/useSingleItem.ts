import { useQuery } from '@tanstack/react-query'
import { users } from 'jellyfin-api'
import useClient from '../hooks/useClient'

const useSingleItem = (itemID: string | undefined, enabled: boolean = true) => {
  const client = useClient()

  return useQuery({
    queryKey: ['item', itemID],
    queryFn: () => users.singleItem(client.api, itemID ?? ''),
    enabled: enabled,
  })
}

export default useSingleItem
