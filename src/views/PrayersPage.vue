<script setup lang="ts">
  import { computed, nextTick, ref } from 'vue'
  import { HeartHandshake, Search } from 'lucide-vue-next'
  import Title from '@/components/Title.vue'
  import {
    PRAYER_CATEGORIES,
    PRAYER_CATEGORY_ORDER,
    PRAYER_ORDER,
    PRAYERS,
    type PrayerCategory,
    type PrayerKey
  } from '@/constants/prayers'

  type PrayerFilter = 'all' | PrayerCategory

  const query = ref('')
  const category = ref<PrayerFilter>('all')
  const selectedPrayerKey = ref<PrayerKey>('ourFather')
  const prayerCard = ref<HTMLElement | null>(null)

  const catalog = PRAYER_ORDER.map((id) => ({
    id,
    ...PRAYERS[id]
  }))

  const selectedPrayer = computed(() => PRAYERS[selectedPrayerKey.value])

  const fold = (value: string) =>
    value
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .toLowerCase()

  const visiblePrayers = computed(() => {
    const needle = fold(query.value.trim())
    return catalog.filter((prayer) => {
      const inCategory =
        category.value === 'all' || prayer.category === category.value
      if (!inCategory) return false
      if (!needle) return true
      return fold(`${prayer.name}\n${prayer.text}`).includes(needle)
    })
  })

  const groups = computed(() =>
    PRAYER_CATEGORY_ORDER.flatMap((key) => {
      const prayers = visiblePrayers.value.filter(
        (prayer) => prayer.category === key
      )
      if (prayers.length === 0) return []
      return [
        {
          key,
          label: PRAYER_CATEGORIES[key],
          prayers
        }
      ]
    })
  )

  const selectCategory = (next: PrayerFilter) => {
    category.value = next
  }

  const selectPrayer = async (id: PrayerKey) => {
    selectedPrayerKey.value = id
    await nextTick()
    const card = prayerCard.value
    if (!card || typeof card.scrollIntoView !== 'function') return
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    card.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'nearest'
    })
  }
</script>

<template>
  <main class="page-shell">
    <article class="reading-card prayers-card">
      <header class="page-header">
        <span class="eyebrow">MOMENTO DE ORAÇÃO</span>
        <Title title="Orações" />
        <span class="header-rule" aria-hidden="true"></span>
      </header>

      <section class="prayers-content">
        <div class="prayer-search">
          <label class="prayer-select-label" for="prayer-search">
            Buscar oração
          </label>
          <div class="prayer-search-field">
            <Search :size="18" aria-hidden="true" />
            <input
              id="prayer-search"
              v-model="query"
              type="search"
              placeholder="Nome ou palavras da oração"
              autocomplete="off"
            />
          </div>
        </div>

        <div class="prayer-filters" role="group" aria-label="Categorias">
          <button
            class="prayer-filter"
            :class="{ 'is-selected': category === 'all' }"
            type="button"
            :aria-pressed="category === 'all'"
            @click="selectCategory('all')"
          >
            Todas
          </button>
          <button
            v-for="key in PRAYER_CATEGORY_ORDER"
            :key="key"
            class="prayer-filter"
            :class="{ 'is-selected': category === key }"
            type="button"
            :aria-pressed="category === key"
            @click="selectCategory(key)"
          >
            {{ PRAYER_CATEGORIES[key] }}
          </button>
        </div>

        <div class="prayer-catalog" role="region" aria-label="Lista de orações">
          <p v-if="groups.length === 0" class="prayer-empty" role="status">
            Nenhuma oração encontrada.
          </p>
          <section v-for="group in groups" :key="group.key">
            <p class="prayer-group-label">{{ group.label }}</p>
            <ul>
              <li v-for="prayer in group.prayers" :key="prayer.id">
                <button
                  class="prayer-option"
                  :class="{ 'is-selected': selectedPrayerKey === prayer.id }"
                  type="button"
                  :aria-pressed="selectedPrayerKey === prayer.id"
                  @click="selectPrayer(prayer.id)"
                >
                  {{ prayer.name }}
                </button>
              </li>
            </ul>
          </section>
        </div>

        <div class="prayer-reading" aria-live="polite">
          <Transition name="prayer-reveal" mode="out-in">
            <article
              :key="selectedPrayerKey"
              ref="prayerCard"
              class="prayer-text-card"
            >
              <span class="prayer-emblem">
                <HeartHandshake :size="21" aria-hidden="true" />
              </span>
              <p class="prayer-kicker">
                {{ PRAYER_CATEGORIES[selectedPrayer.category] }}
              </p>
              <h2>{{ selectedPrayer.name }}</h2>
              <p>{{ selectedPrayer.text }}</p>
            </article>
          </Transition>
        </div>
      </section>
    </article>
  </main>
</template>
