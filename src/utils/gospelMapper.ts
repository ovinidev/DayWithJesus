import { Liturgy, LiturgyResponse } from '@/types'

export const gospelMapper = (data: LiturgyResponse): Liturgy => {
  const mapReading = (reading: {
    referencia: string
    titulo: string
    texto: string
  }) => ({
    reference: reading.referencia,
    title: reading.titulo,
    text: reading.texto
  })

  const mapExtra = (extra: {
    titulo?: string
    tipo?: string
    referencia?: string
    texto: string
  }) => ({
    title: extra.titulo,
    type: extra.tipo,
    reference: extra.referencia,
    text: extra.texto
  })

  return {
    gospel: (data.leituras.evangelho ?? []).map(mapReading),
    firstReadings: (data.leituras.primeiraLeitura ?? []).map(mapReading),
    secondReadings: (data.leituras.segundaLeitura ?? []).map(mapReading),
    psalms: (data.leituras.salmo ?? []).map((psalm) => ({
      reference: psalm.referencia,
      refrain: psalm.refrao,
      text: psalm.texto
    })),
    extraReadings: (data.leituras.extras ?? []).map(mapExtra),
    prayers: {
      collect: data.oracoes.coleta,
      offerings: data.oracoes.oferendas,
      communion: data.oracoes.comunhao,
      extras: (data.oracoes.extras ?? []).map(mapExtra)
    },
    antiphons: {
      entrance: data.antifonas.entrada,
      communion: data.antifonas.comunhao
    },
    date: data.data,
    color: data.cor,
    liturgy: data.liturgia
  }
}
