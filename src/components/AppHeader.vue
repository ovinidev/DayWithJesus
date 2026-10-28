<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue'
  import {
    Menu,
    BookOpenText,
    Cross,
    HeartHandshake,
    Moon,
    Sun,
    CircleDot,
    X
  } from 'lucide-vue-next'
  import { useLiturgyHeader } from '@/composables/useLiturgyHeader'

  const isMenuOpen = ref(false)
  const isDarkMode = ref(false)
  const { liturgyHeader } = useLiturgyHeader()

  const todayLabel = computed(() =>
    new Date().toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    })
  )

  const closeMenu = () => {
    isMenuOpen.value = false
  }

  const applyTheme = () => {
    document.documentElement.classList.toggle('dark-mode', isDarkMode.value)
    localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light')
  }

  const toggleTheme = () => {
    isDarkMode.value = !isDarkMode.value
    applyTheme()
  }

  onMounted(() => {
    const savedTheme = localStorage.getItem('theme')
    isDarkMode.value =
      savedTheme === 'dark' ||
      (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)
    applyTheme()
  })
</script>

<template>
  <header class="app-header">
    <RouterLink class="app-brand" to="/" @click="closeMenu">
      <span class="brand-mark">
        <Cross :size="16" stroke-width="2.2" aria-hidden="true" />
      </span>
      <span class="brand-copy">
        <span class="brand-name">Dia com Jesus</span>
        <span class="brand-meta">
          <span
            v-if="liturgyHeader.color"
            class="color-swatch"
            :style="{ background: liturgyHeader.color }"
            aria-hidden="true"
          ></span>
          <span class="brand-meta-text">{{
            liturgyHeader.line || todayLabel
          }}</span>
        </span>
      </span>
    </RouterLink>

    <div class="header-actions">
      <button
        class="theme-button"
        type="button"
        :aria-label="isDarkMode ? 'Ativar modo claro' : 'Ativar modo escuro'"
        :title="isDarkMode ? 'Ativar modo claro' : 'Ativar modo escuro'"
        @click="toggleTheme"
      >
        <Sun v-if="isDarkMode" :size="18" aria-hidden="true" />
        <Moon v-else :size="18" aria-hidden="true" />
      </button>
      <button
        class="menu-button"
        type="button"
        :aria-expanded="isMenuOpen"
        aria-controls="main-menu"
        :aria-label="isMenuOpen ? 'Fechar menu' : 'Abrir menu'"
        @click="isMenuOpen = !isMenuOpen"
      >
        <Menu v-if="!isMenuOpen" :size="20" aria-hidden="true" />
        <X v-else :size="20" aria-hidden="true" />
      </button>
    </div>

    <Transition name="menu-reveal">
      <nav
        v-if="isMenuOpen"
        id="main-menu"
        class="main-menu"
        aria-label="Menu principal"
      >
        <RouterLink to="/" @click="closeMenu">
          <BookOpenText :size="18" aria-hidden="true" />
          Homilia diária
        </RouterLink>
        <RouterLink to="/santos" @click="closeMenu">
          <Cross :size="18" aria-hidden="true" />
          Santo do dia
        </RouterLink>
        <RouterLink to="/oracoes" @click="closeMenu">
          <HeartHandshake :size="18" aria-hidden="true" />
          Orações
        </RouterLink>
        <RouterLink to="/terco" @click="closeMenu">
          <CircleDot :size="18" aria-hidden="true" />
          Reze o Terço
        </RouterLink>
      </nav>
    </Transition>
  </header>
</template>
