export type Posture = 'standing' | 'sitting' | 'kneeling'

export const POSTURE_LABEL = {
  standing: 'De pé',
  sitting: 'Sentado',
  kneeling: 'De joelhos'
} as const satisfies Record<Posture, string>

export interface MassCitation {
  source: string
  note: string
}

export interface MassStep {
  id: string
  title: string
  happens: string
  meaning: string
  faithful: string
  posture: Posture
  response: string
  citation?: MassCitation
}

export interface MassPart {
  id: string
  title: string
  shortTitle: string
  summary: string
  steps: readonly [MassStep, ...MassStep[]]
}

export interface QuizChoice {
  id: string
  label: string
}

export interface QuizQuestion<ChoiceId extends string = string> {
  id: string
  prompt: string
  choices: readonly { id: ChoiceId; label: string }[]
  correctChoiceId: ChoiceId
}

const quizQuestion = <const ChoiceId extends string>(
  question: QuizQuestion<ChoiceId>
) => question

export const MASS_PARTS = [
  {
    id: 'introductory',
    title: 'Ritos iniciais',
    shortTitle: 'Início',
    summary:
      'A assembleia se reúne, pede perdão e se prepara para ouvir a Palavra e celebrar a Eucaristia.',
    steps: [
      {
        id: 'entrance',
        title: 'Canto de entrada',
        happens:
          'Enquanto o sacerdote e os ministros entram, a assembleia canta. O canto acompanha a procissão até o altar. Chegando, o sacerdote inclina-se, beija o altar e, se for o caso, incensa a cruz e o altar.',
        meaning:
          'Não é música de fundo. É a primeira oração da Missa: um povo só começa a caminhar junto, atrás da cruz. O altar é reverenciado porque representa Cristo.',
        faithful:
          'Fique de pé desde a entrada do sacerdote. Cante com a assembleia. Se não houver canto, escute a antífona de entrada.',
        posture: 'standing',
        response:
          'Não há uma frase fixa. A voz da assembleia, nesse momento, é o próprio canto.',
        citation: {
          source: 'Instrução Geral do Missal Romano, n. 27',
          note: 'Cristo está presente na assembleia, no ministro, na Palavra e, de modo substancial, na Eucaristia.'
        }
      },
      {
        id: 'sign-of-the-cross',
        title: 'Sinal da cruz',
        happens:
          'Todos de pé, o sacerdote diz: «Em nome do Pai e do Filho e do Espírito Santo», e a assembleia faz o sinal da cruz consigo.',
        meaning:
          'A Missa começa em nome da Trindade, não em nome próprio. A cruz recorda o Batismo e o amor de Jesus que nos salvou.',
        faithful:
          'De pé, trace a cruz com atenção: da testa ao peito, do ombro esquerdo ao direito.',
        posture: 'standing',
        response: 'Amém.',
        citation: {
          source: 'Mateus 28,19',
          note: 'O sinal da cruz usa a fórmula baptismal: Pai, Filho e Espírito Santo.'
        }
      },
      {
        id: 'greeting',
        title: 'Saudação',
        happens:
          'O sacerdote saúda o povo. A fórmula mais comum é «O Senhor esteja convosco». Pode usar também «A graça de nosso Senhor Jesus Cristo, o amor do Pai e a comunhão do Espírito Santo estejam convosco». A 3ª edição acrescentou: «A graça e a paz daquele que é, que era e que vem, estejam convosco».',
        meaning:
          'No latim, o povo responde «Et cum spiritu tuo» — «e com o teu espírito» —, desejando que a graça acompanhe também o ministério do sacerdote. A tradução aprovada no Brasil, no Missal Romano da CNBB, conserva outra resposta: a assembleia reconhece o Senhor presente no meio dela. Às saudações que anunciam a graça e a paz, a resposta é um bendito.',
        faithful: 'De pé, responda em voz alta, junto com todos.',
        posture: 'standing',
        response:
          'A «O Senhor esteja convosco»: «Ele está no meio de nós.» À saudação da graça e da paz, inclusive «A graça e a paz daquele que é, que era e que vem, estejam convosco»: «Bendito seja Deus, que nos reuniu no amor de Cristo.»',
        citation: {
          source: 'Mateus 18,20; Apocalipse 1,4',
          note: 'O Senhor está no meio dos que se reúnem em seu nome; a saudação nova ecoa «aquele que é, que era e que vem».'
        }
      },
      {
        id: 'penitential-act',
        title: 'Ato penitencial',
        happens:
          'O sacerdote convida: «Irmãos e irmãs, reconheçamos os nossos pecados, para celebrarmos dignamente os santos mistérios.» Há um breve silêncio. Na forma mais usada, todos rezam o Confesso. Na 3ª edição, o texto diz «irmãos e irmãs» e repete a culpa três vezes, como no latim. O sacerdote pede então a misericórdia de Deus. Há outras fórmulas, com o mesmo sentido.',
        meaning:
          'Ainda não é a confissão sacramental. É um passo de humildade: chegamos como pecadores que confiam no perdão e pedem a oração de Maria, dos anjos, dos santos e uns dos outros.',
        faithful:
          'De pé. No silêncio, reconheça o que precisa de perdão. No Confesso, bata de leve no peito a cada «minha culpa».',
        posture: 'standing',
        response:
          '«Confesso a Deus todo-poderoso e a vós, irmãos e irmãs, que pequei muitas vezes por pensamentos e palavras, atos e omissões, por minha culpa, minha culpa, minha tão grande culpa. E peço à Virgem Maria, aos Anjos e Santos e a vós, irmãos e irmãs, que rogueis por mim a Deus, nosso Senhor.» Depois: «Amém.» Na segunda fórmula, as respostas são «Porque somos pecadores» e «E dai-nos a vossa salvação».',
        citation: {
          source: '1 João 1,8-9',
          note: 'Se reconhecemos os pecados, Deus é fiel para nos perdoar.'
        }
      },
      {
        id: 'kyrie',
        title: 'Kyrie',
        happens:
          'A assembleia aclama «Senhor, tende piedade de nós» e «Cristo, tende piedade de nós», em português ou em grego («Kyrie, eleison», «Christe, eleison»). Se o ato penitencial já usou essas invocações, o Kyrie não se repete.',
        meaning:
          'É um dos gritos mais antigos da oração cristã. Não é só pedido de desculpa: é chamar Cristo de Senhor, aquele que se compadece.',
        faithful: 'De pé, repita cada invocação. Cante, se houver canto.',
        posture: 'standing',
        response:
          '«Senhor, tende piedade de nós. Cristo, tende piedade de nós. Senhor, tende piedade de nós.»',
        citation: {
          source: 'Mateus 20,30-31',
          note: 'Os cegos de Jericó gritam a Jesus: «Senhor, tem compaixão de nós.»'
        }
      },
      {
        id: 'gloria',
        title: 'Glória',
        happens:
          'Aos domingos fora do Advento e da Quaresma, e nas festas e solenidades, canta-se ou recita-se o hino de louvor. Ele começa com as palavras dos anjos em Belém. No Advento e na Quaresma, o Glória não entra na Missa do domingo.',
        meaning:
          'Depois de pedir piedade, a Igreja louva o Pai, o Cordeiro que tira o pecado do mundo e o Espírito Santo. É um hino antigo, não um canto qualquer.',
        faithful:
          'De pé, cante ou recite com a assembleia. Se nesse domingo o Glória não estiver previsto, permaneça de pé até a oração.',
        posture: 'standing',
        response:
          'O hino começa: «Glória a Deus nas alturas e paz na terra aos homens por ele amados.» A assembleia o reza por inteiro e termina com «Amém».',
        citation: {
          source: 'Lucas 2,14',
          note: 'Os anjos anunciam glória a Deus e paz na terra.'
        }
      },
      {
        id: 'collect',
        title: 'Oração do dia',
        happens:
          'O sacerdote diz «Oremos». Todos ficam em silêncio por um instante. Ele proclama a oração coleta, própria daquele domingo, e a conclui em nome da Trindade. A 3ª edição tornou essas conclusões mais explícitas, conforme a oração se dirija ao Pai ou ao Filho.',
        meaning:
          'Chama-se coleta porque recolhe numa só oração o que a assembleia traz. Ela dá o tom da celebração daquele dia.',
        faithful:
          'De pé. Depois de «Oremos», apresente em silêncio a intenção que você trouxe. Ao fim, responda.',
        posture: 'standing',
        response: 'Amém.',
        citation: {
          source: 'Instrução Geral do Missal Romano, n. 54',
          note: 'O Amém faz da oração do sacerdote a oração de toda a assembleia.'
        }
      }
    ]
  },
  {
    id: 'word',
    title: 'Liturgia da Palavra',
    shortTitle: 'Palavra',
    summary:
      'Deus fala ao seu povo. A assembleia escuta, responde e acolhe Cristo, sobretudo no Evangelho.',
    steps: [
      {
        id: 'first-reading',
        title: 'Primeira leitura',
        happens:
          'Um leitor proclama a primeira leitura no ambão. Aos domingos, em geral, ela vem do Antigo Testamento. No Tempo Pascal, costuma ser dos Atos dos Apóstolos. O leitor termina: «Palavra do Senhor».',
        meaning:
          'Deus preparou a vinda de Cristo ao longo da história. Escutar já é participar: a Palavra é dirigida a você hoje.',
        faithful:
          'Sente-se. Acompanhe em silêncio, sem conversar. Pode seguir no folheto.',
        posture: 'sitting',
        response: 'Graças a Deus.',
        citation: {
          source: '1 Tessalonicenses 2,13',
          note: 'A Palavra que recebemos é de Deus, e ela age em quem crê.'
        }
      },
      {
        id: 'responsorial-psalm',
        title: 'Salmo responsorial',
        happens:
          'O salmista ou o cantor propõe um refrão, e a assembleia o repete. Os versos, tirados dos Salmos, são cantados ou lidos entre um refrão e outro.',
        meaning:
          'O salmo não é um intervalo. É a resposta da assembleia à leitura, com palavras da própria Escritura. A Igreja reza os Salmos desde o começo.',
        faithful:
          'Sentado, escute os versos e entre no refrão cada vez que ele voltar.',
        posture: 'sitting',
        response:
          'O refrão próprio daquele domingo. Não existe uma frase única para todos os dias.',
        citation: {
          source: 'Catecismo da Igreja Católica, n. 2588',
          note: 'Os Salmos são palavra de Deus que se torna oração do povo.'
        }
      },
      {
        id: 'second-reading',
        title: 'Segunda leitura',
        happens:
          'Aos domingos e nas solenidades há uma segunda leitura, quase sempre de uma carta dos apóstolos ou do Apocalipse. O leitor conclui de novo: «Palavra do Senhor».',
        meaning:
          'Os apóstolos mostram como o mistério de Cristo toma conta da vida da Igreja. Essa leitura segue o seu próprio ciclo: nem sempre comenta a mesma cena do Evangelho, mas ilumina a fé.',
        faithful: 'Permaneça sentado e escute até o fim.',
        posture: 'sitting',
        response: 'Graças a Deus.',
        citation: {
          source: 'Catecismo da Igreja Católica, n. 1349',
          note: 'A Liturgia da Palavra reúne os profetas, as cartas dos apóstolos e os Evangelhos.'
        }
      },
      {
        id: 'gospel-acclamation',
        title: 'Aclamação ao Evangelho',
        happens:
          'A assembleia se levanta. Fora da Quaresma, canta o Aleluia, com um versículo no meio. Na Quaresma o Aleluia não é cantado: usa-se outra aclamação a Cristo, indicada no folheto.',
        meaning:
          'Aleluia quer dizer «louvai o Senhor». De pé, a Igreja saúda Cristo, que vai falar. O respeito é com a pessoa de Jesus, não só com um livro.',
        faithful:
          'Levante-se quando a aclamação começar. Cante o Aleluia, ou a aclamação da Quaresma, antes e depois do versículo.',
        posture: 'standing',
        response:
          '«Aleluia.» Na Quaresma, a aclamação daquele dia, sem a palavra Aleluia.',
        citation: {
          source: 'Apocalipse 19,1',
          note: 'O Aleluia é o louvor da assembleia diante do que Deus fez.'
        }
      },
      {
        id: 'gospel',
        title: 'Evangelho',
        happens:
          'O diácono ou o sacerdote saúda o povo, anuncia «Proclamação do Evangelho de Jesus Cristo, segundo N.» e traça a cruz sobre o livro, a testa, a boca e o peito. Proclama o texto de Mateus, Marcos, Lucas ou João. Ao fim diz: «Palavra da Salvação».',
        meaning:
          'Entre as leituras, o Evangelho tem o lugar mais alto, porque nele a Igreja escuta o próprio Cristo. Por isso só o diácono ou o sacerdote o proclama, e todos ficam de pé.',
        faithful:
          'De pé. No anúncio, faça um pequeno sinal da cruz na testa, na boca e no peito: a Palavra na mente, nos lábios e no coração.',
        posture: 'standing',
        response:
          'A «O Senhor esteja convosco»: «Ele está no meio de nós.» Ao anúncio do Evangelho: «Glória a vós, Senhor.» A «Palavra da Salvação»: «Glória a vós, Senhor.»',
        citation: {
          source: 'Instrução Geral do Missal Romano, n. 60',
          note: 'A proclamação do Evangelho é o ponto alto da Liturgia da Palavra.'
        }
      },
      {
        id: 'homily',
        title: 'Homilia',
        happens:
          'O sacerdote ou o diácono explica as leituras e o mistério celebrado, ligando a Escritura à vida da comunidade. Aos domingos e festas de preceito, a homilia é obrigatória. Pode seguir um breve silêncio.',
        meaning:
          'A homilia não é uma palestra solta. Ela parte da Palavra que acabou de ser proclamada e ajuda a assembleia a crer e a celebrar a Eucaristia com consciência.',
        faithful:
          'Sente-se e escute. Guarde uma frase para a semana. O silêncio depois também faz parte da escuta.',
        posture: 'sitting',
        response: 'Não há uma resposta prescrita. A resposta é escutar.',
        citation: {
          source: 'Sacrosanctum Concilium, n. 52',
          note: 'A homilia faz parte da própria liturgia e não deve faltar nos domingos.'
        }
      },
      {
        id: 'creed',
        title: 'Profissão de fé',
        happens:
          'Aos domingos e nas solenidades, a assembleia reza o Creio: o Símbolo niceno-constantinopolitano ou o Símbolo dos Apóstolos. Às palavras da encarnação, todos se inclinam. No Natal e na Anunciação, ajoelham-se nesse trecho.',
        meaning:
          'Depois de ouvir a Palavra, a Igreja responde: é nisto que cremos. O Creio é a fé da Igreja inteira. A inclinação honra o Filho de Deus que se fez homem.',
        faithful:
          'De pé, reze em voz alta. Incline-se no niceno em «e se encarnou pelo Espírito Santo… e se fez homem»; no dos Apóstolos, de «foi concebido» até «nasceu da Virgem Maria».',
        posture: 'standing',
        response:
          'A assembleia reza o Creio por inteiro, começando por «Creio em um só Deus» ou «Creio em Deus Pai todo-poderoso», e termina com «Amém».',
        citation: {
          source: 'Catecismo da Igreja Católica, n. 185-197',
          note: 'O Símbolo é o selo da fé que a Igreja professa junta.'
        }
      },
      {
        id: 'prayer-of-the-faithful',
        title: 'Oração dos fiéis',
        happens:
          'O sacerdote introduz a oração universal. Um ministro anuncia as intenções: em geral, pela Igreja, por quem governa, por quem sofre, pela comunidade e pelos falecidos. A assembleia responde a cada uma. O sacerdote conclui com uma oração.',
        meaning:
          'Pelo Batismo, a assembleia intercede pelo mundo inteiro. As preces alargam a Missa para além de quem está no banco.',
        faithful:
          'De pé. Responda a cada intenção com a frase daquele dia e, em silêncio, una os nomes que traz no coração.',
        posture: 'standing',
        response:
          'Muitas vezes: «Senhor, escutai a nossa prece.» A frase pode mudar conforme a celebração. À oração final do sacerdote: «Amém.»',
        citation: {
          source: '1 Timóteo 2,1-2',
          note: 'Paulo pede súplicas por todas as pessoas e por quem tem autoridade.'
        }
      }
    ]
  },
  {
    id: 'eucharistic',
    title: 'Liturgia eucarística',
    shortTitle: 'Eucaristia',
    summary:
      'O pão e o vinho são apresentados, e a Igreja entra, pela oração eucarística, no sacrifício de Cristo.',
    steps: [
      {
        id: 'presentation',
        title: 'Apresentação das oferendas',
        happens:
          'A assembleia senta-se. Podem-se trazer o pão, o vinho e donativos para os pobres. O sacerdote apresenta o pão e o vinho. Se disser em voz alta «Bendito sejais, Senhor, Deus do universo…», o povo aclama. Mistura-se um pouco de água ao vinho. Ele pode incensar as oferendas e o povo, e lava as mãos.',
        meaning:
          'O pão e o vinho são fruto da terra e do trabalho. Neles colocamos a vida, para que seja unida à oferta de Cristo. A água no vinho lembra a nossa humanidade unida à divindade de Jesus.',
        faithful:
          'Sentado, acompanhe o canto. Se passar a coleta, participe como puder. Levante-se quando o sacerdote disser «Orai, irmãos e irmãs».',
        posture: 'sitting',
        response:
          'Se as fórmulas forem ditas em voz alta, depois do pão e depois do vinho: «Bendito seja Deus para sempre.»',
        citation: {
          source: 'Catecismo da Igreja Católica, n. 1350-1351',
          note: 'Com o pão e o vinho, os cristãos trazem também o que partilham com quem precisa.'
        }
      },
      {
        id: 'prayer-over-the-offerings',
        title: 'Oração sobre as oferendas',
        happens:
          'O sacerdote, no meio do altar, diz: «Orai, irmãos e irmãs, para que o meu e o vosso sacrifício seja aceito por Deus Pai todo-poderoso.» A assembleia se levanta e responde. Ele proclama a oração sobre as oferendas, própria do dia.',
        meaning:
          'O sacrifício é de Cristo e da Igreja toda: «o meu e o vosso». Pedimos ao Pai que aceite a oferta que a oração eucarística vai transformar.',
        faithful: 'De pé, responda ao convite e confirme a oração.',
        posture: 'standing',
        response:
          '«Receba o Senhor por tuas mãos este sacrifício, para glória do seu nome, para nosso bem e de toda a sua santa Igreja.» Ao fim da oração: «Amém.»',
        citation: {
          source: 'Missal Romano, 3ª edição',
          note: 'A resposta fala ao sacerdote sobre o sacrifício, e por isso diz «Receba o Senhor», não «Receba, ó Senhor».'
        }
      },
      {
        id: 'preface',
        title: 'Prefácio',
        happens:
          'Começa a Oração Eucarística, centro da Missa. O sacerdote dialoga com a assembleia e proclama o prefácio, ação de graças própria do tempo ou da festa. A 3ª edição acrescentou novos prefácios. O texto termina convocando os anjos e os santos para o Santo.',
        meaning:
          'Eucaristia quer dizer ação de graças. Antes de pedir, a Igreja agradece ao Pai por Cristo. «Corações ao alto» convida a deixar a distração e voltar-se para Deus.',
        faithful:
          'De pé. Responda às três frases do diálogo e escute o prefácio como quem dá graças.',
        posture: 'standing',
        response:
          '«O Senhor esteja convosco» — «Ele está no meio de nós.» «Corações ao alto» — «O nosso coração está em Deus.» «Demos graças ao Senhor, nosso Deus» — «É nosso dever e nossa salvação.»',
        citation: {
          source: 'Catecismo da Igreja Católica, n. 1328',
          note: 'A Missa se chama Eucaristia porque é ação de graças a Deus.'
        }
      },
      {
        id: 'sanctus',
        title: 'Santo',
        happens:
          'Sacerdote e assembleia cantam ou recitam o Santo. Em seguida, o costume no Brasil é ajoelhar-se para a consagração.',
        meaning:
          'O canto une a visão de Isaías no templo e a aclamação de quem recebeu Jesus em Jerusalém. Céu e terra louvam juntos.',
        faithful:
          'De pé, cante o Santo inteiro. Ao acabar, ajoelhe-se, se puder, para o que vem.',
        posture: 'standing',
        response:
          '«Santo, Santo, Santo, Senhor, Deus do universo. O céu e a terra proclamam a vossa glória. Hosana nas alturas. Bendito o que vem em nome do Senhor. Hosana nas alturas.»',
        citation: {
          source: 'Isaías 6,3; Mateus 21,9',
          note: '«Santo, Santo, Santo» vem do templo; «Bendito o que vem» saúda o Messias.'
        }
      },
      {
        id: 'epiclesis',
        title: 'Epiclese',
        happens:
          'O sacerdote estende as mãos sobre o pão e o vinho e pede ao Pai que envie o Espírito Santo, para que os dons se tornem o Corpo e o Sangue de Cristo. Em algumas orações há também o pedido de que a assembleia se torne um só corpo.',
        meaning:
          'A Igreja não produz o sacramento por técnica. Ela suplica. O mesmo Espírito que desceu sobre Maria é invocado sobre as oferendas e sobre nós.',
        faithful:
          'De joelhos, se a saúde e o espaço permitirem. Quem não se ajoelha fica de pé, com reverência, e se inclina quando o sacerdote genuflete na consagração.',
        posture: 'kneeling',
        response:
          'Na maior parte das Orações Eucarísticas, a assembleia fica em silêncio. Em algumas, repete a aclamação proposta, por exemplo «Mandai vosso Espírito Santo».',
        citation: {
          source: 'Catecismo da Igreja Católica, n. 1353',
          note: 'Na epiclese a Igreja pede o Espírito para que os dons se tornem o Corpo e o Sangue de Cristo.'
        }
      },
      {
        id: 'consecration',
        title: 'Consagração',
        happens:
          'O sacerdote narra a última Ceia e pronuncia as palavras de Jesus sobre o pão e sobre o vinho: «Tomai, todos, e comei: isto é o meu Corpo, que será entregue por vós» e «Tomai, todos, e bebei: este é o cálice do meu Sangue, o Sangue da nova e eterna aliança, que será derramado por vós e por todos para remissão dos pecados. Fazei isto em memória de mim.» Mostra a hóstia e o cálice e genuflete.',
        meaning:
          'A Igreja crê que o pão e o vinho se tornam o Corpo e o Sangue de Cristo, entregues por nós. Não é um símbolo vazio: é o próprio Jesus, presente de verdade.',
        faithful:
          'De joelhos, olhe a hóstia e o cálice quando forem mostrados. Quem não puder ajoelhar faz uma inclinação profunda quando o sacerdote genuflete. «Senhor meu e meu Deus» é oração pessoal, em silêncio: o Missal não pede uma resposta em voz alta.',
        posture: 'kneeling',
        response:
          'Não há resposta em voz alta. O gesto da assembleia é adorar.',
        citation: {
          source: 'Lucas 22,19-20',
          note: 'Jesus, na ceia, entrega o seu corpo e o seu sangue e manda fazer isto em sua memória.'
        }
      },
      {
        id: 'mystery-of-faith',
        title: 'Mistério da fé',
        happens:
          'O sacerdote convida a assembleia. Na 3ª edição, o convite pode ser «Mistério da fé», «Mistério da fé e do amor» ou «Mistério da fé para a salvação do mundo». O povo aclama. A oração segue, com a oferta do sacrifício e a intercessão pela Igreja, pelos vivos e pelos falecidos. As Orações II, III e IV nomeiam também São José.',
        meaning:
          'A Missa é memorial: torna presente o sacrifício da cruz e anuncia que Cristo voltará. A aclamação é a fé da assembleia no meio da oração do sacerdote.',
        faithful:
          'De joelhos, responda com a aclamação que a comunidade estiver rezando ou cantando. Há três textos no Missal.',
        posture: 'kneeling',
        response:
          '«Anunciamos, Senhor, a vossa morte e proclamamos a vossa ressurreição. Vinde, Senhor Jesus!» Ou: «Todas as vezes que comemos deste pão e bebemos deste cálice, anunciamos, Senhor, a vossa morte, enquanto esperamos a vossa vinda!» Ou: «Salvador do mundo, salvai-nos, vós que nos libertastes pela cruz e ressurreição.»',
        citation: {
          source: '1 Coríntios 11,26',
          note: 'Todas as vezes que se come deste pão e se bebe deste cálice, anuncia-se a morte do Senhor até que ele venha.'
        }
      },
      {
        id: 'doxology',
        title: 'Doxologia',
        happens:
          'O sacerdote eleva juntos o Corpo e o Sangue de Cristo e proclama: «Por Cristo, com Cristo, em Cristo, a vós, Deus Pai todo-poderoso, na unidade do Espírito Santo, toda a honra e toda a glória, agora e para sempre.» A assembleia conclui a oração inteira.',
        meaning:
          'Todo o louvor sobe ao Pai por Cristo, com ele e nele. Esse Amém não é um detalhe: a assembleia assume como sua a Oração Eucarística. Por isso se chama o grande Amém.',
        faithful:
          'De joelhos até o Amém, se esse for o costume da comunidade. Responda com firmeza, de preferência cantando. Depois, levante-se para o Pai-Nosso.',
        posture: 'kneeling',
        response: 'Amém.',
        citation: {
          source: 'Instrução Geral do Missal Romano, n. 79',
          note: 'A doxologia encerra a Oração Eucarística, e o Amém da assembleia a confirma.'
        }
      }
    ]
  },
  {
    id: 'communion',
    title: 'Rito da comunhão',
    shortTitle: 'Comunhão',
    summary:
      'A assembleia reza com as palavras de Jesus, pede a paz, parte o pão e recebe o Corpo de Cristo.',
    steps: [
      {
        id: 'our-father',
        title: 'Pai-Nosso',
        happens:
          'O sacerdote convida a rezar a oração do Senhor. Uma fórmula da 3ª edição é: «Guiados pelo Espírito Santo, que ora em nós e por nós, elevemos as mãos ao Pai e rezemos juntos a oração que o próprio Jesus nos ensinou.» Todos rezam o Pai-Nosso. Ele continua sozinho e, na 3ª edição, o embolismo termina em «enquanto aguardamos a feliz esperança e a vinda do Nosso Salvador, Jesus Cristo».',
        meaning:
          'Rezamos com as palavras de Jesus pouco antes de receber o Pão da vida. Pedimos o pão, o perdão e a libertação do mal. O embolismo desenvolve esse último pedido.',
        faithful:
          'De pé, reze o Pai-Nosso inteiro. O Missal não manda dar as mãos. Quando o convite diz «elevemos as mãos», pode-se erguê-las. O que importa é rezar juntos.',
        posture: 'standing',
        response:
          'O Pai-Nosso, e depois do embolismo: «Vosso é o reino, o poder e a glória para sempre.»',
        citation: {
          source: 'Mateus 6,9-13',
          note: 'Jesus entrega aos discípulos a oração do Pai-Nosso.'
        }
      },
      {
        id: 'peace',
        title: 'Rito da paz',
        happens:
          'O sacerdote pede a Cristo a paz e a unidade da Igreja. Depois diz: «A paz do Senhor esteja sempre convosco.» A assembleia responde. Se for oportuno, ele ou o diácono convida: «Irmãos e irmãs, saudai-vos em Cristo Jesus.» Cada um oferece a paz a quem está perto.',
        meaning:
          'Antes de partir o pão, a Igreja pede paz e se reconcilia. Não é hora de conversar: é o sinal do perdão que o Pai-Nosso acabou de pedir.',
        faithful:
          'De pé. Responda primeiro. Depois cumprimente poucas pessoas ao redor, com brevidade, e volte o olhar ao altar.',
        posture: 'standing',
        response: '«O amor de Cristo nos uniu.»',
        citation: {
          source: 'João 14,27',
          note: 'Jesus diz: «Deixo-vos a paz, a minha paz vos dou.»'
        }
      },
      {
        id: 'fraction',
        title: 'Fração do pão',
        happens:
          'O sacerdote parte a hóstia e coloca um fragmento no cálice, sinal da unidade do Corpo e do Sangue do Senhor. Enquanto isso, canta-se ou reza-se o Cordeiro de Deus. Se a fração demorar, a invocação se repete; a última vez termina com «dai-nos a paz».',
        meaning:
          'Partir o pão é um dos nomes antigos da Eucaristia. O Cordeiro é Jesus, aquele que João Batista apontou. Pedimos piedade e paz antes de nos aproximar.',
        faithful: 'De pé, cante ou reze olhando para o altar.',
        posture: 'standing',
        response:
          '«Cordeiro de Deus, que tirais o pecado do mundo, tende piedade de nós.» Na última vez: «Cordeiro de Deus, que tirais o pecado do mundo, dai-nos a paz.»',
        citation: {
          source: 'João 1,29',
          note: 'João Batista aponta Jesus: «Eis o Cordeiro de Deus, que tira o pecado do mundo.»'
        }
      },
      {
        id: 'communion',
        title: 'Comunhão',
        happens:
          'O sacerdote mostra a hóstia e diz «Felizes os convidados para a Ceia do Senhor» ou «Eis o Cordeiro de Deus, que tira o pecado do mundo». A assembleia responde com ele. Em procissão, cada pessoa se aproxima. O ministro diz «O Corpo de Cristo» e, quando for o caso, «O Sangue de Cristo». Seguem o canto e um silêncio de ação de graças.',
        meaning:
          'Comungar é receber o próprio Cristo. A Igreja pede a graça de Deus, o jejum eucarístico de ao menos uma hora e, se houver pecado grave, a confissão antes. Quem não comunga pode fazer uma comunhão espiritual, pedindo que Jesus venha ao coração.',
        faithful:
          'De pé na procissão. Responda antes de receber. Se receber na mão, consuma a hóstia diante do ministro. De volta ao lugar, sente-se ou ajoelhe-se para agradecer em silêncio.',
        posture: 'standing',
        response:
          '«Senhor, eu não sou digno de que entreis em minha morada, mas dizei uma palavra e serei salvo.» Quem reza no feminino diz «digna» e «salva». Diante do ministro: «Amém.»',
        citation: {
          source: 'Mateus 8,8; Código de Direito Canônico, cân. 919',
          note: 'A frase vem do centurião. O jejum eucarístico é de uma hora antes da Comunhão.'
        }
      },
      {
        id: 'prayer-after-communion',
        title: 'Oração depois da comunhão',
        happens:
          'Terminado o silêncio ou o canto, o sacerdote diz «Oremos». Quem estava sentado se levanta. Ele proclama a oração depois da comunhão, pedindo que o sacramento dê fruto.',
        meaning:
          'A Missa não acaba na fila da comunhão. Esta oração pede que o que recebemos apareça em casa, no trabalho e no cuidado com os outros.',
        faithful: 'De pé. Escute a oração como quem aceita uma missão.',
        posture: 'standing',
        response: 'Amém.',
        citation: {
          source: 'Instrução Geral do Missal Romano, n. 89',
          note: 'A oração depois da Comunhão pede os frutos do mistério celebrado.'
        }
      }
    ]
  },
  {
    id: 'concluding',
    title: 'Ritos finais',
    shortTitle: 'Envio',
    summary:
      'A assembleia recebe a bênção e é enviada a viver, na semana, o que celebrou.',
    steps: [
      {
        id: 'announcements',
        title: 'Avisos',
        happens:
          'Se forem necessários, o sacerdote ou um ministro faz comunicações breves: encontros, caridade, horários. Não são parte do sacramento. Em muitas Missas não há avisos, e a celebração segue direto para a bênção.',
        meaning:
          'A comunidade lembra que a fé continua na semana. Convém que os avisos sejam curtos, para não apagar o que a Missa acabou de dar.',
        faithful:
          'Fique de pé e escute o que diz respeito à comunidade, sem começar a conversa: a bênção vem em seguida.',
        posture: 'standing',
        response: 'Não há resposta ritual. Em seguida vem a bênção.',
        citation: {
          source: 'Instrução Geral do Missal Romano, n. 90',
          note: 'Os ritos finais reúnem, se preciso, os avisos, a saudação, a bênção e a despedida.'
        }
      },
      {
        id: 'blessing',
        title: 'Bênção',
        happens:
          'O sacerdote saúda de novo: «O Senhor esteja convosco.» Em certos dias pede que a assembleia incline a cabeça para uma oração sobre o povo, ou usa uma bênção solene. Depois traça a cruz: «Abençoe-vos Deus todo-poderoso, Pai e Filho e Espírito Santo.»',
        meaning:
          'A bênção não é um gesto automático de encerramento. Deus envia a assembleia com a sua graça, em nome da Trindade.',
        faithful:
          'De pé. Responda à saudação. Se for convidado a inclinar a cabeça, incline. Durante a bênção, faça o sinal da cruz.',
        posture: 'standing',
        response: '«Ele está no meio de nós.» Depois da bênção: «Amém.»',
        citation: {
          source: 'Números 6,24-26',
          note: 'A bênção sacerdotal pede que o Senhor guarde o seu povo e lhe dê a paz.'
        }
      },
      {
        id: 'dismissal',
        title: 'Despedida',
        happens:
          'O diácono ou o sacerdote despede a assembleia. Uma fórmula do Missal é «Ide em paz, e o Senhor vos acompanhe». Outra, também usada, é «Ide em paz e glorificai o Senhor com vossa vida». O sacerdote beija o altar e a procissão sai. Pode haver um canto final.',
        meaning:
          'A palavra Missa guarda a ideia de envio. Não é só «pode ir embora». É levar para a casa, o trabalho e a cidade o Cristo que foi escutado e recebido.',
        faithful:
          'De pé, responda. Saia sem pressa atropelada, levando uma frase da Palavra.',
        posture: 'standing',
        response: 'Graças a Deus.',
        citation: {
          source: 'Mateus 28,19-20',
          note: 'O Ressuscitado envia os discípulos e promete estar com eles todos os dias.'
        }
      }
    ]
  }
] as const satisfies readonly MassPart[]

export type MassPartId = (typeof MASS_PARTS)[number]['id']

export type MassStepId = (typeof MASS_PARTS)[number]['steps'][number]['id']

export interface MassFlatStep {
  id: MassStepId
  title: string
  happens: string
  meaning: string
  faithful: string
  posture: Posture
  response: string
  citation?: MassCitation
  partId: MassPartId
  partTitle: string
}

export const MASS_STEPS: readonly MassFlatStep[] = MASS_PARTS.flatMap((part) =>
  part.steps.map(
    (step): MassFlatStep => ({
      id: step.id,
      title: step.title,
      happens: step.happens,
      meaning: step.meaning,
      faithful: step.faithful,
      posture: step.posture,
      response: step.response,
      citation: step.citation,
      partId: part.id,
      partTitle: part.title
    })
  )
)

export const MASS_QUIZ = [
  quizQuestion({
    id: 'greeting',
    prompt:
      'O sacerdote diz: «O Senhor esteja convosco.» O que a assembleia responde?',
    choices: [
      { id: 'among-us', label: 'Ele está no meio de nós.' },
      { id: 'thanks', label: 'Graças a Deus.' },
      { id: 'glory', label: 'Glória a vós, Senhor.' }
    ],
    correctChoiceId: 'among-us'
  }),
  quizQuestion({
    id: 'readings-posture',
    prompt:
      'Durante a primeira leitura, o salmo e a segunda leitura, a assembleia fica:',
    choices: [
      { id: 'sitting', label: 'Sentada' },
      { id: 'kneeling', label: 'De joelhos' },
      { id: 'standing', label: 'De pé o tempo todo' }
    ],
    correctChoiceId: 'sitting'
  }),
  quizQuestion({
    id: 'gospel-end',
    prompt:
      'No fim do Evangelho, o sacerdote diz «Palavra da Salvação». A assembleia responde:',
    choices: [
      { id: 'glory', label: 'Glória a vós, Senhor.' },
      { id: 'thanks', label: 'Graças a Deus.' },
      { id: 'amen', label: 'Amém.' }
    ],
    correctChoiceId: 'glory'
  }),
  quizQuestion({
    id: 'peace',
    prompt:
      'O sacerdote diz: «A paz do Senhor esteja sempre convosco.» Qual é a resposta do Missal no Brasil?',
    choices: [
      { id: 'love', label: 'O amor de Cristo nos uniu.' },
      { id: 'amen', label: 'Amém.' },
      { id: 'thanks', label: 'Graças a Deus.' }
    ],
    correctChoiceId: 'love'
  }),
  quizQuestion({
    id: 'communion-amen',
    prompt:
      'O ministro mostra a hóstia e diz «O Corpo de Cristo». Quem vai comungar responde:',
    choices: [
      { id: 'amen', label: 'Amém.' },
      { id: 'thanks', label: 'Graças a Deus.' },
      { id: 'worthy', label: 'Senhor, eu não sou digno.' }
    ],
    correctChoiceId: 'amen'
  })
] as const

export type MassQuizQuestion = (typeof MASS_QUIZ)[number]
