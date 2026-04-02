import { computed, ref, watch, type Ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { getGospelSummary } from '@/services/geminiService'
import { storageKey } from '@/constants/storageKeys'
import { formatDate } from '@/utils/formateDate'

export const useGetGospelSummary = (
  gospelText: Ref<string>,
  gospelDay: Ref<string | undefined>
) => {
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

  watch(
    gospelDay,
    (day) => {
      if (!day) return

      if (day !== formatDate(new Date())) {
        localStorage.removeItem(storageKey)
        cachedSummary.value = null
      }
    },
    { immediate: true }
  )

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
