<script setup lang="ts">
  import { computed } from 'vue'
  import type { Gospel } from '@/types'

  interface Line {
    type: 'dialog' | 'stage' | 'narrative'
    role?: string
    roleFull?: string
    content: string
  }

  const roleColors: Record<string, string> = {
    N: 'text-black/70',
    L: 'text-violet-600',
    P: 'text-amber-600',
    G: 'text-blue-600'
  }

  const { gospel } = defineProps<{
    gospel: Gospel
  }>()

  const stripVerseNumbers = (text: string) =>
    text.replace(/\d+\s*(?=[\u201C\u201D\u00AB\u00BB"'A-Za-zÀ-ú])/g, '')

  const lines = computed((): Line[] => {
    return gospel.texto
      .split('\n')
      .map((line): Line => {
        const dialogMatch = line.match(/^([A-ZÀ-Ú])\s+\(([^)]+)\):\s*(.*)/)
        if (dialogMatch) {
          return {
            type: 'dialog',
            role: dialogMatch[1],
            roleFull: dialogMatch[2],
            content: dialogMatch[3]
          }
        }
        const stageMatch = line.match(/^\((.+)\)$/)
        if (stageMatch) {
          return { type: 'stage', content: stageMatch[1] }
        }
        return { type: 'narrative', content: line }
      })
      .filter((l) => l.content.trim() !== '')
  })

  const isDialog = computed(() => lines.value.some((l) => l.type === 'dialog'))
</script>

<template>
  <div class="mt-2 flex flex-col gap-3 text-xl">
    <p class="leading-relaxed font-bold text-black/70">
      {{ gospel.referencia }}
    </p>
    <p class="leading-relaxed text-black/70">{{ gospel.titulo }}</p>

    <div v-if="isDialog" class="flex flex-col gap-2">
      <div v-for="(line, i) in lines" :key="i">
        <p
          v-if="line.type === 'narrative'"
          class="leading-relaxed text-black"
          v-html="stripVerseNumbers(line.content)"
        />
        <p v-else-if="line.type === 'stage'" class="text-black/50 italic">
          ({{ line.content }})
        </p>
        <div v-else-if="line.type === 'dialog'" class="flex gap-2">
          <span
            class="mt-0.5 shrink-0 font-bold"
            :class="line.role ? roleColors[line.role] : 'text-black/70'"
            :title="line.roleFull"
          >
            {{ line.role }}
          </span>
          <p
            class="leading-relaxed text-black"
            v-html="stripVerseNumbers(line.content)"
          />
        </div>
      </div>
    </div>

    <p
      v-else
      class="mt-1 leading-relaxed"
      v-html="stripVerseNumbers(lines.map((l) => l.content).join(' '))"
    />
  </div>
</template>
