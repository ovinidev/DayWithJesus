import { describe, expect, it } from 'vitest'
import { MASS_PARTS, MASS_QUIZ, MASS_STEPS } from '@/constants/sundayMass'
import {
  initialMassGuide,
  partStartIndex,
  progressOf,
  quizIsComplete,
  reduceMassGuide,
  scoreQuiz,
  stepAt,
  swipeDirection
} from '@/utils/massGuide'

const expectedStepIds = [
  'entrance',
  'sign-of-the-cross',
  'greeting',
  'penitential-act',
  'kyrie',
  'gloria',
  'collect',
  'first-reading',
  'responsorial-psalm',
  'second-reading',
  'gospel-acclamation',
  'gospel',
  'homily',
  'creed',
  'prayer-of-the-faithful',
  'presentation',
  'prayer-over-the-offerings',
  'preface',
  'sanctus',
  'epiclesis',
  'consecration',
  'mystery-of-faith',
  'doxology',
  'our-father',
  'peace',
  'fraction',
  'communion',
  'prayer-after-communion',
  'announcements',
  'blessing',
  'dismissal'
] as const

const stepById = (id: (typeof expectedStepIds)[number]) => {
  const step = MASS_STEPS.find((item) => item.id === id)
  if (!step) throw new Error(`missing step ${id}`)
  return step
}

describe('Sunday Mass guide content', () => {
  it('follows the five parts of the Roman Missal in order', () => {
    expect(MASS_PARTS.map((part) => part.id)).toEqual([
      'introductory',
      'word',
      'eucharistic',
      'communion',
      'concluding'
    ])
    expect(MASS_STEPS.map((step) => step.id)).toEqual([...expectedStepIds])
  })

  it('uses the Brazilian 3rd-edition assembly responses', () => {
    expect(stepById('greeting').response).toContain('Ele está no meio de nós.')
    expect(stepById('greeting').response).not.toContain('E com o teu espírito')
    expect(stepById('greeting').meaning).toContain('Et cum spiritu tuo')
    expect(stepById('penitential-act').response).toContain(
      'por minha culpa, minha culpa, minha tão grande culpa'
    )
    expect(stepById('gospel').response).toContain('Glória a vós, Senhor.')
    expect(stepById('peace').response).toContain('O amor de Cristo nos uniu.')
    expect(stepById('our-father').happens).toContain('feliz esperança')
    expect(stepById('prayer-over-the-offerings').response).toContain(
      'de toda a sua santa Igreja'
    )
    expect(stepById('dismissal').response).toBe('Graças a Deus.')
  })
})

describe('mass guide navigation', () => {
  it('starts on the entrance chant', () => {
    const state = initialMassGuide()
    expect(stepAt(state.index)?.id).toBe('entrance')
    expect(progressOf(state)).toEqual({
      current: 1,
      total: expectedStepIds.length,
      ratio: 1 / expectedStepIds.length
    })
  })

  it('moves forward and does not move back past the first step', () => {
    const started = initialMassGuide()
    const next = reduceMassGuide(started, { type: 'next' })
    expect(next).toEqual({ kind: 'steps', index: 1 })
    expect(stepAt(1)?.title).toBe('Sinal da cruz')
    expect(reduceMassGuide(started, { type: 'previous' })).toEqual(started)
  })

  it('jumps to the first step of a part', () => {
    const state = reduceMassGuide(initialMassGuide(), {
      type: 'goToPart',
      partId: 'communion'
    })
    expect(state).toEqual({
      kind: 'steps',
      index: partStartIndex('communion')
    })
    expect(stepAt(partStartIndex('communion'))?.id).toBe('our-father')
    expect(stepAt(partStartIndex('concluding'))?.id).toBe('announcements')
  })

  it('opens the quiz after the dismissal and can return to it', () => {
    const last = {
      kind: 'steps' as const,
      index: expectedStepIds.length - 1
    }
    const quiz = reduceMassGuide(last, { type: 'next' })
    expect(quiz).toEqual({ kind: 'quiz', answers: {} })
    expect(progressOf(quiz).ratio).toBe(1)
    expect(reduceMassGuide(quiz, { type: 'previous' })).toEqual(last)
  })

  it('reads a horizontal swipe and ignores a short or vertical gesture', () => {
    expect(swipeDirection(-80, 10)).toBe('next')
    expect(swipeDirection(80, 4)).toBe('previous')
    expect(swipeDirection(-20, 0)).toBeNull()
    expect(swipeDirection(-40, 90)).toBeNull()
    expect(swipeDirection(60, 60)).toBeNull()
  })
})

describe('mass guide quiz', () => {
  const correctAnswers = Object.fromEntries(
    MASS_QUIZ.map((question) => [question.id, question.correctChoiceId])
  )

  it('scores only the Missal answer and ignores unknown choices', () => {
    const quiz = reduceMassGuide(
      { kind: 'quiz', answers: {} },
      { type: 'answer', questionId: 'greeting', choiceId: 'thanks' }
    )
    expect(scoreQuiz(quiz.kind === 'quiz' ? quiz.answers : {})).toEqual({
      correct: 0,
      total: MASS_QUIZ.length
    })
    const ignored = reduceMassGuide(
      { kind: 'quiz', answers: {} },
      { type: 'answer', questionId: 'greeting', choiceId: 'not-a-choice' }
    )
    expect(ignored).toEqual({ kind: 'quiz', answers: {} })
    expect(scoreQuiz(correctAnswers)).toEqual({
      correct: MASS_QUIZ.length,
      total: MASS_QUIZ.length
    })
  })

  it('stays on the quiz until every question has an answer', () => {
    const partial = { kind: 'quiz' as const, answers: { greeting: 'among-us' } }
    expect(quizIsComplete(partial.answers)).toBe(false)
    expect(reduceMassGuide(partial, { type: 'finishQuiz' })).toEqual(partial)
    const done = reduceMassGuide(
      { kind: 'quiz', answers: correctAnswers },
      { type: 'finishQuiz' }
    )
    expect(done.kind).toBe('result')
    expect(reduceMassGuide(done, { type: 'restart' })).toEqual(
      initialMassGuide()
    )
  })
})
