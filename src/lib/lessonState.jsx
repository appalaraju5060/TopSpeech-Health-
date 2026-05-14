import { createContext, useContext, useMemo, useReducer } from 'react'
import { lesson } from './content.js'

const LessonContext = createContext(null)

const xpFor = (rating) =>
  rating === 'nailed' ? 12 : rating === 'almost' ? 8 : 5

const initialState = {
  phase: 'start',          // 'start' | 'breathing' | 'card' | 'complete'
  cardIndex: 0,
  ratings: [],             // [{ cardId, rating, payload? }]
  xp: 0,
  streak: 7,               // mocked baseline so the end screen has a number
  totalCards: lesson.cards.length
}

function reducer(state, action) {
  switch (action.type) {
    case 'BEGIN':
      return { ...state, phase: 'breathing' }
    case 'SKIP_BREATH':
    case 'BREATH_DONE':
      return { ...state, phase: 'card', cardIndex: 0 }
    case 'COMPLETE_CARD': {
      const { cardId, rating, payload } = action
      const ratings = [...state.ratings, { cardId, rating, payload }]
      const gained = xpFor(rating)
      const nextIndex = state.cardIndex + 1
      const isLast = nextIndex >= state.totalCards
      return {
        ...state,
        ratings,
        xp: state.xp + gained,
        cardIndex: isLast ? state.cardIndex : nextIndex,
        phase: isLast ? 'complete' : 'card'
      }
    }
    case 'RESTART':
      return { ...initialState, streak: state.streak + 1 }
    default:
      return state
  }
}

export function LessonProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const value = useMemo(() => {
    const currentCard = lesson.cards[state.cardIndex]
    const progress = state.phase === 'complete'
      ? 1
      : state.phase === 'card'
        ? state.cardIndex / state.totalCards
        : 0
    return {
      lesson,
      ...state,
      currentCard,
      progress,
      begin:        () => dispatch({ type: 'BEGIN' }),
      skipBreath:   () => dispatch({ type: 'SKIP_BREATH' }),
      breathDone:   () => dispatch({ type: 'BREATH_DONE' }),
      completeCard: (rating, payload) =>
        dispatch({ type: 'COMPLETE_CARD', cardId: currentCard.id, rating, payload }),
      restart:      () => dispatch({ type: 'RESTART' })
    }
  }, [state])

  return <LessonContext.Provider value={value}>{children}</LessonContext.Provider>
}

export function useLesson() {
  const ctx = useContext(LessonContext)
  if (!ctx) throw new Error('useLesson must be used inside <LessonProvider>')
  return ctx
}
