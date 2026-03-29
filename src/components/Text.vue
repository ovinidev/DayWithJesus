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

  const withVerseNumbers = (text: string) =>
    text.replace(
      /(\d+)(\s?)(?=[A-Za-zÀ-ú])/g,
      '<sup class="text-xs font-light opacity-50 align-super">$1</sup> '
    )

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
  <div class="flex flex-col gap-3 text-xl">
    <p class="font-bold leading-relaxed text-black/70">
      {{ gospel.referencia }}
    </p>
    <p class="font-bold leading-relaxed text-black/70">{{ gospel.titulo }}</p>

    <div v-if="isDialog" class="flex flex-col gap-2">
      <div v-for="(line, i) in lines" :key="i">
        <p
          v-if="line.type === 'narrative'"
          class="leading-relaxed text-black"
          v-html="withVerseNumbers(line.content)"
        />
        <p v-else-if="line.type === 'stage'" class="italic text-black/50">
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
            v-html="withVerseNumbers(line.content)"
          />
        </div>
      </div>
    </div>

    <p
      v-else
      class="leading-relaxed text-black"
      v-html="withVerseNumbers(lines.map((l) => l.content).join(' '))"
    />
  </div>
</template>
