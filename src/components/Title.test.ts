import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Title from './Title.vue'

describe('Title', () => {
  it('renders the page title and keeps the homily search shortcut', async () => {
    const open = vi.spyOn(window, 'open').mockImplementation(() => null)
    const wrapper = mount(Title, {
      props: { title: 'Evangelho do dia' }
    })

    expect(wrapper.get('h1').text()).toBe('Evangelho do dia')
    await wrapper.get('h1').trigger('click')
    expect(open).toHaveBeenCalled()
    open.mockRestore()
  })
})
