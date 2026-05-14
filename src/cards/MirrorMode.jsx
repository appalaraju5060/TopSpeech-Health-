import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import CardWrapper from '../components/CardWrapper.jsx'
import SelfRating from '../components/SelfRating.jsx'
import { useLesson } from '../lib/lessonState.jsx'

// Card 3 — Mirror Mode
// Borrowed from real SLP clinical practice: visual phonetic placement. The patient
// sees a side-view diagram of where the tongue should sit to produce the target sound.
// For the R sound, the tongue tip curls back toward (but does not touch) the alveolar ridge.
//
// We could use the front camera here — but a static, clinical-feeling SVG actually wins:
// (1) no permission friction, (2) consistent across devices, (3) less self-conscious for
// the user (looking at your own face while practicing a sound you're embarrassed about
// is a known therapy obstacle).
//
// A 3-second hold gives the user a "stage" — a defined moment to produce the sound — then
// transitions into self-rating.

const HOLD_MS = 3000

function MouthDiagram() {
  // Side-view of mouth and tongue position for the R sound.
  // The tongue tip (highlighted in coral) curls up and back — the key motor cue.
  return (
    <svg viewBox="0 0 240 200" className="w-full h-full" aria-hidden="true">
      {/* face profile silhouette */}
      <path
        d="M 30 40 Q 30 20 60 20 L 180 20 Q 210 20 215 50 L 215 90 Q 220 100 215 110 L 215 150 Q 210 180 180 180 L 60 180 Q 30 180 30 160 Z"
        fill="#FBF8F3"
        stroke="#E8E2D7"
        strokeWidth="1.5"
      />
      {/* upper lip */}
      <path d="M 90 95 Q 130 88 175 95" stroke="#D4886A" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* upper teeth */}
      <path d="M 95 108 L 100 118 L 110 108 L 115 118 L 125 108 L 130 118 L 140 108 L 145 118 L 155 108 L 160 118 L 170 108"
        stroke="#88A096" strokeWidth="1.2" fill="none" />
      {/* alveolar ridge (target) — subtle dot */}
      <circle cx="115" cy="116" r="2.5" fill="#88A096" />
      {/* lower lip */}
      <path d="M 90 138 Q 130 145 175 138" stroke="#D4886A" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* tongue — curled back for R */}
      <motion.path
        d="M 95 135 Q 110 120 130 115 Q 145 112 140 122 Q 138 130 130 135 Z"
        fill="#E89B8C"
        stroke="#D4886A"
        strokeWidth="1.5"
        animate={{ scale: [1, 1.04, 1] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: '120px 125px' }}
      />
      {/* arrow showing tongue tip motion */}
      <motion.path
        d="M 145 110 Q 138 105 132 110"
        stroke="#88A096"
        strokeWidth="1.5"
        fill="none"
        strokeDasharray="3 3"
        animate={{ opacity: [0.3, 0.9, 0.3] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* label */}
      <text x="160" y="108" fontSize="9" fill="#7C7C72" fontFamily="Inter">tongue tip</text>
      <text x="160" y="119" fontSize="9" fill="#7C7C72" fontFamily="Inter">curls back</text>
    </svg>
  )
}

export default function MirrorMode({ card }) {
  const { completeCard } = useLesson()
  const [phase, setPhase] = useState('ready')   // 'ready' | 'holding' | 'tried'
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    if (phase !== 'holding') return
    const start = Date.now()
    const id = setInterval(() => {
      const t = Date.now() - start
      setElapsed(t)
      if (t >= HOLD_MS) {
        clearInterval(id)
        setPhase('tried')
      }
    }, 50)
    return () => clearInterval(id)
  }, [phase])

  const progress = Math.min(elapsed / HOLD_MS, 1)
  const radius = 36
  const circ = 2 * Math.PI * radius

  return (
    <CardWrapper>
      <div className="flex-1 flex flex-col">
        <div className="pt-8 mb-6 text-center">
          <p className="text-warm-grey text-sm font-medium tracking-wide uppercase mb-2">
            Mirror mode
          </p>
          <h2 className="font-display text-3xl font-semibold mb-2">
            Say "<span className="italic text-terracotta">{card.sound}</span>"
          </h2>
          <p className="text-warm-grey text-sm max-w-xs mx-auto">{card.coachLine}</p>
        </div>

        <div className="bg-sage-mist/40 rounded-3xl p-6 mb-6 aspect-[6/5]">
          <MouthDiagram />
        </div>

        <p className="text-center text-warm-grey text-sm mb-4">{card.instruction}</p>

        <div className="mt-auto">
          <AnimatePresence mode="wait">
            {phase === 'ready' && (
              <motion.button
                key="start"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setPhase('holding')}
                className="w-full py-4 rounded-2xl bg-sage text-cream font-display font-semibold text-lg shadow-soft focus:outline-none focus:ring-4 focus:ring-sage/40"
              >
                Hold and try
              </motion.button>
            )}

            {phase === 'holding' && (
              <motion.div
                key="holding"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center"
              >
                <svg width="96" height="96" viewBox="0 0 96 96">
                  <circle cx="48" cy="48" r={radius} fill="none" stroke="#E2EBE3" strokeWidth="6" />
                  <circle
                    cx="48" cy="48" r={radius}
                    fill="none" stroke="#88A096" strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={circ}
                    strokeDashoffset={circ * (1 - progress)}
                    transform="rotate(-90 48 48)"
                    style={{ transition: 'stroke-dashoffset 0.1s linear' }}
                  />
                  <text x="48" y="55" textAnchor="middle" fontFamily="Fraunces" fontSize="24" fontWeight="600" fill="#2D3142">
                    {Math.max(0, Math.ceil((HOLD_MS - elapsed) / 1000))}
                  </text>
                </svg>
                <p className="text-warm-grey text-sm mt-2">Keep going…</p>
              </motion.div>
            )}

            {phase === 'tried' && (
              <SelfRating
                key="rate"
                onRate={(r) => completeCard(r)}
                prompt="How did your tongue feel?"
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </CardWrapper>
  )
}
