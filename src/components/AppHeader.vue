<script setup lang="ts">
  import { ref } from 'vue'
  import { Menu, BookOpenText, Cross, HeartHandshake } from 'lucide-vue-next'

  const isMenuOpen = ref(false)

  const closeMenu = () => {
    isMenuOpen.value = false
  }
</script>

<template>
  <header class="app-header">
    <RouterLink class="app-brand" to="/" @click="closeMenu">
      <Cross :size="20" stroke-width="1.8" aria-hidden="true" />
      <span>Dia com Jesus</span>
    </RouterLink>

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
      </nav>
    </Transition>
  </header>
</template>
