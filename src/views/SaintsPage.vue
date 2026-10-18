<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { BookHeart, Sparkles } from 'lucide-vue-next'
  import Title from '@/components/Title.vue'
  import { useGetSaintsByDate } from '@/composables/useGetSaintsByDate'

  const toDateInputValue = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
  }

  const todayDate = toDateInputValue(new Date())
  const selectedDate = ref(todayDate)
  const isTodaySelected = computed(() => selectedDate.value === todayDate)
  const selectedDateLabel = computed(() =>
    new Date(`${selectedDate.value}T12:00:00`).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  )
  const { data, isLoading, isError } = useGetSaintsByDate(selectedDate)

  const returnToToday = () => {
    selectedDate.value = todayDate
  }
</script>

<template>
  <main class="page-shell">
    <article class="reading-card saints-card">
      <header class="page-header">
        <span class="eyebrow">CALENDÁRIO LITÚRGICO</span>
        <Title title="Santo do dia" />
        <span class="header-rule" aria-hidden="true"></span>
        <div class="date-picker">
          <label for="saint-date">Consultar outra data</label>
          <div class="date-picker-controls">
            <input id="saint-date" v-model="selectedDate" type="date" />
            <button
              type="button"
              :disabled="isTodaySelected"
              @click="returnToToday"
            >
              Hoje
            </button>
          </div>
        </div>
      </header>

      <p v-if="isLoading" class="status-message">Carregando santo do dia...</p>
      <p v-else-if="isError" class="status-message error-message">
        Não foi possível carregar o santo do dia.
      </p>

      <section v-else-if="data" class="saints-content" aria-live="polite">
        <p class="saints-date">{{ selectedDateLabel }}</p>

        <div v-if="data.results.length" class="saints-list">
          <article
            v-for="saint in data.results"
            :key="saint.nome"
            class="saint-profile"
          >
            <img
              v-if="saint.imagem"
              class="saint-image"
              :src="saint.imagem"
              :alt="`Imagem de ${saint.nome}`"
            />
            <div class="saint-profile-heading">
              <span class="saint-emblem"
                ><Sparkles :size="17" aria-hidden="true"
              /></span>
              <h2>{{ saint.nome }}</h2>
            </div>
            <section v-if="saint.historia" class="saint-text-section">
              <h3><BookHeart :size="18" aria-hidden="true" /> História</h3>
              <p>{{ saint.historia }}</p>
            </section>
            <section v-if="saint.reflexao" class="saint-text-section">
              <h3><Sparkles :size="18" aria-hidden="true" /> Reflexão</h3>
              <p>{{ saint.reflexao }}</p>
            </section>
            <section
              v-if="saint.oracao"
              class="saint-text-section saint-prayer"
            >
              <h3>Oração</h3>
              <p>{{ saint.oracao }}</p>
            </section>
          </article>
        </div>
        <p v-else class="empty-state">
          Não há santo disponível para esta data.
        </p>
      </section>
    </article>
  </main>
</template>
