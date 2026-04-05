export interface Gospel {
  title: string
  text: string
  reference: string
}
export interface Liturgy {
  date: string
  color: string
  liturgy: string
  gospel: Gospel[]
}

export interface LiturgyResponse {
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
    evangelho: {
      referencia: string
      titulo: string
      texto: string
    }[]
    extras: string[]
  }
  antifonas: {
    entrada: string
    comunhao: string
  }
}
