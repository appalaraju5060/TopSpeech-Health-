import { motion } from 'framer-motion'
import { Sun } from 'lucide-react'
import { useLesson } from '../lib/lessonState.jsx'
import VoiceCoachButton from './VoiceCoachButton.jsx'

// First impression. Calm, low-pressure. No streak counter, no ambient noise.
// The copy is intentionally soft — "you're safe to try here" — because adults
// practicing speech often carry years of self-consciousness into the moment.
export default function StartScreen() {
  const { lesson, begin, streak } = useLesson()
  return (
    <div className="flex-1 flex flex-col justify-between max-w-md mx-auto w-full px-6 pt-16 pb-10">
      <motion.div
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { staggerChildren: 0.12 } }
        }}
        className="flex-1 flex flex-col items-center text-center"
      >
        <motion.div
          variants={{ hidden: { opacity: 0, scale: 0.85 }, show: { opacity: 1, scale: 1 } }}
          transition={{ type: 'spring', stiffness: 140, damping: 14 }}
          className="w-20 h-20 rounded-full bg-sage-mist flex items-center justify-center mb-8"
        >
          <Sun className="w-9 h-9 text-sage" strokeWidth={1.6} />
        </motion.div>

        <motion.p
          variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
          className="text-warm-grey text-sm font-medium tracking-wide uppercase mb-2"
        >
          {lesson.programName}
        </motion.p>

        <motion.h1
          variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
          className="font-display text-4xl font-semibold mb-3 leading-tight"
        >
          Today: {lesson.title}
        </motion.h1>

        <motion.p
          variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
          className="text-warm-grey text-base mb-12 max-w-xs"
        >
          {lesson.subtitle}. Take a breath — you're safe to try here.
        </motion.p>

        <motion.div
          variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
          className="text-sm text-warm-grey"
        >
          <span className="font-semibold text-charcoal">Day {streak}</span> of your practice
        </motion.div>
      </motion.div>

      <div>
        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, type: 'spring', stiffness: 130, damping: 18 }}
          whileTap={{ scale: 0.97 }}
          onClick={begin}
          className="w-full py-4 rounded-2xl bg-sage text-cream font-display font-semibold text-lg shadow-soft focus:outline-none focus:ring-4 focus:ring-sage/40"
        >
          Begin
        </motion.button>
        <VoiceCoachButton />
      </div>
    </div>
  )
}
