import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useLesson } from '../lib/lessonState.jsx'

// 5-second breath anchor between Start and first card.
// Why: speech therapy works better when the user is relaxed. Tense jaw and throat
// muscles literally make the R sound harder. This isn't a gimmick — it's clinical.
// Skippable, because some users will want to dive in.
const BREATH_MS = 5000

export default function BreathAnchor() {
  const { breathDone, skipBreath } = useLesson()
  const [phase, setPhase] = useState('in')  // 'in' | 'out'

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('out'), BREATH_MS / 2)
    const t2 = setTimeout(() => breathDone(), BREATH_MS)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [breathDone])

  return (
    <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full px-6">
      <motion.div
        animate={{ scale: phase === 'in' ? 1.25 : 0.85 }}
        transition={{ duration: BREATH_MS / 2 / 1000, ease: 'easeInOut' }}
        className="w-44 h-44 rounded-full bg-sage-mist flex items-center justify-center mb-8"
      >
        <motion.div
          animate={{ scale: phase === 'in' ? 1.2 : 0.9, opacity: phase === 'in' ? 1 : 0.6 }}
          transition={{ duration: BREATH_MS / 2 / 1000, ease: 'easeInOut' }}
          className="w-24 h-24 rounded-full bg-sage"
        />
      </motion.div>

      <p className="font-display text-2xl font-medium mb-2">
        {phase === 'in' ? 'Breathe in' : 'And out'}
      </p>
      <p className="text-warm-grey text-sm mb-10">A loose jaw makes the R easier.</p>

      <button
        onClick={skipBreath}
        className="text-warm-grey text-sm underline underline-offset-4 hover:text-charcoal transition"
      >
        Skip
      </button>
    </div>
  )
}
