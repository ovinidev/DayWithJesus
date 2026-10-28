export interface Gospel {
  title: string
  text: string
  reference: string
}

export interface Psalm {
  refrain: string
  text: string
  reference: string
}

export interface LiturgyExtra {
  title?: string
  type?: string
  reference?: string
  text: string
}

export interface Liturgy {
  date: string
  color: string
  liturgy: string
  gospel: Gospel[]
  firstReadings: Gospel[]
  secondReadings: Gospel[]
  psalms: Psalm[]
  extraReadings: LiturgyExtra[]
  prayers: {
    collect: string
    offerings: string
    communion: string
    extras: LiturgyExtra[]
  }
  antiphons: {
    entrance: string
    communion: string
  }
}

export interface LiturgyResponse {
  data: string
  liturgia: string
  cor: string
  oracoes: {
    coleta: string
    oferendas: string
    comunhao: string
    extras: LiturgyExtraResponse[]
  }
  leituras: {
    primeiraLeitura: LiturgyReadingResponse[]
    segundaLeitura: LiturgyReadingResponse[]
    salmo: PsalmResponse[]
    evangelho: LiturgyReadingResponse[]
    extras: LiturgyExtraResponse[]
  }
  antifonas: {
    entrada: string
    comunhao: string
  }
}

export interface SaintOfDay {
  nome: string
  imagem: string | null
  historia: string | null
  reflexao: string | null
  oracao: string | null
  wikipediaUrl: string | null
  nascimento: string | null
  morte: string | null
  padroeiro: string | null
  grau: string | null
}

export interface SaintOfDayResponse {
  results: SaintOfDay[]
  liturgia: string
  completo: boolean
}

interface LiturgyReadingResponse {
  referencia: string
  titulo: string
  texto: string
}

interface PsalmResponse {
  referencia: string
  refrao: string
  texto: string
}

interface LiturgyExtraResponse {
  titulo?: string
  tipo?: string
  referencia?: string
  texto: string
}
