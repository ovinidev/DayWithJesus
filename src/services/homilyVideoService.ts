import axios from 'axios'
import { parseHomilyLookup, type HomilyLookup } from '@/utils/homilyFeed'

export const getHomilyVideo = async (date: string): Promise<HomilyLookup> => {
  const { data } = await axios.get<unknown>('/api/homily-video', {
    params: { date }
  })
  return parseHomilyLookup(data)
}
