import { AnimatePresence, motion } from 'framer-motion'
import { LessonProvider, useLesson } from './lib/lessonState.jsx'

import ProgressBar    from './components/ProgressBar.jsx'
import StartScreen    from './components/StartScreen.jsx'
import BreathAnchor   from './components/BreathAnchor.jsx'
import EndScreen      from './components/EndScreen.jsx'

import ListenAndRepeat  from './cards/ListenAndRepeat.jsx'
import WordSelection    from './cards/WordSelection.jsx'
import MirrorMode       from './cards/MirrorMode.jsx'
import SelfCalibration  from './cards/SelfCalibration.jsx'

// Route the current card *type* to its component.
// Keeping this map outside the render keeps the card components decoupled —
// adding a new exercise type later means one line here + one new file.
const CARDS = {
  'listen-repeat': ListenAndRepeat,
  'word-select':   WordSelection,
  'mirror':        MirrorMode,
  'sentence':      SelfCalibration
}

function CardStage() {
  const { currentCard, cardIndex } = useLesson()
  const Component = CARDS[currentCard.type]
  if (!Component) return null
  return (
    <AnimatePresence mode="wait">
      <Component key={`${currentCard.id}-${cardIndex}`} card={currentCard} />
    </AnimatePresence>
  )
}

function LessonHeader() {
  const { phase } = useLesson()
  // Hide chrome on start screen — we want first impression to be calm and uncluttered.
  if (phase === 'start' || phase === 'complete') return null
  return (
    <header className="safe-top px-6 pt-4 pb-3 max-w-md mx-auto w-full">
      <ProgressBar />
    </header>
  )
}

function Shell() {
  const { phase } = useLesson()
  return (
    <div className="min-h-screen flex flex-col bg-cream text-charcoal safe-bottom">
      <LessonHeader />
      <AnimatePresence mode="wait">
        <motion.main
          key={phase === 'card' ? 'card-stage' : phase}
          className="flex-1 flex flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {phase === 'start'     && <StartScreen />}
          {phase === 'breathing' && <BreathAnchor />}
          {phase === 'card'      && <CardStage />}
          {phase === 'complete'  && <EndScreen />}
        </motion.main>
      </AnimatePresence>
    </div>
  )
}

export default function App() {
  return (
    <LessonProvider>
      <Shell />
    </LessonProvider>
  )
}
