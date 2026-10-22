import { PRAYERS } from '@/constants/prayers'

export interface RosaryMystery {
  title: string
  meditation: string
}

export const ROSARY_MYSTERY_GROUPS = {
  joyful: {
    name: 'Mistérios Gozosos',
    mysteries: [
      {
        title: 'A Anunciação do Anjo a Maria',
        meditation:
          'Contemplemos Maria acolhendo com fé o anúncio do anjo Gabriel.'
      },
      {
        title: 'A Visitação de Maria a Isabel',
        meditation:
          'Contemplemos Maria levando Jesus e a alegria da fé à sua prima Isabel.'
      },
      {
        title: 'O Nascimento de Jesus',
        meditation:
          'Contemplemos Jesus que nasce pobre em Belém para nossa salvação.'
      },
      {
        title: 'A Apresentação de Jesus no Templo',
        meditation:
          'Contemplemos Maria e José oferecendo Jesus ao Pai no Templo.'
      },
      {
        title: 'A Perda e o Encontro de Jesus no Templo',
        meditation:
          'Contemplemos Jesus entre os doutores, ocupado com as coisas de seu Pai.'
      }
    ]
  },
  luminous: {
    name: 'Mistérios Luminosos',
    mysteries: [
      {
        title: 'O Batismo de Jesus no Jordão',
        meditation:
          'Contemplemos Jesus, Filho amado do Pai, revelado nas águas do Jordão.'
      },
      {
        title: 'A Autor-revelação de Jesus nas Bodas de Caná',
        meditation:
          'Contemplemos Jesus que realiza seu primeiro sinal pela intercessão de Maria.'
      },
      {
        title: 'O Anúncio do Reino de Deus',
        meditation:
          'Contemplemos Jesus que chama à conversão e anuncia o Reino.'
      },
      {
        title: 'A Transfiguração de Jesus',
        meditation:
          'Contemplemos a glória de Cristo e escutemos o Pai que nos pede para ouvi-lo.'
      },
      {
        title: 'A Instituição da Eucaristia',
        meditation:
          'Contemplemos Jesus que se entrega como alimento na Eucaristia.'
      }
    ]
  },
  sorrowful: {
    name: 'Mistérios Dolorosos',
    mysteries: [
      {
        title: 'A Agonia de Jesus no Horto',
        meditation:
          'Contemplemos Jesus que aceita a vontade do Pai no Getsêmani.'
      },
      {
        title: 'A Flagelação de Jesus',
        meditation: 'Contemplemos Jesus flagelado por amor à humanidade.'
      },
      {
        title: 'A Coroação de Espinhos',
        meditation: 'Contemplemos Jesus humilhado e coroado de espinhos.'
      },
      {
        title: 'Jesus Carrega a Cruz',
        meditation:
          'Contemplemos Jesus que carrega a cruz no caminho do Calvário.'
      },
      {
        title: 'A Crucificação e Morte de Jesus',
        meditation: 'Contemplemos Jesus que entrega sua vida na cruz por nós.'
      }
    ]
  },
  glorious: {
    name: 'Mistérios Gloriosos',
    mysteries: [
      {
        title: 'A Ressurreição de Jesus',
        meditation: 'Contemplemos Cristo ressuscitado, vencedor da morte.'
      },
      {
        title: 'A Ascensão de Jesus ao Céu',
        meditation: 'Contemplemos Jesus que sobe ao céu e nos prepara um lugar.'
      },
      {
        title: 'A Vinda do Espírito Santo',
        meditation:
          'Contemplemos o Espírito Santo que desce sobre Maria e os apóstolos.'
      },
      {
        title: 'A Assunção de Maria ao Céu',
        meditation: 'Contemplemos Maria elevada ao céu em corpo e alma.'
      },
      {
        title: 'A Coroação de Maria',
        meditation: 'Contemplemos Maria coroada como Rainha do céu e da terra.'
      }
    ]
  }
} as const

export type RosaryMysteryGroupKey = keyof typeof ROSARY_MYSTERY_GROUPS

export const ROSARY_GROUP_ORDER: RosaryMysteryGroupKey[] = [
  'joyful',
  'luminous',
  'sorrowful',
  'glorious'
]

export const rosaryGroupForDate = (
  date = new Date()
): RosaryMysteryGroupKey => {
  const groupsByDay: RosaryMysteryGroupKey[] = [
    'glorious',
    'joyful',
    'sorrowful',
    'glorious',
    'luminous',
    'sorrowful',
    'joyful'
  ]

  return groupsByDay[date.getDay()]
}

export interface RosaryStep {
  id: string
  kind: 'opening' | 'mystery' | 'prayer' | 'closing'
  label: string
  title: string
  text: string
  mysteryNumber?: number
  group: RosaryMysteryGroupKey
}

const signOfCross =
  'Pelo sinal da Santa Cruz, livrai-nos, Deus, nosso Senhor, dos nossos inimigos.\n\nEm nome do Pai, do Filho e do Espírito Santo. Amém.'
const offering =
  'Divino Jesus, nós Vos oferecemos este terço que vamos rezar, meditando nos mistérios da nossa redenção. Concedei-nos, pela intercessão de Maria, Vossa Mãe Santíssima, as virtudes que nos são necessárias para bem rezá-lo e a graça de ganharmos as indulgências desta santa devoção. Amém.'
const fatimaPrayer =
  'Ó meu Jesus, perdoai-nos, livrai-nos do fogo do inferno, levai as almas todas para o céu e socorrei principalmente as que mais precisarem.'
const hailHolyQueen =
  'Salve, Rainha, Mãe de misericórdia, vida, doçura e esperança nossa, salve! A vós bradamos os degredados filhos de Eva. A vós suspiramos, gemendo e chorando neste vale de lágrimas. Eia, pois, advogada nossa, esses vossos olhos misericordiosos a nós volvei; e, depois deste desterro, mostrai-nos Jesus, bendito fruto do vosso ventre. Ó clemente, ó piedosa, ó doce sempre Virgem Maria. Rogai por nós, santa Mãe de Deus, para que sejamos dignos das promessas de Cristo. Amém.'
const finalPrayer =
  'Oremos: Ó Deus, cujo Filho unigênito, por sua vida, morte e ressurreição, nos alcançou os prêmios da salvação eterna, concedei-nos, nós Vos suplicamos, que, meditando estes mistérios do santíssimo Rosário da Bem-aventurada Virgem Maria, imitemos o que contêm e alcancemos o que prometem. Por Cristo, Senhor nosso. Amém.'

export const buildRosarySteps = (
  group: RosaryMysteryGroupKey
): RosaryStep[] => {
  const steps: Omit<RosaryStep, 'group'>[] = [
    {
      id: 'sign-start',
      kind: 'opening',
      label: 'Início',
      title: 'Sinal da Cruz',
      text: signOfCross
    },
    {
      id: 'offering',
      kind: 'opening',
      label: 'Oferecimento',
      title: 'Oferecimento do Terço',
      text: offering
    },
    {
      id: 'creed',
      kind: 'opening',
      label: 'Crucifixo',
      title: PRAYERS.creed.name,
      text: PRAYERS.creed.text
    },
    {
      id: 'opening-father',
      kind: 'opening',
      label: 'Primeira conta',
      title: PRAYERS.ourFather.name,
      text: PRAYERS.ourFather.text
    },
    ...['pela fé', 'pela esperança', 'pela caridade'].map(
      (intention, index) => ({
        id: `opening-hail-${index + 1}`,
        kind: 'opening' as const,
        label: `Ave-Maria ${index + 1}`,
        title: PRAYERS.hailMary.name,
        text: `${PRAYERS.hailMary.text}\n\nIntenção: ${intention}.`
      })
    ),
    {
      id: 'opening-glory',
      kind: 'opening',
      label: 'Abertura',
      title: PRAYERS.gloryBe.name,
      text: PRAYERS.gloryBe.text
    }
  ]

  ROSARY_MYSTERY_GROUPS[group].mysteries.forEach((mystery, mysteryIndex) => {
    const number = mysteryIndex + 1
    steps.push({
      id: `mystery-${number}`,
      kind: 'mystery',
      label: `${number}º mistério`,
      title: mystery.title,
      text: mystery.meditation,
      mysteryNumber: number
    })
    steps.push({
      id: `mystery-${number}-father`,
      kind: 'prayer',
      label: `${number}º mistério`,
      title: PRAYERS.ourFather.name,
      text: PRAYERS.ourFather.text,
      mysteryNumber: number
    })
    for (let hailIndex = 1; hailIndex <= 10; hailIndex += 1) {
      steps.push({
        id: `mystery-${number}-hail-${hailIndex}`,
        kind: 'prayer',
        label: `${number}º mistério · Ave-Maria ${hailIndex}/10`,
        title: PRAYERS.hailMary.name,
        text: PRAYERS.hailMary.text,
        mysteryNumber: number
      })
    }
    steps.push({
      id: `mystery-${number}-glory`,
      kind: 'prayer',
      label: `${number}º mistério`,
      title: PRAYERS.gloryBe.name,
      text: PRAYERS.gloryBe.text,
      mysteryNumber: number
    })
    steps.push({
      id: `mystery-${number}-fatima`,
      kind: 'prayer',
      label: `${number}º mistério`,
      title: 'Oração de Fátima',
      text: fatimaPrayer,
      mysteryNumber: number
    })
  })

  steps.push(
    {
      id: 'hail-holy-queen',
      kind: 'closing',
      label: 'Conclusão',
      title: 'Salve Rainha',
      text: hailHolyQueen
    },
    {
      id: 'final-prayer',
      kind: 'closing',
      label: 'Conclusão',
      title: 'Oração final',
      text: finalPrayer
    },
    {
      id: 'sign-end',
      kind: 'closing',
      label: 'Conclusão',
      title: 'Sinal da Cruz',
      text: signOfCross
    }
  )

  return steps.map((step) => ({ ...step, group }))
}

export const buildFullRosarySteps = (): RosaryStep[] =>
  ROSARY_GROUP_ORDER.flatMap((group) => buildRosarySteps(group))
