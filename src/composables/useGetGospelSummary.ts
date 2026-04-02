import { computed, ref, watch, type Ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { getGospelSummary } from '@/services/geminiService'

const storageKey = 'gospelSummary'

export const useGetGospelSummary = (gospelText: Ref<string>) => {
  const enabled = ref(false)
  const cachedSummary = ref<string | null>(localStorage.getItem(storageKey))

  const query = useQuery({
    queryKey: ['gospelSummary', gospelText],
    queryFn: () => getGospelSummary(gospelText.value),
    enabled
  })

  watch(query.data, (value) => {
    if (value) {
      localStorage.setItem(storageKey, value)
      cachedSummary.value = value
    }
  })

  const generate = () => {
    if (cachedSummary.value || query.data.value) return
    enabled.value = true
  }

  const data = computed(() => cachedSummary.value ?? query.data.value)

  const errorMessage = computed(() =>
    query.error.value instanceof Error ? query.error.value.message : undefined
  )

  return { ...query, data, generate, errorMessage }
}
