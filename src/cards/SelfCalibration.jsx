import { useState } from 'react'
import { motion } from 'framer-motion'
import CardWrapper from '../components/CardWrapper.jsx'
import SelfRating from '../components/SelfRating.jsx'
import { useLesson } from '../lib/lessonState.jsx'

// Card 4 — Self-Calibration Sentence (innovation centerpiece)
// User reads a full sentence with multiple R-words. R-target words are visually
// highlighted in terracotta so the eye targets them. After speaking, the user
// taps each R-word that felt off — a granular, per-word self-rating that no
// pronunciation app does.
//
// In the interview: this is the most defensible card. Real SLP "carry-over"
// exercises move from isolated phonemes → words → sentences → conversation.
// We're at the sentence step, and we're using the same per-target self-check
// a clinician would do verbally.

export default function SelfCalibration({ card }) {
  const { completeCard } = useLesson()
  const words = card.sentence.replace(/\.$/, '').split(' ')

  const [said, setSaid]     = useState(false)
  const [toughWords, setTough] = useState(new Set())

  const toggleWord = (idx) => {
    if (!said) return
    const next = new Set(toughWords)
    if (next.has(idx)) next.delete(idx)
    else next.add(idx)
    setTough(next)
  }

  // The overall self-rating is the source of truth; the per-word tags are stored
  // as supporting context for "what to focus on tomorrow."
  const handleRate = (overall) => {
    completeCard(overall, { toughWords: [...toughWords] })
  }

  return (
    <CardWrapper>
      <div className="flex-1 flex flex-col">
        <div className="pt-8 mb-6 text-center">
          <p className="text-warm-grey text-sm font-medium tracking-wide uppercase mb-2">
            Sentence practice
          </p>
          <h2 className="font-display text-xl font-semibold mb-1">Read aloud, slowly.</h2>
          <p className="text-warm-grey text-sm">{card.coachLine}</p>
        </div>

        <div className="bg-cream ring-2 ring-warm-line rounded-3xl p-6 mb-6">
          <p className="font-display text-2xl leading-relaxed text-center" lang="en">
            {words.map((w, i) => {
              const isTarget = card.targetIndices.includes(i)
              const isTagged = toughWords.has(i)
              return (
                <span key={i}>
                  <motion.button
                    type="button"
                    onClick={() => toggleWord(i)}
                    whileTap={{ scale: 0.95 }}
                    className={
                      'inline-block transition-colors rounded px-1 ' +
                      (said ? 'cursor-pointer ' : 'cursor-default ') +
                      (isTarget
                        ? (isTagged
                            ? 'bg-amber-soft text-terracotta font-semibold'
                            : 'text-terracotta font-semibold')
                        : 'text-charcoal')
                    }
                    aria-label={isTarget ? `${w} (R word, tap to mark as tough)` : w}
                    disabled={!isTarget}
                  >
                    {w}
                  </motion.button>
                  {i < words.length - 1 ? ' ' : '.'}
                </span>
              )
            })}
          </p>
        </div>

        <div className="mt-auto">
          {!said && (
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setSaid(true)}
              className="w-full py-4 rounded-2xl bg-sage text-cream font-display font-semibold text-lg shadow-soft focus:outline-none focus:ring-4 focus:ring-sage/40"
            >
              I said it
            </motion.button>
          )}
          {said && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <p className="text-center text-warm-grey text-sm">
                Tap any <span className="text-terracotta font-medium">R-word</span> that felt off.
                {toughWords.size > 0 && (
                  <span className="block mt-1 text-xs">
                    Tomorrow's lesson will focus on these.
                  </span>
                )}
              </p>
              <SelfRating onRate={handleRate} prompt="Overall, how did the sentence feel?" />
            </motion.div>
          )}
        </div>
      </div>
    </CardWrapper>
  )
}
