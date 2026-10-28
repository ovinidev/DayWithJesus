import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import MassGuidePage from '@/views/MassGuidePage.vue'
import { router } from '@/router'

const installMatchMedia = () => {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => undefined,
      removeListener: () => undefined,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      dispatchEvent: () => false
    }) as MediaQueryList
}

describe('Mass guide page', () => {
  beforeEach(() => {
    installMatchMedia()
    localStorage.clear()
  })

  it('advances, goes back, and reveals the assembly response', async () => {
    const wrapper = mount(MassGuidePage)
    expect(wrapper.text()).toContain('Canto de entrada')
    expect(wrapper.text()).toContain('1 de 31')
    expect(wrapper.text()).not.toContain('Ele está no meio de nós.')
    expect(wrapper.get('button[disabled]').text()).toContain('Voltar')

    await wrapper.get('button.mass-next-button').trigger('click')
    expect(wrapper.text()).toContain('Sinal da cruz')
    expect(wrapper.text()).toContain('2 de 31')

    await wrapper.get('button.mass-secondary-button').trigger('click')
    expect(wrapper.text()).toContain('Canto de entrada')

    await wrapper.get('button.mass-next-button').trigger('click')
    await wrapper.get('button.mass-next-button').trigger('click')
    expect(wrapper.text()).toContain('Saudação')
    await wrapper.get('[aria-controls="mass-response"]').trigger('click')
    expect(wrapper.get('#mass-response').text()).toContain(
      'Ele está no meio de nós.'
    )
    expect(wrapper.get('#mass-response').attributes('class')).toContain(
      'is-response'
    )
  })

  it('jumps to the concluding rites and then opens the quiz', async () => {
    const wrapper = mount(MassGuidePage)
    const sendOff = wrapper
      .findAll('nav.mass-timeline button')
      .find((button) => button.text().includes('Envio'))
    expect(sendOff).toBeTruthy()
    await sendOff?.trigger('click')
    expect(wrapper.text()).toContain('Avisos')
    expect(
      wrapper.get('[role="progressbar"]').attributes('aria-valuetext')
    ).toContain('29 de 31')

    await wrapper.get('button.mass-next-button').trigger('click')
    await wrapper.get('button.mass-next-button').trigger('click')
    expect(wrapper.get('button.mass-next-button').text()).toContain(
      'Fazer o quiz'
    )
    await wrapper.get('button.mass-next-button').trigger('click')
    expect(wrapper.text()).toContain('Um minuto para revisar')

    const radios = wrapper.findAll('input[type="radio"]')
    for (const radio of radios) {
      const value = radio.element.getAttribute('value')
      const name = radio.element.getAttribute('name')
      const correct: Record<string, string> = {
        greeting: 'among-us',
        'readings-posture': 'sitting',
        'gospel-end': 'glory',
        peace: 'love',
        'communion-amen': 'amen'
      }
      if (name && value === correct[name]) await radio.setValue(true)
    }
    await wrapper.get('form.mass-quiz').trigger('submit')
    expect(wrapper.text()).toContain('Você acertou 5 de 5')
  })

  it('asks for the remaining answers before showing a score', async () => {
    const wrapper = mount(MassGuidePage)
    const sendOff = wrapper
      .findAll('nav.mass-timeline button')
      .find((button) => button.text().includes('Envio'))
    await sendOff?.trigger('click')
    await wrapper.get('button.mass-next-button').trigger('click')
    await wrapper.get('button.mass-next-button').trigger('click')
    await wrapper.get('button.mass-next-button').trigger('click')
    await wrapper.get('form.mass-quiz').trigger('submit')
    expect(wrapper.text()).toContain(
      'Responda todas as perguntas para ver o resultado.'
    )
    expect(wrapper.text()).not.toContain('Você acertou')
  })
})

describe('Mass guide navigation entry', () => {
  beforeEach(() => {
    installMatchMedia()
    localStorage.clear()
  })

  it('registers the page and shows it in the menu', async () => {
    expect(router.getRoutes().some((route) => route.path === '/missa')).toBe(
      true
    )
    const memory = createRouter({
      history: createMemoryHistory(),
      routes: router.getRoutes()
    })
    await memory.push('/')
    await memory.isReady()
    const wrapper = mount(AppHeader, { global: { plugins: [memory] } })
    await wrapper.get('button.menu-button').trigger('click')
    const link = wrapper.get('a[href="/missa"]')
    expect(link.text()).toContain('Missa dominical')
  })
})
