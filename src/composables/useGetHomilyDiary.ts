import { computed, type Ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { getHomilyDiary } from '@/services/homilyService'
import { gospelMapper } from '@/utils/gospelMapper'

export const useGetHomilyDiary = (date: Ref<string>) => {
  const query = useQuery({
    queryKey: computed(() => ['homilyDiary', date.value]),
    queryFn: () => getHomilyDiary(date.value)
  })

  const data = computed(() =>
    query.data.value ? gospelMapper(query.data.value) : undefined
  )

  return {
    ...query,
    data
  }
}
