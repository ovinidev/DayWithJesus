import { computed, type Ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { getSaintOfDay } from '@/services/saintService'

export const useGetSaintsByDate = (date: Ref<string>) =>
  useQuery({
    queryKey: computed(() => ['saintOfDay', date.value]),
    queryFn: () => getSaintOfDay(date.value)
  })
