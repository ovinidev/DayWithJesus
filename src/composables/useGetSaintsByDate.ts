import { computed, type Ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { getSaintOfDay } from '@/services/saintService'
import { isIsoDate } from '@/utils/liturgicalDate'

const FRESH_MS = 1000 * 60 * 60 * 12
const INCOMPLETE_MS = 1000 * 60 * 5

export const useGetSaintsByDate = (date: Ref<string>) =>
  useQuery({
    queryKey: computed(() => ['saintOfDay', date.value]),
    queryFn: () => getSaintOfDay(date.value),
    enabled: computed(() => isIsoDate(date.value)),
    staleTime: (query) =>
      query.state.data?.completo === false ? INCOMPLETE_MS : FRESH_MS
  })
