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
    N: 'gospel-role-narrator',
    L: 'gospel-role-reader',
    P: 'gospel-role-people',
    G: 'gospel-role-jesus'
  }

  const { gospel } = defineProps<{
    gospel: Gospel
  }>()

  const stripVerseNumbers = (text: string) =>
    text.replace(/\d+\s*(?=[\u201C\u201D\u00AB\u00BB"'A-Za-zÀ-ú])/g, '')

  const lines = computed((): Line[] => {
    return gospel.text
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
  <div class="gospel-text">
    <p class="gospel-reference">
      {{ gospel.reference }}
    </p>
    <p class="gospel-title">{{ gospel.title }}</p>

    <div v-if="isDialog" class="gospel-lines">
      <div v-for="(line, i) in lines" :key="i">
        <p
          v-if="line.type === 'narrative'"
          class="gospel-body"
          v-html="stripVerseNumbers(line.content)"
        />
        <p v-else-if="line.type === 'stage'" class="gospel-stage">
          ({{ line.content }})
        </p>
        <div v-else-if="line.type === 'dialog'" class="gospel-dialog">
          <span
            class="gospel-role"
            :class="line.role ? roleColors[line.role] : 'gospel-role-narrator'"
            :title="line.roleFull"
          >
            {{ line.role }}
          </span>
          <p class="gospel-body" v-html="stripVerseNumbers(line.content)" />
        </div>
      </div>
    </div>

    <p
      v-else
      class="gospel-body"
      v-html="stripVerseNumbers(lines.map((l) => l.content).join(' '))"
    />
  </div>
</template>
