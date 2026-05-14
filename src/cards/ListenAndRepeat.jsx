import { useState } from 'react'
import { motion } from 'framer-motion'
import { Volume2 } from 'lucide-react'
import CardWrapper from '../components/CardWrapper.jsx'
import SelfRating from '../components/SelfRating.jsx'
import { useLesson } from '../lib/lessonState.jsx'
import { speak } from '../lib/speak.js'

// Card 1 — Listen-and-Repeat
// Sub-phases: 'listen' (tap to "play") → 'tried' (show self-rating)
// Audio is mocked per assignment spec — we animate a waveform to communicate playback
// without needing real audio. The bars use staggered y-scale to feel breathing, not random.

const BAR_COUNT = 12

export default function ListenAndRepeat({ card }) {
  const { completeCard } = useLesson()
  const [phase, setPhase] = useState('listen') // 'listen' | 'playing' | 'tried'

  const play = () => {
    setPhase('playing')
    speak(card.word)
    setTimeout(() => setPhase('listen'), 1400)
  }

  const tried = () => setPhase('tried')

  return (
    <CardWrapper>
      <div className="flex-1 flex flex-col">
        <div className="pt-8 mb-8 text-center">
          <p className="text-warm-grey text-sm font-medium tracking-wide uppercase mb-2">
            Listen and repeat
          </p>
          <h2 className="font-display text-5xl font-semibold mb-2">{card.word}</h2>
          <p className="text-warm-grey text-sm font-mono">{card.phonetic}</p>
        </div>

        <div className="flex flex-col items-center mt-2 mb-6">
          <button
            onClick={play}
            aria-label={`Play the word ${card.word}`}
            className="w-24 h-24 rounded-full bg-sage-mist hover:bg-sage-soft transition-colors flex items-center justify-center shadow-soft focus:outline-none focus:ring-4 focus:ring-sage/40"
          >
            <Volume2 className="w-10 h-10 text-sage" strokeWidth={1.6} />
          </button>

          {/* mocked waveform */}
          <div className="h-12 flex items-end gap-1 mt-6" aria-hidden="true">
            {Array.from({ length: BAR_COUNT }).map((_, i) => (
              <motion.span
                key={i}
                className="w-1.5 bg-sage rounded-full"
                animate={phase === 'playing'
                  ? { height: ['12%', '90%', '40%', '70%', '20%'] }
                  : { height: '20%' }}
                transition={phase === 'playing'
                  ? { duration: 1.2, delay: i * 0.04, repeat: 0, ease: 'easeInOut' }
                  : { duration: 0.4 }}
                style={{ height: 8 }}
              />
            ))}
          </div>

          <p className="text-warm-grey text-sm mt-4 text-center max-w-xs">
            {card.coachLine}
          </p>
        </div>

        <div className="mt-auto">
          {phase !== 'tried' && (
            <motion.button
              onClick={tried}
              whileTap={{ scale: 0.97 }}
              className="w-full py-4 rounded-2xl bg-sage text-cream font-display font-semibold text-lg shadow-soft focus:outline-none focus:ring-4 focus:ring-sage/40"
            >
              I tried it
            </motion.button>
          )}
          {phase === 'tried' && (
            <SelfRating onRate={(r) => completeCard(r)} />
          )}
        </div>
      </div>
    </CardWrapper>
  )
}
