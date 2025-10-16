import { useQuery } from '@tanstack/react-query'
import { api } from '../api/client'

export function useTasks(params){
  return useQuery({
    queryKey: ['tasks', params],
    queryFn: async () => {
      const { data } = await api.get('/tasks', { params })
      return data
    },
    staleTime: 30_000,
    retry: false
  })
}
