export interface Gospel {
  referencia: string
  titulo: string
  texto: string
}

export interface HomilyDiary {
  data: string
  liturgia: string
  cor: string
  oracoes: {
    coleta: string
    oferendas: string
    comunhao: string
    extras: string[]
  }
  leituras: {
    primeiraLeitura: { referencia: string; titulo: string; texto: string }[]
    segundaLeitura: { referencia: string; titulo: string; texto: string }[]
    salmo: { referencia: string; refrao: string; texto: string }[]
    evangelho: Gospel[]
    extras: string[]
  }
  antifonas: {
    entrada: string
    comunhao: string
  }
}
