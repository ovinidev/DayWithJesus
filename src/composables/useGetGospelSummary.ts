import { computed, ref, type Ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { getGospelSummary } from '@/services/geminiService'

export const useGetGospelSummary = (gospelText: Ref<string>) => {
  const enabled = ref(false)

  const query = useQuery({
    queryKey: ['gospelSummary', gospelText.value],
    queryFn: () => getGospelSummary(gospelText.value),
    enabled
  })

  const generate = () => {
    if (query.data.value) {
      return
    }
    enabled.value = true
  }

  const errorMessage = computed(() =>
    query.error.value instanceof Error ? query.error.value.message : undefined
  )

  return { ...query, generate, errorMessage }
}
