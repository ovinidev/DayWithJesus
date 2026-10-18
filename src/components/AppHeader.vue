<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import {
    Menu,
    BookOpenText,
    Cross,
    HeartHandshake,
    Moon,
    Sun,
    CircleDot
  } from 'lucide-vue-next'

  const isMenuOpen = ref(false)
  const isDarkMode = ref(false)

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
      <Cross :size="20" stroke-width="1.8" aria-hidden="true" />
      <span>Dia com Jesus</span>
    </RouterLink>

    <div class="header-actions">
      <button
        class="theme-button"
        type="button"
        :aria-label="isDarkMode ? 'Ativar modo claro' : 'Ativar modo escuro'"
        :title="isDarkMode ? 'Ativar modo claro' : 'Ativar modo escuro'"
        @click="toggleTheme"
      >
        <Sun v-if="isDarkMode" :size="20" aria-hidden="true" />
        <Moon v-else :size="20" aria-hidden="true" />
      </button>
      <button
        class="menu-button"
        type="button"
        :aria-expanded="isMenuOpen"
        aria-controls="main-menu"
        aria-label="Abrir menu"
        @click="isMenuOpen = !isMenuOpen"
      >
        <Menu v-if="!isMenuOpen" :size="23" aria-hidden="true" />
        <Cross v-else :size="23" aria-hidden="true" />
      </button>
    </div>

    <Transition name="menu-reveal">
      <nav
        v-if="isMenuOpen"
        id="main-menu"
        class="main-menu gap-1"
        aria-label="Menu principal"
      >
        <RouterLink to="/" @click="closeMenu">
          <BookOpenText :size="19" aria-hidden="true" />
          Homilia diária
        </RouterLink>
        <RouterLink to="/santos" @click="closeMenu">
          <Cross :size="19" aria-hidden="true" />
          Santo do dia
        </RouterLink>
        <RouterLink to="/oracoes" @click="closeMenu">
          <HeartHandshake :size="19" aria-hidden="true" />
          Orações
        </RouterLink>
        <RouterLink to="/terco" @click="closeMenu">
          <CircleDot :size="19" aria-hidden="true" />
          Reze o Terço
        </RouterLink>
      </nav>
    </Transition>
  </header>
</template>
