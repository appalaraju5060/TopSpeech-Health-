import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Volume2, Check } from 'lucide-react'
import CardWrapper from '../components/CardWrapper.jsx'
import { useLesson } from '../lib/lessonState.jsx'
import { speak } from '../lib/speak.js'

// Card 2 — Minimal-pair word selection (rabbit vs wabbit).
// This is the ONE card where the app gives feedback instead of self-rating, because
// the user is identifying a sound someone *else* produced — that's a perception
// task, not a production task. Self-monitoring is for production tasks.
// Feedback is sage halo (correct) or amber gentle-nudge (not-quite) — never red.

export default function WordSelection({ card }) {
  const { completeCard } = useLesson()
  const [picked, setPicked] = useState(null)

  // Auto-play the prompt once when the card first appears, then let the user
  // replay by tapping the speaker. The slight delay lets the card finish
  // animating in before audio starts — less startle for vulnerable users.
  useEffect(() => {
    const id = setTimeout(() => speak(card.correct), 450)
    return () => clearTimeout(id)
  }, [card.correct])

  const replay = () => speak(card.correct)

  const choose = (value) => {
    if (picked) return
    setPicked(value)
    const isCorrect = value === card.correct
    // Slight delay so the user sees the feedback state settle before we move on.
    setTimeout(() => {
      completeCard(isCorrect ? 'nailed' : 'almost', { picked: value })
    }, 1350)
  }

  const isCorrect = picked === card.correct

  return (
    <CardWrapper>
      <div className="flex-1 flex flex-col">
        <div className="pt-8 mb-10 text-center">
          <p className="text-warm-grey text-sm font-medium tracking-wide uppercase mb-2">
            Listen, then choose
          </p>
          <h2 className="font-display text-2xl font-semibold mb-6">{card.prompt}</h2>
          <motion.button
            onClick={replay}
            whileTap={{ scale: 0.94 }}
            aria-label="Replay the audio prompt"
            animate={!picked ? { scale: [1, 1.06, 1] } : { scale: 1 }}
            transition={!picked ? { duration: 2.4, repeat: Infinity, ease: 'easeInOut' } : {}}
            className="w-16 h-16 mx-auto rounded-full bg-sage-mist flex items-center justify-center shadow-soft focus:outline-none focus:ring-4 focus:ring-sage/40"
          >
            <Volume2 className="w-7 h-7 text-sage" strokeWidth={1.6} />
          </motion.button>
          <p className="text-xs text-warm-grey mt-2">Tap to hear again</p>
        </div>

        <div className="space-y-3 mt-2">
          {card.options.map((opt) => {
            const isPicked = picked === opt.value
            const isThisCorrect = opt.value === card.correct
            const ringClass =
              !picked
                ? 'ring-warm-line hover:ring-sage'
                : isPicked && isThisCorrect
                  ? 'ring-sage shadow-glow bg-sage-mist'
                  : isPicked && !isThisCorrect
                    ? 'ring-amber shadow-amber bg-amber-soft/40'
                    : !isPicked && isThisCorrect && picked
                      ? 'ring-sage/60 bg-sage-mist/60'
                      : 'ring-warm-line opacity-50'
            return (
              <motion.button
                key={opt.value}
                onClick={() => choose(opt.value)}
                whileTap={{ scale: 0.98 }}
                animate={{ scale: isPicked ? 1.02 : 1 }}
                transition={{ type: 'spring', stiffness: 240, damping: 18 }}
                className={
                  `w-full py-5 rounded-2xl ring-2 ring-inset bg-cream ` +
                  `font-display text-2xl font-medium transition-all ` +
                  `flex items-center justify-center gap-3 ` +
                  ringClass +
                  ' focus:outline-none focus:ring-4 focus:ring-sage/40'
                }
                disabled={!!picked}
                aria-pressed={isPicked}
              >
                <span>{opt.label}</span>
                {picked && isThisCorrect && (
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                  >
                    <Check className="w-6 h-6 text-sage" strokeWidth={2.4} />
                  </motion.span>
                )}
              </motion.button>
            )
          })}
        </div>

        <motion.div
          className="mt-6 text-center min-h-[2.5rem]"
          animate={{ opacity: picked ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {picked && (
            <p className={`text-sm ${isCorrect ? 'text-sage' : 'text-warm-grey'}`}>
              {isCorrect
                ? 'Good ear. That growl at the start is the R.'
                : card.nudge}
            </p>
          )}
        </motion.div>
      </div>
    </CardWrapper>
  )
}
