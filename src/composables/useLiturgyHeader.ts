import { ref } from 'vue'

export interface LiturgyHeaderState {
  line: string
  color: string
}

const liturgyHeader = ref<LiturgyHeaderState>({ line: '', color: '' })

export const useLiturgyHeader = () => {
  const setLiturgyHeader = (state: LiturgyHeaderState) => {
    liturgyHeader.value = state
  }

  const clearLiturgyHeader = () => {
    liturgyHeader.value = { line: '', color: '' }
  }

  return { liturgyHeader, setLiturgyHeader, clearLiturgyHeader }
}
