import { computed } from 'vue'
import { useFlags } from 'flagsmith-vue'

export const useFeatureFlagActive = (flag: string) => {
  const flags = useFlags([flag])

  const isFeatureFlagActive = computed(
    () => flags[flag].value?.enabled === true
  )

  return { isFeatureFlagActive }
}
