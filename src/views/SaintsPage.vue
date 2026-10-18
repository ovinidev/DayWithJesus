<script setup lang="ts">
  import { Construction, Sparkles } from 'lucide-vue-next'
  import Title from '@/components/Title.vue'
</script>

<template>
  <main class="page-shell">
    <article class="reading-card saints-card">
      <header class="page-header">
        <span class="eyebrow">CALENDÁRIO LITÚRGICO</span>
        <Title title="Santo do dia" />
        <span class="header-rule" aria-hidden="true"></span>
      </header>

      <section class="construction-card" aria-live="polite">
        <span class="construction-emblem">
          <Construction :size="28" aria-hidden="true" />
        </span>
        <h2>Em construção</h2>
        <p>
          Em breve, você poderá encontrar aqui a história, a reflexão e a oração
          do santo de cada dia.
        </p>
        <span class="construction-sparkle"
          ><Sparkles :size="17" aria-hidden="true"
        /></span>
      </section>
    </article>
  </main>
</template>
