import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import TodayDate from './TodayDate.vue'

describe('TodayDate', () => {
  it('formats a liturgical date for reading', () => {
    const wrapper = mount(TodayDate, {
      props: { dateStr: '27/10/2026' }
    })

    expect(wrapper.text().toLocaleLowerCase()).toContain(
      '27 de outubro de 2026'
    )
    expect(wrapper.text().toLocaleLowerCase()).toContain('terça-feira')
  })
})
