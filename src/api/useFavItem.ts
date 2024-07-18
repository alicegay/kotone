import { useMutation, useQueryClient } from '@tanstack/react-query'
import useClient from 'hooks/useClient'
import { users } from 'jellyfin-api'
import Item from 'jellyfin-api/lib/types/media/Item'

const useFavItem = (itemId: string) => {
  const client = useClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (del?: boolean) => {
      if (del) {
        return users.favoriteItemsDel(client, itemId)
      } else {
        return users.favoriteItems(client, itemId)
      }
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['item', itemId], (oldData: Item) =>
        oldData ? { ...oldData, UserData: data } : oldData,
      )
    },
  })
}

export default useFavItem
