import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import HomilyPlayer from '@/components/HomilyPlayer.vue'
import { parseHomilyLookup } from '@/utils/homilyFeed'

const video = (videoId: string, title: string) => {
  const lookup = parseHomilyLookup({
    kind: 'found',
    video: {
      videoId,
      title,
      thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
    }
  })
  if (lookup.kind !== 'found') throw new Error('fixture was not a video')
  return lookup.video
}

describe('HomilyPlayer', () => {
  it('loads the YouTube iframe only after the poster is chosen', async () => {
    const wrapper = mount(HomilyPlayer, {
      props: { video: video('ZoHnRzQ60gQ', 'O grão de mostarda') }
    })

    expect(wrapper.find('iframe').exists()).toBe(false)
    expect(wrapper.get('img').attributes('src')).toBe(
      'https://i.ytimg.com/vi/ZoHnRzQ60gQ/hqdefault.jpg'
    )

    await wrapper.get('button').trigger('click')

    const iframe = wrapper.get('iframe')
    expect(iframe.attributes('src')).toBe(
      'https://www.youtube-nocookie.com/embed/ZoHnRzQ60gQ?autoplay=1&rel=0'
    )
    expect(iframe.attributes('title')).toBe('O grão de mostarda')
  })

  it('stops the previous homily when the video changes', async () => {
    const wrapper = mount(HomilyPlayer, {
      props: { video: video('ZoHnRzQ60gQ', 'O grão de mostarda') }
    })

    await wrapper.get('button').trigger('click')
    await wrapper.setProps({
      video: video('8OeXYWHvTJQ', 'Subiu à montanha para orar')
    })

    expect(wrapper.find('iframe').exists()).toBe(false)
    expect(wrapper.get('button').attributes('aria-label')).toBe(
      'Assistir Subiu à montanha para orar'
    )
  })
})
