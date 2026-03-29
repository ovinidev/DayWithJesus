<script setup lang="ts">
  import { computed } from 'vue'
  import { VueQueryDevtools } from '@tanstack/vue-query-devtools'
  import Title from '@/components/Title.vue'
  import TodayDate from '@/components/TodayDate.vue'
  import Text from '@/components/Text.vue'
  import { useGetHomilyDiary } from '@/composables/useGetHomilyDiary'

  const { data, isLoading, isError } = useGetHomilyDiary()

  const gospel = computed(() => data.value?.leituras.evangelho)
</script>

<template>
  <div
    class="flex min-h-screen bg-[var(--color-lilac-light)] items-center justify-center"
  >
    <div
      class="flex w-full max-w-sm flex-col gap-8 rounded-3xl p-4 md:max-w-xl md:p-8"
    >
      <Title />
      <TodayDate v-if="data" :date-str="data.data" />

      <p v-if="isLoading" class="py-8 text-center text-sm text-black/50">
        Carregando...
      </p>
      <p v-else-if="isError" class="py-8 text-center text-sm text-red-500">
        Erro ao carregar o evangelho.
      </p>
      <div v-else-if="gospel?.length" class="flex flex-col gap-8">
        <Text v-for="(item, index) in gospel" :key="index" :gospel="item" />
      </div>
    </div>
  </div>

  <VueQueryDevtools button-position="bottom-right" />
</template>
