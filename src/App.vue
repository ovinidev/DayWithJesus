<script setup lang="ts">
  import { computed } from 'vue'
  import { VueQueryDevtools } from '@tanstack/vue-query-devtools'
  import Title from '@/components/Title.vue'
  import TodayDate from '@/components/TodayDate.vue'
  import Text from '@/components/Text.vue'
  import { useGetHomilyDiary } from '@/composables/useGetHomilyDiary'
  import { dayColor } from '@/constants/dayColors'

  const { data, isLoading, isError } = useGetHomilyDiary()

  const gospel = computed(() => data.value?.leituras.evangelho)
</script>

<template>
  <div
    class="flex min-h-screen items-center justify-center bg-[var(--color-lilac-light)]"
  >
    <div
      class="flex w-full max-w-sm flex-col gap-8 rounded-3xl p-4 md:max-w-xl md:p-8"
    >
      <Title title="Evangelho do dia" />

      <p v-if="isLoading" class="py-8 text-center text-sm text-black/50">
        Carregando...
      </p>

      <p v-else-if="isError" class="py-8 text-center text-sm text-red-500">
        Erro ao carregar o evangelho.
      </p>

      <div v-if="data" class="flex flex-col gap-2 text-black/70">
        <TodayDate v-if="data" :date-str="data.data" />

        <p class="text-xl">
          Cor:
          <span class="font-bold" :style="{ color: dayColor[data.cor] }">{{
            data?.cor
          }}</span>
        </p>
        <p class="text-xl">Liturgia: {{ data.liturgia }}</p>

        <Text v-for="(item, index) in gospel" :key="index" :gospel="item" />
      </div>
    </div>
  </div>

  <VueQueryDevtools button-position="bottom-right" />
</template>
