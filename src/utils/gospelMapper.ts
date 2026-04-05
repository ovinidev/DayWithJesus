import { Liturgy, LiturgyResponse } from '@/types'

export const gospelMapper = (data: LiturgyResponse): Liturgy => {
  const gospel = data.leituras.evangelho.map((gospel) => ({
    reference: gospel.referencia,
    title: gospel.titulo,
    text: gospel.texto
  }))

  return {
    gospel,
    date: data.data,
    color: data.cor,
    liturgy: data.liturgia
  }
}
