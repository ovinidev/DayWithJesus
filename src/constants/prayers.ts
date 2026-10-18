export const PRAYERS = {
  ourFather: {
    name: 'Pai-Nosso',
    text: 'Pai nosso, que estais nos céus,\nsantificado seja o vosso nome;\nvenha a nós o vosso reino;\nseja feita a vossa vontade,\nassim na terra como no céu.\n\nO pão nosso de cada dia nos dai hoje;\nperdoai-nos as nossas ofensas,\nassim como nós perdoamos a quem nos tem ofendido;\ne não nos deixeis cair em tentação,\nmas livrai-nos do mal.\n\nAmém.'
  },
  hailMary: {
    name: 'Ave-Maria',
    text: 'Ave Maria, cheia de graça,\no Senhor é convosco;\nbendita sois vós entre as mulheres,\ne bendito é o fruto do vosso ventre, Jesus.\n\nSanta Maria, Mãe de Deus,\nrogai por nós, pecadores,\nagora e na hora da nossa morte.\n\nAmém.'
  },
  saintBenedict: {
    name: 'Oração de São Bento',
    text: 'A Cruz Sagrada seja a minha luz,\nnão seja o dragão o meu guia.\n\nRetira-te, Satanás!\nNunca me aconselhes coisas vãs.\nÉ mau o que tu me ofereces,\nbebe tu mesmo os teus venenos!\n\nAmém.'
  },
  creed: {
    name: 'Credo',
    text: 'Creio em Deus Pai todo-poderoso,\ncriador do céu e da terra;\ne em Jesus Cristo, seu único Filho, nosso Senhor;\nque foi concebido pelo poder do Espírito Santo;\nnasceu da Virgem Maria;\npadeceu sob Pôncio Pilatos,\nfoi crucificado, morto e sepultado;\ndesceu à mansão dos mortos;\nressuscitou ao terceiro dia;\nsubiu aos céus;\nestá sentado à direita de Deus Pai todo-poderoso,\nde onde há de vir a julgar os vivos e os mortos.\n\nCreio no Espírito Santo;\nna santa Igreja Católica;\nna comunhão dos santos;\nna remissão dos pecados;\nna ressurreição da carne;\nna vida eterna.\n\nAmém.'
  },
  guardianAngel: {
    name: 'Santo Anjo',
    text: 'Santo Anjo do Senhor,\nmeu zeloso guardador,\nse a ti me confiou a piedade divina,\nsempre me rege, guarda,\ngoverna e ilumina.\n\nAmém.'
  },
  gloryBe: {
    name: 'Glória ao Pai',
    text: 'Glória ao Pai, ao Filho e ao Espírito Santo.\n\nComo era no princípio, agora e sempre.\n\nAmém.'
  },
  actOfContrition: {
    name: 'Ato de Contrição',
    text: 'Meu Deus, porque sois infinitamente bom e vos amo de todo o meu coração, pesa-me de vos ter ofendido.\n\nPrometo, com a vossa graça, esforçar-me para não mais pecar e evitar as ocasiões de pecado.\n\nAmém.'
  },
  comeHolySpirit: {
    name: 'Vinde, Espírito Santo',
    text: 'Vinde, Espírito Santo, enchei os corações dos vossos fiéis e acendei neles o fogo do vosso amor.\n\nEnviai o vosso Espírito e tudo será criado.\n\nE renovareis a face da terra.\n\nOremos: Ó Deus, que instruístes os corações dos vossos fiéis com a luz do Espírito Santo, fazei que apreciemos retamente todas as coisas segundo o mesmo Espírito e gozemos sempre da sua consolação. Por Cristo, Senhor nosso.\n\nAmém.'
  }
} as const

export type PrayerKey = keyof typeof PRAYERS
