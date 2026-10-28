import { saintsResponseForQuery } from '../src/server/saints/http'

export function GET(request: Request): Promise<Response> {
  const url = new URL(request.url)

  return saintsResponseForQuery({
    dia: url.searchParams.get('dia'),
    mes: url.searchParams.get('mes'),
    ano: url.searchParams.get('ano')
  })
}
