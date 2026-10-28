import { computed, type Ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { getHomilyVideo } from '@/services/homilyVideoService'

export const useGetHomilyVideo = (date: Ref<string>) => {
  return useQuery({
    queryKey: computed(() => ['homilyVideo', date.value]),
    queryFn: () => getHomilyVideo(date.value),
    staleTime: 60 * 1000,
    retry: 1
  })
}
