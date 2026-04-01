import { GoogleGenAI } from '@google/genai'

const PROMPT =
  'Resuma o evangelho do dia e me explique de maneira fácil e clara o que o evangelho nos trás e também quais os ensinamentos que devemos tirar do evangelo, não se extanda no texto, quero um texto curto para médio, mas que seja facil de ler, entender, compreender. O texto será plotado em string puro e exibindo no meu frontend vue, vá direto para o codigo, não precisa falar: aqui está o resultado..., nunca use ** pois o meu frontend apenas vai exibir o texto puro.'

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY
})

export const getGospelSummary = async (gospelText: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `${PROMPT}\n\nEvangelho:\n${gospelText}`
    })

    const candidates = response?.candidates
    if (!candidates || candidates.length === 0) {
      throw new Error('No candidates returned from AI model')
    }

    const parts = candidates[0]?.content?.parts
    if (!parts || parts.length === 0) {
      throw new Error('No content parts returned from AI model response')
    }

    const text = parts[0]?.text
    if (text === undefined) {
      throw new Error(
        'No text found in the first content part of AI model response'
      )
    }

    return text
  } catch (error: any) {
    if (error?.status === 429) {
      throw new Error('Limite de uso atingido')
    }

    throw new Error('Erro ao gerar resumo')
  }
}
