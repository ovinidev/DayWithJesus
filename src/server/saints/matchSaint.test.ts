import { describe, expect, it } from 'vitest'
import {
  chooseWikipediaPage,
  formatPatrons,
  formatWikidataTime,
  parsePortugueseLabels,
  parseWikidataEntity,
  saintQueriesFor,
  type WikiPageCandidate
} from './matchSaint'

const page = (
  title: string,
  description: string | null,
  extract: string,
  type = 'standard'
): WikiPageCandidate => ({ title, type, description, extract })

describe('Wikipedia matching', () => {
  it('uses the manual titles for Simão e Judas', () => {
    expect(
      saintQueriesFor({
        id: 'simon_and_jude_apostles',
        name: 'Santos Simão e São Judas Tadeu, apóstolos',
        rankName: 'festa'
      })
    ).toEqual([
      {
        nome: 'São Simão, apóstolo',
        wikipediaTitle: 'Simão, o Zelote',
        grau: 'festa'
      },
      {
        nome: 'São Judas Tadeu, apóstolo',
        wikipediaTitle: 'Judas Tadeu',
        grau: 'festa'
      }
    ])
  })

  it('locks Edviges to the saint of Silesia', () => {
    expect(
      saintQueriesFor({
        id: 'hedwig_of_silesia_religious',
        name: 'Santa Edviges, religiosa',
        rankName: 'memória facultativa'
      })
    ).toEqual([
      {
        nome: 'Santa Edviges, religiosa',
        wikipediaTitle: 'Edviges da Silésia',
        grau: 'memória facultativa'
      }
    ])
  })

  it('points Aparecida at the Wikipedia title', () => {
    expect(
      saintQueriesFor({
        id: 'our_lady_of_aparecida',
        name: 'Nossa Senhora da Conceição Aparecida, Padroeira do Brasil',
        rankName: 'solenidade'
      })[0]?.wikipediaTitle
    ).toBe('Nossa Senhora Aparecida')
  })

  it('does not treat Judas Tadeu as the whole feast of Simão e Judas', () => {
    expect(
      chooseWikipediaPage('Santos Simão e São Judas Tadeu, apóstolos', [
        page(
          'Judas Tadeu',
          'apóstolo de Jesus Cristo',
          'São Judas Tadeu foi um apóstolo.'
        ),
        page(
          'Judas Iscariotes',
          'apóstolo',
          'Judas Iscariotes foi um dos doze.'
        )
      ])
    ).toBeNull()
  })

  it('prefers Carlos Borromeu over a church that bears his name', () => {
    const chosen = chooseWikipediaPage('São Carlos Borromeu, bispo', [
      page(
        'Igreja de São Carlos Borromeu (Viena)',
        'igreja em Viena',
        'A igreja foi dedicada a Carlos Borromeu.'
      ),
      page(
        'Carlos Borromeu',
        null,
        'São Carlos Borromeu foi um Cardeal italiano e Arcebispo de Milão.'
      )
    ])

    expect(chosen?.title).toBe('Carlos Borromeu')
  })

  it('rejects the city of São Paulo and a disambiguation page', () => {
    expect(
      chooseWikipediaPage('São Paulo', [
        page(
          'São Paulo',
          'cidade mais populosa do Brasil e capital do estado de São Paulo',
          'São Paulo é a capital do estado.'
        )
      ])
    ).toBeNull()

    expect(
      chooseWikipediaPage('São José', [
        page('São José (desambiguação)', 'desambiguação', '', 'disambiguation'),
        page(
          'São José',
          'esposo da Virgem Maria, pai terreno de Jesus e santo',
          'José de Nazaré, conhecido como São José, foi o esposo da Virgem Maria.'
        )
      ])?.title
    ).toBe('São José')
  })

  it('splits a feast of two named saints when there is no override', () => {
    expect(
      saintQueriesFor({
        id: 'basil_the_great_and_gregory_nazianzen_bishops',
        name: 'São Basílio Magno e São Gregório Nazianzeno, bispos e doutores da Igreja',
        rankName: 'memória'
      }).map((query) => query.nome)
    ).toEqual(['São Basílio Magno', 'São Gregório Nazianzeno'])
  })

  it('keeps a single memorial as one search', () => {
    expect(
      saintQueriesFor({
        id: 'charles_borromeo_bishop',
        name: 'São Carlos Borromeu, bispo',
        rankName: 'memória'
      })
    ).toEqual([
      {
        nome: 'São Carlos Borromeu, bispo',
        wikipediaTitle: null,
        grau: 'memória'
      }
    ])
  })
})

describe('Wikidata facts', () => {
  it('formats a full date, a year, a year before Christ, and hides centuries', () => {
    expect(
      formatWikidataTime({ time: '+1538-10-02T00:00:00Z', precision: 11 })
    ).toBe('2 de outubro de 1538')
    expect(
      formatWikidataTime({ time: '+1174-01-01T00:00:00Z', precision: 9 })
    ).toBe('1174')
    expect(
      formatWikidataTime({ time: '+0010-00-00T00:00:00Z', precision: 9 })
    ).toBe('10 d.C.')
    expect(
      formatWikidataTime({ time: '-0030-00-00T00:00:00Z', precision: 9 })
    ).toBe('30 a.C.')
    expect(
      formatWikidataTime({ time: '+0100-00-00T00:00:00Z', precision: 7 })
    ).toBeNull()
  })

  it('reads birth, death, and patron ids from an entity payload', () => {
    expect(
      parseWikidataEntity(
        {
          entities: {
            Q216946: {
              claims: {
                P569: [
                  {
                    mainsnak: {
                      datavalue: {
                        value: { time: '+1538-10-02T00:00:00Z', precision: 11 }
                      }
                    }
                  }
                ],
                P570: [
                  {
                    mainsnak: {
                      datavalue: {
                        value: { time: '+1584-11-03T00:00:00Z', precision: 11 }
                      }
                    }
                  }
                ],
                P2925: [
                  { mainsnak: { datavalue: { value: { id: 'Q155' } } } },
                  { mainsnak: { datavalue: { value: { id: 'italy' } } } }
                ]
              }
            }
          }
        },
        'Q216946'
      )
    ).toEqual({
      nascimento: '2 de outubro de 1538',
      morte: '3 de novembro de 1584',
      patronIds: ['Q155']
    })
  })

  it('prefers Portuguese patron labels and keeps three', () => {
    expect(
      parsePortugueseLabels(
        {
          entities: {
            Q155: { labels: { pt: { value: 'Brasil' } } },
            Q38: {
              labels: { en: { value: 'Italy' }, pt: { value: 'Itália' } }
            },
            Q1: {
              labels: { en: { value: 'Sisters of Mercy of St. Borromeo' } }
            }
          }
        },
        ['Q155', 'Q38', 'Q1']
      )
    ).toEqual(['Brasil', 'Itália'])

    expect(
      formatPatrons(['Brasil', 'Brasil', 'Itália', 'Lombardia', 'Milão'])
    ).toBe('Brasil, Itália, Lombardia')
  })
})
