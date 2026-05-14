import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Sprout } from 'lucide-react'
import { useLesson } from '../lib/lessonState.jsx'

// Quiet celebration. The whole submission's emotional thesis lives here.
// No confetti. No "PERFECT! +50 XP!" yelling. Just a slow halo settling,
// a small XP number counting up, and a calm message about tomorrow.
//
// The streak is reframed as "practice days" — a positive habit count, never
// a thing you can lose. This is the single biggest divergence from Duolingo's
// emotional grammar.

function CountUp({ to, duration = 1.2 }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    const start = Date.now()
    const id = setInterval(() => {
      const t = Math.min((Date.now() - start) / (duration * 1000), 1)
      // ease-out cubic — feels natural, slows as it approaches target
      const eased = 1 - Math.pow(1 - t, 3)
      setN(Math.round(eased * to))
      if (t >= 1) clearInterval(id)
    }, 30)
    return () => clearInterval(id)
  }, [to, duration])
  return <>{n}</>
}

export default function EndScreen() {
  const { xp, streak, restart, ratings } = useLesson()
  const nailedCount = ratings.filter(r => r.rating === 'nailed').length

  return (
    <div className="flex-1 flex flex-col justify-between max-w-md mx-auto w-full px-6 pt-16 pb-10">
      <motion.div
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { staggerChildren: 0.18, delayChildren: 0.15 } }
        }}
        className="flex-1 flex flex-col items-center text-center"
      >
        {/* Soft halo — animates in, then breathes gently */}
        <motion.div
          variants={{
            hidden: { opacity: 0, scale: 0.7 },
            show:   { opacity: 1, scale: 1 }
          }}
          transition={{ type: 'spring', stiffness: 90, damping: 18 }}
          className="relative w-32 h-32 mb-8"
        >
          <motion.div
            className="absolute inset-0 rounded-full bg-sage-mist"
            animate={{ scale: [1, 1.08, 1], opacity: [0.6, 0.9, 0.6] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div className="absolute inset-4 rounded-full bg-sage-soft flex items-center justify-center">
            <Sprout className="w-12 h-12 text-cream" strokeWidth={1.6} />
          </div>
        </motion.div>

        <motion.h1
          variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
          className="font-display text-3xl font-semibold mb-2 leading-tight"
        >
          Practice complete.
        </motion.h1>

        <motion.p
          variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
          className="text-warm-grey text-base mb-10 max-w-xs"
        >
          That's another step forward. Your voice can rest now.
        </motion.p>

        <motion.div
          variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
          className="grid grid-cols-3 gap-3 w-full max-w-sm"
        >
          <Stat label="Practice days" value={<>{streak}</>} accent="text-sage" />
          <Stat label="XP today"      value={<CountUp to={xp} />} accent="text-terracotta" />
          <Stat label="Nailed"        value={<>{nailedCount}/4</>} accent="text-charcoal" />
        </motion.div>

        <motion.p
          variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
          className="text-warm-grey text-sm mt-10 max-w-xs"
        >
          Tomorrow: <span className="text-charcoal font-medium">Sentence carry-over</span>.
          We'll work on the R-words you marked as tough.
        </motion.p>
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        whileTap={{ scale: 0.97 }}
        onClick={restart}
        className="w-full py-4 rounded-2xl bg-sage text-cream font-display font-semibold text-lg shadow-soft focus:outline-none focus:ring-4 focus:ring-sage/40"
      >
        Done for today
      </motion.button>
    </div>
  )
}

function Stat({ label, value, accent }) {
  return (
    <div className="bg-cream ring-2 ring-warm-line rounded-2xl py-3 px-2">
      <div className={`font-display text-2xl font-semibold ${accent}`}>{value}</div>
      <div className="text-xs text-warm-grey mt-1">{label}</div>
    </div>
  )
}
