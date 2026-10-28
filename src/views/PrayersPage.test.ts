import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import PrayersPage from './PrayersPage.vue'

const mountPage = () => mount(PrayersPage)

const catalogText = (wrapper: ReturnType<typeof mountPage>) =>
  wrapper.get('[aria-label="Lista de orações"]').text()

const openPrayer = async (
  wrapper: ReturnType<typeof mountPage>,
  name: string
) => {
  const button = wrapper
    .get('[aria-label="Lista de orações"]')
    .findAll('button')
    .find((item) => item.text() === name)
  if (!button) throw new Error(`Missing prayer: ${name}`)
  await button.trigger('click')
  return wrapper.get('.prayer-text-card')
}

describe('PrayersPage', () => {
  it('opens on the Pai-Nosso', () => {
    const wrapper = mountPage()
    const card = wrapper.get('.prayer-text-card')

    expect(card.get('h2').text()).toBe('Pai-Nosso')
    expect(card.text()).toContain('santificado seja o vosso nome')
    expect(card.text()).toContain('Orações básicas')
  })

  it('lists traditional prayers grouped by category', () => {
    const wrapper = mountPage()
    const list = catalogText(wrapper)

    expect(list).toContain('Orações básicas')
    expect(list).toContain('Marianas')
    expect(list).toContain('Aos santos')
    expect(list).toContain('Do dia a dia')
    expect(list).toContain('Pai-Nosso')
    expect(list).toContain('Ave-Maria')
    expect(list).toContain('Glória ao Pai')
    expect(list).toContain('Credo')
    expect(list).toContain('Santo Anjo')
    expect(list).toContain('Ato de Contrição')
    expect(list).toContain('Vinde, Espírito Santo')
    expect(list).toContain('Salve Rainha')
    expect(list).toContain('Magnificat')
    expect(list).toContain('Angelus')
    expect(list).toContain('Regina Coeli')
    expect(list).toContain('Lembrai-vos')
    expect(list).toContain('Consagração a Nossa Senhora')
    expect(list).toContain('Oração de São Miguel Arcanjo')
    expect(list).toContain('Oração de São Francisco')
    expect(list).toContain('Alma de Cristo')
    expect(list).toContain('Oração a São José')
    expect(list).toContain('Te Deum')
    expect(list).toContain('Oração antes das refeições')
    expect(list).toContain('Oração da manhã')
    expect(list).toContain('Oração da noite')
    expect(list).toContain('Eterno descanso')
    expect(list).toContain('Ato de fé')
    expect(list).toContain('Ato de esperança')
    expect(list).toContain('Ato de caridade')
    expect(list).toContain('Terço da Misericórdia')
  })

  it('finds a prayer by name without accents and shows its text', async () => {
    const wrapper = mountPage()

    await wrapper.get('#prayer-search').setValue('sao miguel')

    expect(catalogText(wrapper)).toContain('Oração de São Miguel Arcanjo')
    expect(catalogText(wrapper)).not.toContain('Pai-Nosso')
    expect(wrapper.get('.prayer-text-card').text()).toContain('Pai-Nosso')

    const card = await openPrayer(wrapper, 'Oração de São Miguel Arcanjo')

    expect(card.text()).toContain('defendei-nos no combate')
    expect(card.text()).toContain('Aos santos')
    expect(
      wrapper
        .get('[aria-label="Lista de orações"]')
        .findAll('button')
        .find((item) => item.text() === 'Oração de São Miguel Arcanjo')
        ?.attributes('aria-pressed')
    ).toBe('true')
  })

  it('filters by category and by words inside the prayer', async () => {
    const wrapper = mountPage()
    const marian = wrapper
      .findAll('button')
      .find((item) => item.text() === 'Marianas')
    if (!marian) throw new Error('Missing Marianas filter')
    await marian.trigger('click')

    expect(marian.attributes('aria-pressed')).toBe('true')
    expect(catalogText(wrapper)).toContain('Salve Rainha')
    expect(catalogText(wrapper)).not.toContain('Oração de São Miguel Arcanjo')

    await wrapper.get('#prayer-search').setValue('vale de lágrimas')
    expect(catalogText(wrapper)).toContain('Salve Rainha')
    expect(catalogText(wrapper)).not.toContain('Angelus')

    const card = await openPrayer(wrapper, 'Salve Rainha')
    expect(card.text()).toContain('mãe de misericórdia')
    expect(card.text()).toContain('ó doce Virgem Maria')
  })

  it('shows an empty state when nothing matches', async () => {
    const wrapper = mountPage()
    const saints = wrapper
      .findAll('button')
      .find((item) => item.text() === 'Aos santos')
    if (!saints) throw new Error('Missing saints filter')
    await saints.trigger('click')
    await wrapper.get('#prayer-search').setValue('rainha')

    expect(wrapper.get('.prayer-empty').text()).toBe(
      'Nenhuma oração encontrada.'
    )
    expect(wrapper.get('.prayer-text-card').text()).toContain('Pai-Nosso')
  })
})
