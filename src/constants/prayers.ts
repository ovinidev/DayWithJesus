export const PRAYER_CATEGORIES = {
  basic: 'Orações básicas',
  marian: 'Marianas',
  saints: 'Aos santos',
  daily: 'Do dia a dia'
} as const

export type PrayerCategory = keyof typeof PRAYER_CATEGORIES

const keysOf = <T extends object>(value: T) =>
  Object.keys(value).filter((key): key is keyof T & string =>
    Object.prototype.hasOwnProperty.call(value, key)
  )

export const PRAYER_CATEGORY_ORDER = keysOf(PRAYER_CATEGORIES)

export const PRAYERS = {
  ourFather: {
    name: 'Pai-Nosso',
    category: 'basic',
    text: 'Pai nosso, que estais nos céus,\nsantificado seja o vosso nome;\nvenha a nós o vosso reino;\nseja feita a vossa vontade,\nassim na terra como no céu.\n\nO pão nosso de cada dia nos dai hoje;\nperdoai-nos as nossas ofensas,\nassim como nós perdoamos a quem nos tem ofendido;\ne não nos deixeis cair em tentação,\nmas livrai-nos do mal.\n\nAmém.'
  },
  hailMary: {
    name: 'Ave-Maria',
    category: 'basic',
    text: 'Ave Maria, cheia de graça,\no Senhor é convosco;\nbendita sois vós entre as mulheres,\ne bendito é o fruto do vosso ventre, Jesus.\n\nSanta Maria, Mãe de Deus,\nrogai por nós, pecadores,\nagora e na hora da nossa morte.\n\nAmém.'
  },
  gloryBe: {
    name: 'Glória ao Pai',
    category: 'basic',
    text: 'Glória ao Pai, ao Filho e ao Espírito Santo.\n\nComo era no princípio, agora e sempre.\n\nAmém.'
  },
  creed: {
    name: 'Credo',
    category: 'basic',
    text: 'Creio em Deus Pai todo-poderoso,\ncriador do céu e da terra;\ne em Jesus Cristo, seu único Filho, nosso Senhor;\nque foi concebido pelo poder do Espírito Santo;\nnasceu da Virgem Maria;\npadeceu sob Pôncio Pilatos,\nfoi crucificado, morto e sepultado;\ndesceu à mansão dos mortos;\nressuscitou ao terceiro dia;\nsubiu aos céus;\nestá sentado à direita de Deus Pai todo-poderoso,\nde onde há de vir a julgar os vivos e os mortos.\n\nCreio no Espírito Santo;\nna santa Igreja Católica;\nna comunhão dos santos;\nna remissão dos pecados;\nna ressurreição da carne;\nna vida eterna.\n\nAmém.'
  },
  actOfContrition: {
    name: 'Ato de Contrição',
    category: 'basic',
    text: 'Meu Deus, porque sois infinitamente bom e vos amo de todo o meu coração, pesa-me de vos ter ofendido.\n\nPrometo, com a vossa graça, esforçar-me para não mais pecar e evitar as ocasiões de pecado.\n\nAmém.'
  },
  actOfFaith: {
    name: 'Ato de fé',
    category: 'basic',
    text: 'Meu Deus, eu creio firmemente tudo quanto a Santa Igreja Católica, Apostólica, Romana, manda crer, porque sois vós, ó verdade infalível, que lho tendes revelado.\n\nAmém.'
  },
  actOfHope: {
    name: 'Ato de esperança',
    category: 'basic',
    text: 'Meu Deus, espero com firme confiança que me dareis, pelos merecimentos de Jesus Cristo, a vossa graça nesta vida, e, se observar os vossos mandamentos, a vossa glória na outra, porque vós haveis prometido e sois sumamente fiel em vossas promessas.\n\nAmém.'
  },
  actOfCharity: {
    name: 'Ato de caridade',
    category: 'basic',
    text: 'Meu Deus, eu vos amo de todo meu coração e sobre todas as coisas, porque sois infinitamente bom, infinitamente amável; por amor de vós, amo ao meu próximo como a mim mesmo.\n\nAmém.'
  },
  comeHolySpirit: {
    name: 'Vinde, Espírito Santo',
    category: 'basic',
    text: 'Vinde, Espírito Santo, enchei os corações dos vossos fiéis e acendei neles o fogo do vosso amor.\n\nEnviai o vosso Espírito e tudo será criado.\n\nE renovareis a face da terra.\n\nOremos: Ó Deus, que instruístes os corações dos vossos fiéis com a luz do Espírito Santo, fazei que apreciemos retamente todas as coisas segundo o mesmo Espírito e gozemos sempre da sua consolação. Por Cristo, Senhor nosso.\n\nAmém.'
  },
  hailHolyQueen: {
    name: 'Salve Rainha',
    category: 'marian',
    text: 'Salve, Rainha, mãe de misericórdia,\nvida, doçura, esperança nossa, salve!\nA vós bradamos, os degredados filhos de Eva.\nA vós suspiramos, gemendo e chorando\nneste vale de lágrimas.\nEia, pois, advogada nossa,\nesses vossos olhos misericordiosos a nós volvei.\nE, depois deste desterro,\nnos mostrai Jesus, bendito fruto do vosso ventre.\nÓ clemente, ó piedosa, ó doce Virgem Maria.\n\nRogai por nós, Santa Mãe de Deus,\npara que sejamos dignos das promessas de Cristo.\n\nAmém.'
  },
  magnificat: {
    name: 'Magnificat',
    category: 'marian',
    text: 'A minha alma glorifica ao Senhor\ne o meu espírito se alegra em Deus, meu Salvador.\nPorque pôs os olhos na humildade da sua serva:\nde hoje em diante me chamarão bem-aventurada\ntodas as gerações.\nO Todo-Poderoso fez em mim maravilhas:\nSanto é o seu nome.\nA sua misericórdia se estende de geração em geração\nsobre aqueles que o temem.\nManifestou o poder do seu braço\ne dispersou os soberbos.\nDerrubou os poderosos de seus tronos\ne exaltou os humildes.\nAos famintos encheu de bens\ne aos ricos despediu de mãos vazias.\nAcolheu Israel, seu servo,\nlembrado da sua misericórdia,\ncomo tinha prometido a nossos pais,\na Abraão e à sua descendência para sempre.\n\nGlória ao Pai e ao Filho e ao Espírito Santo.\nComo era no princípio, agora e sempre.\n\nAmém.'
  },
  angelus: {
    name: 'Angelus',
    category: 'marian',
    text: 'V. O Anjo do Senhor anunciou a Maria.\nR. E ela concebeu do Espírito Santo.\nAve-Maria.\n\nV. Eis aqui a serva do Senhor.\nR. Faça-se em mim segundo a vossa palavra.\nAve-Maria.\n\nV. E o Verbo se fez carne.\nR. E habitou entre nós.\nAve-Maria.\n\nV. Rogai por nós, Santa Mãe de Deus.\nR. Para que sejamos dignos das promessas de Cristo.\n\nOremos: Infundi, Senhor, a vossa graça em nossas almas, para que nós, que pela anunciação do Anjo conhecemos a encarnação de Jesus Cristo, vosso Filho, por sua paixão e cruz sejamos conduzidos à glória da ressurreição. Pelo mesmo Cristo, Senhor nosso.\n\nAmém.'
  },
  reginaCoeli: {
    name: 'Regina Coeli',
    category: 'marian',
    text: 'V. Rainha do céu, alegrai-vos, aleluia.\nR. Porque aquele que merecestes trazer em vosso seio, aleluia.\nV. Ressuscitou, como disse, aleluia.\nR. Rogai a Deus por nós, aleluia.\n\nV. Exultai e alegrai-vos, ó Virgem Maria, aleluia.\nR. Porque o Senhor ressuscitou verdadeiramente, aleluia.\n\nOremos: Ó Deus, que vos dignastes alegrar o mundo com a ressurreição do vosso Filho, Jesus Cristo, Senhor nosso, concedei-nos, vos suplicamos, que por sua Mãe, a Virgem Maria, alcancemos as alegrias da vida eterna. Por Cristo, Senhor nosso.\n\nAmém.'
  },
  memorare: {
    name: 'Lembrai-vos',
    category: 'marian',
    text: 'Lembrai-vos, ó piíssima Virgem Maria,\nque nunca se ouviu dizer\nque algum daqueles que têm recorrido à vossa proteção,\nimplorado a vossa assistência\ne reclamado o vosso socorro\nfosse por vós desamparado.\n\nAnimado eu, pois, de igual confiança,\na vós, ó Virgem entre todas singular,\ncomo a Mãe recorro, de vós me valho e,\ngemendo sob o peso dos meus pecados,\nme prostro aos vossos pés.\n\nNão desprezeis as minhas súplicas,\nó Mãe do Filho de Deus humanado,\nmas dignai-vos de as ouvir propícia\ne de me alcançar o que vos rogo.\n\nAmém.'
  },
  maryConsecration: {
    name: 'Consagração a Nossa Senhora',
    category: 'marian',
    text: 'Ó minha Senhora, ó minha Mãe,\neu me ofereço todo a vós\ne, em prova da minha devoção para convosco,\nvos consagro neste dia os meus olhos,\nos meus ouvidos, a minha boca, o meu coração\ne inteiramente todo o meu ser.\n\nE, porque assim sou vosso, ó incomparável Mãe,\nguardai-me e defendei-me\ncomo coisa e propriedade vossa.\n\nAmém.'
  },
  guardianAngel: {
    name: 'Santo Anjo',
    category: 'saints',
    text: 'Santo Anjo do Senhor,\nmeu zeloso guardador,\nse a ti me confiou a piedade divina,\nsempre me rege, guarda,\ngoverna e ilumina.\n\nAmém.'
  },
  saintMichael: {
    name: 'Oração de São Miguel Arcanjo',
    category: 'saints',
    text: 'São Miguel Arcanjo,\ndefendei-nos no combate.\nSede o nosso refúgio\ncontra as maldades e ciladas do demônio.\nQue Deus manifeste o seu poder sobre ele.\nEis a nossa humilde súplica.\nE vós, Príncipe da Milícia Celeste,\ncom o poder que Deus vos conferiu,\nprecipitai no inferno Satanás\ne os outros espíritos malignos\nque andam pelo mundo tentando as almas.\n\nAmém.'
  },
  saintJoseph: {
    name: 'Oração a São José',
    category: 'saints',
    text: 'A vós, São José, recorremos em nossa tribulação e, tendo implorado o auxílio de vossa santíssima esposa, cheios de confiança solicitamos também o vosso patrocínio.\n\nPor esse laço sagrado de caridade que vos uniu à Virgem Imaculada Mãe de Deus, e pelo amor paternal que tivestes ao Menino Jesus, ardentemente vos suplicamos que lanceis um olhar favorável sobre a herança que Jesus Cristo conquistou com o seu sangue, e nos socorrais em nossas necessidades com o vosso auxílio e poder.\n\nProtegei, ó guarda providente da Divina Família, o povo eleito de Jesus Cristo.\n\nAfastai para longe de nós, ó pai amantíssimo, a peste do erro e do vício.\n\nAssisti-nos do alto do céu, ó nosso fortíssimo sustentáculo, na luta contra o poder das trevas, e assim como outrora salvastes da morte a vida ameaçada do Menino Jesus, assim também defendei agora a Santa Igreja de Deus das ciladas do Inimigo e de toda adversidade.\n\nAmparai a cada um de nós com o vosso constante patrocínio, a fim de que, a vosso exemplo e sustentados com o vosso auxílio, possamos viver virtuosamente, morrer piedosamente e obter no céu a eterna bem-aventurança.\n\nAmém.'
  },
  saintFrancis: {
    name: 'Oração de São Francisco',
    category: 'saints',
    text: 'Senhor, fazei de mim um instrumento de vossa paz.\nOnde houver ódio, que eu leve o amor.\nOnde houver ofensa, que eu leve o perdão.\nOnde houver discórdia, que eu leve a união.\nOnde houver dúvida, que eu leve a fé.\nOnde houver erro, que eu leve a verdade.\nOnde houver desespero, que eu leve a esperança.\nOnde houver tristeza, que eu leve a alegria.\nOnde houver trevas, que eu leve a luz.\n\nÓ Mestre, fazei que eu procure mais\nconsolar, que ser consolado;\ncompreender, que ser compreendido;\namar, que ser amado.\nPois é dando que se recebe,\né perdoando que se é perdoado,\ne é morrendo que se vive para a vida eterna.\n\nAmém.'
  },
  saintBenedict: {
    name: 'Oração de São Bento',
    category: 'saints',
    text: 'A Cruz Sagrada seja a minha luz,\nnão seja o dragão o meu guia.\n\nRetira-te, Satanás!\nNunca me aconselhes coisas vãs.\nÉ mau o que tu me ofereces,\nbebe tu mesmo os teus venenos!\n\nAmém.'
  },
  morningPrayer: {
    name: 'Oração da manhã',
    category: 'daily',
    text: 'Eu vos adoro, meu Deus, e vos amo de todo o coração.\nDou-vos graças por me terdes criado, feito cristão\ne conservado nesta noite.\nOfereço-vos todas as minhas ações\ne peço-vos que neste dia me preserveis do pecado,\nme livreis de todo o mal\ne me concedais a vossa graça\npara cumprir a vossa vontade\nem todas as ações do dia que, para a vossa glória, agora se inicia.\n\nAmém.'
  },
  nightPrayer: {
    name: 'Oração da noite',
    category: 'daily',
    text: 'Dignai-vos, Senhor, conservar-me esta noite sem pecado.\nAbençoai o descanso que vou tomar,\na fim de recuperar as forças\npara vos servir melhor e com mais fervor.\n\nVirgem Santa, depois de Deus minha única esperança,\nmeu bom Anjo da Guarda e todos os santos de Deus,\nintercedei por mim e pela minha família.\nProtegei-me esta noite e na hora da minha morte.\n\nAmém.'
  },
  graceBeforeMeals: {
    name: 'Oração antes das refeições',
    category: 'daily',
    text: 'Bendizei-nos, Senhor,\ne a estes alimentos\nque vamos receber da vossa bondade.\nPor Cristo, Senhor nosso.\n\nAmém.'
  },
  animaChristi: {
    name: 'Alma de Cristo',
    category: 'daily',
    text: 'Alma de Cristo, santificai-me.\nCorpo de Cristo, salvai-me.\nSangue de Cristo, inebriai-me.\nÁgua do lado de Cristo, lavai-me.\nPaixão de Cristo, confortai-me.\nÓ bom Jesus, ouvi-me.\nDentro das vossas chagas, escondei-me.\nNão permitais que eu me separe de vós.\nDo inimigo maligno, defendei-me.\nNa hora da minha morte, chamai-me.\nMandai-me ir para vós,\npara que vos louve com os vossos santos\npelos séculos dos séculos.\n\nAmém.'
  },
  divineMercy: {
    name: 'Terço da Misericórdia',
    category: 'daily',
    text: 'No início, reza-se um Pai-Nosso, uma Ave-Maria e o Credo.\n\nNas contas grandes:\nEterno Pai, eu Vos ofereço o Corpo e o Sangue, a Alma e a Divindade de Vosso diletíssimo Filho, Nosso Senhor Jesus Cristo, em expiação dos nossos pecados e dos do mundo inteiro.\n\nNas dez contas pequenas:\nPela Sua dolorosa Paixão, tende misericórdia de nós e do mundo inteiro.\n\nAo final das cinco dezenas, três vezes:\nDeus Santo, Deus Forte, Deus Imortal, tende piedade de nós e do mundo inteiro.\n\nOração final:\nSangue e Água que jorrastes do Coração de Jesus como fonte de misericórdia para nós, eu confio em Vós.\n\nJesus, eu confio em Vós.\n\nAmém.'
  },
  teDeum: {
    name: 'Te Deum',
    category: 'daily',
    text: 'A vós, ó Deus, louvamos;\na vós, Senhor, confessamos.\nA vós, Pai eterno,\nvenera toda a terra.\n\nA vós todos os anjos,\na vós os céus e todas as potestades,\na vós os querubins e os serafins\nproclamam sem cessar:\n\nSanto, Santo, Santo,\nSenhor Deus dos exércitos.\nOs céus e a terra estão cheios\nda majestade da vossa glória.\n\nA vós louva o glorioso coro dos apóstolos,\na vós a venerável multidão dos profetas,\na vós o exército resplandecente dos mártires.\n\nA vós, por toda a terra,\nconfessa a santa Igreja:\nPai de imensa majestade;\nvosso adorável, verdadeiro e único Filho;\ne também o Espírito Santo Paráclito.\n\nVós sois o Rei da glória, ó Cristo.\nVós sois o Filho eterno do Pai.\n\nVós, para libertar o homem que havíeis de assumir,\nnão desdenhastes o seio da Virgem.\nVós, vencido o aguilhão da morte,\nabristes aos que creem o reino dos céus.\nVós estais sentado à direita de Deus,\nna glória do Pai.\nCremos que haveis de vir como juiz.\n\nPor isso vos pedimos:\nsocorrei os vossos servos,\nque remistes com o vosso precioso sangue.\nFazei que sejam contados\nentre os vossos santos, na glória eterna.\n\nV. Salvai o vosso povo, Senhor,\ne abençoai a vossa herança.\nR. Governai-os e exaltai-os para sempre.\n\nV. Todos os dias vos bendizemos.\nR. E louvamos o vosso nome\npelos séculos, pelos séculos dos séculos.\n\nV. Dignai-vos, Senhor,\nguardar-nos neste dia sem pecado.\nR. Tende piedade de nós, Senhor,\ntende piedade de nós.\n\nV. Desça sobre nós, Senhor, a vossa misericórdia,\nassim como em vós esperamos.\nR. Em vós, Senhor, esperei:\nnão serei confundido para sempre.\n\nAmém.'
  },
  eternalRest: {
    name: 'Eterno descanso',
    category: 'daily',
    text: 'Eterno descanso dai-lhes, Senhor,\ne a luz perpétua os ilumine.\nDescansem em paz.\n\nAmém.'
  }
} as const satisfies Record<
  string,
  {
    readonly name: string
    readonly category: PrayerCategory
    readonly text: string
  }
>

export type PrayerKey = keyof typeof PRAYERS

export const PRAYER_ORDER = keysOf(PRAYERS)
