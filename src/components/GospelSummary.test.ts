import { ref } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import GospelSummary from './GospelSummary.vue'

const flag = ref(true)

vi.mock('@/composables/useFeatureFlagActive', () => ({
  useFeatureFlagActive: () => ({
    isFeatureFlagActive: flag
  })
}))

const mountSummary = (
  props: Partial<{
    summary: string
    isLoading: boolean
    isError: boolean
    errorMessage: string
    generate: () => void
  }> = {}
) =>
  mount(GospelSummary, {
    props: {
      fontScale: 1,
      generate: props.generate ?? vi.fn(),
      ...props
    }
  })

describe('GospelSummary', () => {
  it('offers an Understand with AI action', async () => {
    flag.value = true
    const generate = vi.fn()
    const wrapper = mountSummary({ generate })

    const button = wrapper.get('button')
    expect(button.text()).toContain('Entender com IA')
    expect(button.text()).toContain('Uma explicação clara das leituras de hoje')
    await button.trigger('click')
    expect(generate).toHaveBeenCalledOnce()
  })

  it('hides the action when the feature flag is off', () => {
    flag.value = false
    const wrapper = mountSummary()
    expect(wrapper.find('button').exists()).toBe(false)
    flag.value = true
  })

  it('shows a loading state while the explanation is prepared', () => {
    const wrapper = mountSummary({ isLoading: true })
    expect(wrapper.text()).toContain('Preparando a explicação')
    expect(wrapper.find('.ai-button').exists()).toBe(false)
  })

  it('shows the error and lets the reader try again', async () => {
    const generate = vi.fn()
    const wrapper = mountSummary({
      isError: true,
      errorMessage: 'Erro ao gerar resumo',
      generate
    })

    expect(wrapper.text()).toContain('Erro ao gerar resumo')
    await wrapper.get('.summary-retry').trigger('click')
    expect(generate).toHaveBeenCalledOnce()
  })

  it('renders the explanation in readable sections', () => {
    const wrapper = mountSummary({
      summary: [
        'Resumo do Evangelho',
        'O Reino começa pequeno.',
        '',
        'O que o Evangelho nos traz',
        'Esperança no crescimento.',
        '',
        'Ensinamentos',
        'Confiar no tempo de Deus.'
      ].join('\n')
    })

    expect(wrapper.get('h2').text()).toBe('Explicação das leituras')
    expect(wrapper.text()).toContain('O Reino começa pequeno.')
    expect(wrapper.text()).toContain('O que o Evangelho nos traz')
    expect(wrapper.text()).toContain('Ensinamentos')
    expect(wrapper.find('.ai-button').exists()).toBe(false)
  })
})
