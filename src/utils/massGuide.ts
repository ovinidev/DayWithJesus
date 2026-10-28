import {
  MASS_QUIZ,
  MASS_STEPS,
  type MassFlatStep,
  type MassPartId
} from '@/constants/sundayMass'

export interface StepsPhase {
  kind: 'steps'
  index: number
}

export interface QuizPhase {
  kind: 'quiz'
  answers: Readonly<Record<string, string>>
}

export interface ResultPhase {
  kind: 'result'
  answers: Readonly<Record<string, string>>
}

export type MassGuideState = StepsPhase | QuizPhase | ResultPhase

export type MassGuideAction =
  | { type: 'next' }
  | { type: 'previous' }
  | { type: 'goToPart'; partId: MassPartId }
  | { type: 'answer'; questionId: string; choiceId: string }
  | { type: 'finishQuiz' }
  | { type: 'retryQuiz' }
  | { type: 'restart' }

export interface GuideProgress {
  current: number
  total: number
  ratio: number
}

export interface QuizScore {
  correct: number
  total: number
}

const SWIPE_THRESHOLD_PX = 48

export const initialMassGuide = (): StepsPhase => ({
  kind: 'steps',
  index: 0
})

export const partStartIndex = (partId: MassPartId): number => {
  const index = MASS_STEPS.findIndex((step) => step.partId === partId)
  return index < 0 ? 0 : index
}

export const stepAt = (index: number): MassFlatStep | null => {
  if (MASS_STEPS.length === 0) return null
  const last = MASS_STEPS.length - 1
  const safeIndex = Math.min(last, Math.max(0, index))
  return MASS_STEPS[safeIndex] ?? null
}

export const progressOf = (state: MassGuideState): GuideProgress => {
  const total = MASS_STEPS.length
  if (state.kind !== 'steps') {
    return { current: total, total, ratio: 1 }
  }
  const current = state.index + 1
  return { current, total, ratio: current / total }
}

export const quizIsComplete = (
  answers: Readonly<Record<string, string>>
): boolean => MASS_QUIZ.every((question) => answers[question.id] !== undefined)

export const scoreQuiz = (
  answers: Readonly<Record<string, string>>
): QuizScore => ({
  correct: MASS_QUIZ.filter(
    (question) => answers[question.id] === question.correctChoiceId
  ).length,
  total: MASS_QUIZ.length
})

export const swipeDirection = (
  deltaX: number,
  deltaY: number
): 'next' | 'previous' | null => {
  if (Math.abs(deltaX) < SWIPE_THRESHOLD_PX) return null
  if (Math.abs(deltaX) <= Math.abs(deltaY)) return null
  return deltaX < 0 ? 'next' : 'previous'
}

const answerQuestion = (
  state: QuizPhase,
  questionId: string,
  choiceId: string
): MassGuideState => {
  const question = MASS_QUIZ.find((item) => item.id === questionId)
  if (!question) return state
  const knownChoice = question.choices.some((choice) => choice.id === choiceId)
  if (!knownChoice) return state
  return {
    kind: 'quiz',
    answers: { ...state.answers, [question.id]: choiceId }
  }
}

export const reduceMassGuide = (
  state: MassGuideState,
  action: MassGuideAction
): MassGuideState => {
  switch (action.type) {
    case 'next':
      if (state.kind !== 'steps') return state
      if (state.index >= MASS_STEPS.length - 1) {
        return { kind: 'quiz', answers: {} }
      }
      return { kind: 'steps', index: state.index + 1 }
    case 'previous':
      if (state.kind === 'quiz') {
        return { kind: 'steps', index: MASS_STEPS.length - 1 }
      }
      if (state.kind !== 'steps') return state
      return { kind: 'steps', index: Math.max(0, state.index - 1) }
    case 'goToPart':
      return { kind: 'steps', index: partStartIndex(action.partId) }
    case 'answer':
      if (state.kind !== 'quiz') return state
      return answerQuestion(state, action.questionId, action.choiceId)
    case 'finishQuiz':
      if (state.kind !== 'quiz' || !quizIsComplete(state.answers)) return state
      return { kind: 'result', answers: state.answers }
    case 'retryQuiz':
      return { kind: 'quiz', answers: {} }
    case 'restart':
      return initialMassGuide()
    default: {
      const _exhaustive: never = action
      return _exhaustive
    }
  }
}
