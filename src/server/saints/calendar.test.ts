import { describe, expect, it } from 'vitest'
import { isIsoDate } from '@/utils/liturgicalDate'
import { saintsOn, selectDay } from './calendar'

const on = async (iso: string) => {
  if (!isIsoDate(iso)) throw new Error(`Data de teste inválida: ${iso}`)
  return saintsOn(iso)
}

describe('saints of a civil date', () => {
  it('lists Santos Simão e São Judas on 28 October 2026', async () => {
    const day = await on('2026-10-28')

    expect(day.saints.map((saint) => saint.name)).toEqual([
      'Santos Simão e São Judas Tadeu, apóstolos'
    ])
    expect(day.saints[0]).toMatchObject({
      id: 'simon_and_jude_apostles',
      rankName: 'festa'
    })
  })

  it('lists São Carlos Borromeu on 4 November 2026', async () => {
    const day = await on('2026-11-04')

    expect(day.saints.map((saint) => saint.name)).toEqual([
      'São Carlos Borromeu, bispo'
    ])
    expect(day.saints[0]?.rankName).toBe('memória')
  })

  it('keeps the feria and both optional memorials on 16 October 2026', async () => {
    const day = await on('2026-10-16')

    expect(day.liturgia).toBe('Sexta-feira da 28ª semana do Tempo Comum')
    expect(day.saints.map((saint) => saint.name)).toEqual([
      'Santa Edviges, religiosa',
      'Santa Margarida Maria Alacoque, virgem'
    ])
    expect(day.saints.map((saint) => saint.rankName)).toEqual([
      'memória facultativa',
      'memória facultativa'
    ])
  })

  it('lists Nossa Senhora Aparecida on 12 October 2026', async () => {
    const day = await on('2026-10-12')

    expect(day.saints).toEqual([
      {
        id: 'our_lady_of_aparecida',
        name: 'Nossa Senhora da Conceição Aparecida, Padroeira do Brasil',
        rankName: 'solenidade'
      }
    ])
  })

  it('has no saint on Christmas or on an ordinary Sunday', async () => {
    const christmas = await on('2026-12-25')
    const sunday = await on('2026-10-18')

    expect(christmas.liturgia).toBe('Natal')
    expect(christmas.saints).toEqual([])
    expect(sunday.liturgia).toBe('29º Domingo do Tempo Comum')
    expect(sunday.saints).toEqual([])
  })
})

describe('selectDay', () => {
  it('drops the weekday and keeps optional memorials', () => {
    const day = selectDay([
      {
        id: 'ordinary_time_28_friday',
        name: 'Sexta-feira da 28ª semana do Tempo Comum',
        rankName: 'dia de semana',
        cycles: { properCycle: 'PROPER_OF_TIME' }
      },
      {
        id: 'hedwig_of_silesia_religious',
        name: 'Santa Edviges, religiosa',
        rankName: 'memória facultativa',
        cycles: { properCycle: 'PROPER_OF_SAINTS' }
      },
      { id: 'blank', name: '   ', cycles: { properCycle: 'PROPER_OF_SAINTS' } },
      null
    ])

    expect(day.liturgia).toBe('Sexta-feira da 28ª semana do Tempo Comum')
    expect(day.saints.map((saint) => saint.name)).toEqual([
      'Santa Edviges, religiosa'
    ])
  })
})
