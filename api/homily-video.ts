import { fetchYoutube } from '../src/server/fetchYoutube'
import { respondToHomilyRequest } from '../src/server/respondToHomilyRequest'

interface HomilyRequest {
  query?: Record<string, unknown>
}

interface HomilyResponse {
  setHeader(name: string, value: string): void
  status(code: number): { json(body: unknown): void }
}

export default async function handler(
  request: HomilyRequest,
  response: HomilyResponse
) {
  const result = await respondToHomilyRequest({
    dateParam: request.query?.date,
    fetchFeed: fetchYoutube
  })
  response.setHeader('Cache-Control', result.cacheControl)
  response.setHeader('Content-Type', 'application/json; charset=utf-8')
  response.status(result.statusCode).json(result.body)
}
