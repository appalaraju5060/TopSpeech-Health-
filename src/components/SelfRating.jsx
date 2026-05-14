import { useState } from 'react'
import { motion } from 'framer-motion'

// THE INNOVATION.
// Instead of the app judging "correct/incorrect", the user rates themselves.
// This mirrors the clinical SLP practice called "self-monitoring" — the patient
// learns to hear their own errors, which is what determines whether progress
// survives outside the therapy room.
//
// Three ratings, never a binary right/wrong:
//   - 'off'     → soft tip + no penalty
//   - 'almost'  → encouragement + small XP
//   - 'nailed'  → sage confirmation + full XP
//
// The word "wrong" never appears here. That's the point.

const OPTIONS = [
  {
    key: 'off',
    emoji: '🌿',
    label: 'Felt off',
    sub:   "We'll come back to it.",
    ring:  'ring-warm-line hover:ring-warm-grey',
    bg:    'bg-cream',
    text:  'text-warm-grey'
  },
  {
    key: 'almost',
    emoji: '✨',
    label: 'Almost',
    sub:   'Closer than you think.',
    ring:  'ring-amber-soft hover:ring-amber',
    bg:    'bg-amber-soft/40',
    text:  'text-charcoal'
  },
  {
    key: 'nailed',
    emoji: '🌟',
    label: 'Nailed it',
    sub:   'That one is yours.',
    ring:  'ring-sage-mist hover:ring-sage',
    bg:    'bg-sage-mist',
    text:  'text-charcoal'
  }
]

export default function SelfRating({ onRate, prompt = 'How did that feel?' }) {
  const [picked, setPicked] = useState(null)

  const handle = (key) => {
    if (picked) return
    setPicked(key)
    // Tiny delay lets the user see their selection settle before we advance.
    // Reinforces agency — they made the call, then the app responded.
    setTimeout(() => onRate(key), 520)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.4 }}
      className="mt-6"
    >
      <p className="text-center text-warm-grey text-sm mb-4 font-medium">
        {prompt}
      </p>
      <div className="grid grid-cols-3 gap-2">
        {OPTIONS.map((o) => {
          const isPicked = picked === o.key
          const isDimmed = picked && !isPicked
          return (
            <motion.button
              key={o.key}
              type="button"
              onClick={() => handle(o.key)}
              whileTap={{ scale: 0.94 }}
              animate={{
                scale: isPicked ? 1.04 : 1,
                opacity: isDimmed ? 0.35 : 1
              }}
              transition={{ type: 'spring', stiffness: 260, damping: 18 }}
              className={
                `relative flex flex-col items-center justify-center ` +
                `rounded-2xl py-4 px-2 ring-2 ring-inset transition-colors ` +
                `${o.bg} ${o.ring} ${o.text} ` +
                'focus:outline-none focus:ring-4 focus:ring-sage/40 ' +
                'disabled:cursor-default'
              }
              disabled={!!picked}
              aria-pressed={isPicked}
              aria-label={`${o.label} — ${o.sub}`}
            >
              <span className="text-2xl mb-1" aria-hidden="true">{o.emoji}</span>
              <span className="font-display font-semibold text-base leading-tight">
                {o.label}
              </span>
              <span className="text-[11px] text-warm-grey mt-1 leading-tight px-1">
                {o.sub}
              </span>
            </motion.button>
          )
        })}
      </div>
    </motion.div>
  )
}
