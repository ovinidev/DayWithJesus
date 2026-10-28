import { isoDateFromParts } from '../../utils/liturgicalDate.js'
import { buildSaintsResponse } from './loadSaints.js'

export interface DateQuery {
  dia: string | null
  mes: string | null
  ano: string | null
}

const json = (body: unknown, status: number, cacheControl: string): Response =>
  Response.json(body, {
    status,
    headers: { 'Cache-Control': cacheControl }
  })

export const saintsResponseForQuery = async (
  query: DateQuery
): Promise<Response> => {
  const date = isoDateFromParts(query)
  if (!date) {
    return json(
      { error: 'Informe uma data válida com dia, mês e ano.' },
      400,
      'no-store'
    )
  }

  try {
    const built = await buildSaintsResponse(date)
    return json(built.body, 200, built.cacheControl)
  } catch {
    return json(
      { error: 'Não foi possível consultar o calendário litúrgico.' },
      500,
      'no-store'
    )
  }
}
