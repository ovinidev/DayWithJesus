import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import WeekNavigator from './WeekNavigator.vue'

describe('WeekNavigator', () => {
  it('selects a day from the week strip', async () => {
    const wrapper = mount(WeekNavigator, {
      props: {
        selectedDate: '2026-10-27',
        days: [
          {
            date: '2026-10-27',
            day: '27',
            weekday: 'ter',
            liturgy: '3ª feira da 30ª Semana do Tempo Comum'
          },
          {
            date: '2026-10-28',
            day: '28',
            weekday: 'qua',
            liturgy: '4ª feira da 30ª Semana do Tempo Comum'
          }
        ]
      }
    })

    const buttons = wrapper.findAll('button')
    expect(buttons[0].attributes('aria-pressed')).toBe('true')
    await buttons[1].trigger('click')
    expect(wrapper.emitted('select')?.[0]).toEqual(['2026-10-28'])
  })
})
