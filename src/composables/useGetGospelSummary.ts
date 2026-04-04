import { computed, ref, watch, type Ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { getGospelSummary } from '@/services/geminiService'
import { storageKey } from '@/constants/storageKeys'
import { formatDate } from '@/utils/formateDate'

interface CachedSummary {
  summary: string
  date: string
}

export const useGetGospelSummary = (
  gospelText: Ref<string>,
  gospelDay: Ref<string>
) => {
  const enabled = ref(false)
  const cachedSummary = ref<CachedSummary | null>(
    JSON.parse(localStorage.getItem(storageKey) || 'null')
  )

  const query = useQuery({
    queryKey: ['gospelSummary', gospelText],
    queryFn: () => getGospelSummary(gospelText.value),
    enabled: enabled.value && gospelText.value.trim() !== ''
  })

  watch(query.data, (value) => {
    if (value) {
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          summary: value,
          date: gospelDay.value
        })
      )
      cachedSummary.value = {
        summary: value,
        date: gospelDay.value
      }
    }
  })

  watch(
    () => gospelDay.value,
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

  const data = computed(() => cachedSummary.value?.summary ?? query.data.value)

  const errorMessage = computed(() =>
    query.error.value instanceof Error ? query.error.value.message : undefined
  )

  return { ...query, data, generate, errorMessage }
}
