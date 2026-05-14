import { motion } from 'framer-motion'
import { useLesson } from '../lib/lessonState.jsx'

// Segmented progress bar. Each card = one segment. Filled segments are sage.
// Why segmented over a single bar: it tells the user how many steps remain at a glance,
// which reduces anxiety. Duolingo uses one continuous bar — fine for hobby learners,
// less helpful for therapy users who need predictability.
export default function ProgressBar() {
  const { totalCards, cardIndex, phase } = useLesson()
  const filled = phase === 'complete' ? totalCards : cardIndex

  return (
    <div
      className="w-full flex gap-1.5"
      role="progressbar"
      aria-valuenow={filled}
      aria-valuemin={0}
      aria-valuemax={totalCards}
      aria-label={`Lesson progress: ${filled} of ${totalCards} exercises complete`}
    >
      {Array.from({ length: totalCards }).map((_, i) => {
        const isFilled = i < filled
        const isCurrent = i === filled && phase === 'card'
        return (
          <div
            key={i}
            className="flex-1 h-2 rounded-full bg-warm-line overflow-hidden"
          >
            <motion.div
              className={isFilled ? 'h-full bg-sage' : 'h-full bg-sage-soft'}
              initial={{ width: '0%' }}
              animate={{ width: isFilled ? '100%' : isCurrent ? '15%' : '0%' }}
              transition={{ type: 'spring', stiffness: 90, damping: 18 }}
            />
          </div>
        )
      })}
    </div>
  )
}
