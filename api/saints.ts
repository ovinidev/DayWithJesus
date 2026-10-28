// Keep the .js suffix. Vercel emits these files as ESM, and Node cannot resolve extensionless imports.
import { saintsResponseForQuery } from '../src/server/saints/http.js'

interface SaintsNodeRequest {
  query?: Record<string, unknown>
}

interface SaintsNodeResponse {
  setHeader(name: string, value: string): void
  status(code: number): { send(body: string): void }
}

const firstQueryValue = (value: unknown): string | null => {
  const raw = Array.isArray(value) ? value[0] : value
  return typeof raw === 'string' ? raw : null
}

const isWebRequest = (value: unknown): value is Request =>
  typeof value === 'object' &&
  value !== null &&
  typeof (value as Request).url === 'string' &&
  typeof (value as { text?: unknown }).text === 'function'

export function GET(request: Request): Promise<Response> {
  const url = new URL(request.url)

  return saintsResponseForQuery({
    dia: url.searchParams.get('dia'),
    mes: url.searchParams.get('mes'),
    ano: url.searchParams.get('ano')
  })
}

export default async function handler(
  request: Request | SaintsNodeRequest,
  response?: SaintsNodeResponse
): Promise<Response | void> {
  if (isWebRequest(request) && !response) return GET(request)

  const query = 'query' in request ? request.query : undefined
  const result = await saintsResponseForQuery({
    dia: firstQueryValue(query?.dia),
    mes: firstQueryValue(query?.mes),
    ano: firstQueryValue(query?.ano)
  })
  if (!response) return result

  result.headers.forEach((value, key) => {
    response.setHeader(key, value)
  })
  response.status(result.status).send(await result.text())
}
