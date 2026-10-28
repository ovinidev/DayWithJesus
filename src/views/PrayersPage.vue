<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { HeartHandshake } from 'lucide-vue-next'
  import Title from '@/components/Title.vue'
  import { PRAYERS, type PrayerKey } from '@/constants/prayers'

  const selectedPrayerKey = ref<PrayerKey>('ourFather')
  const selectedPrayer = computed(() => PRAYERS[selectedPrayerKey.value])
  const prayerOptions = Object.entries(PRAYERS) as [
    PrayerKey,
    (typeof PRAYERS)[PrayerKey]
  ][]
</script>

<template>
  <main class="page-shell">
    <article class="reading-card prayers-card">
      <header class="page-header">
        <span class="eyebrow">MOMENTO DE ORAÇÃO</span>
        <Title title="Orações" />
        <span class="header-rule" aria-hidden="true"></span>
      </header>

      <section class="prayers-content" aria-live="polite">
        <label class="prayer-select-label" for="prayer-select"
          >Escolha uma oração</label
        >
        <select
          id="prayer-select"
          v-model="selectedPrayerKey"
          class="prayer-select"
        >
          <option
            v-for="[key, prayer] in prayerOptions"
            :key="key"
            :value="key"
          >
            {{ prayer.name }}
          </option>
        </select>

        <Transition name="soft-swap" mode="out-in">
          <article :key="selectedPrayerKey" class="prayer-text-card">
            <span class="prayer-emblem"
              ><HeartHandshake :size="21" aria-hidden="true"
            /></span>
            <h2>{{ selectedPrayer.name }}</h2>
            <p>{{ selectedPrayer.text }}</p>
          </article>
        </Transition>
      </section>
    </article>
  </main>
</template>
