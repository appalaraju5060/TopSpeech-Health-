import { motion } from 'framer-motion'

// Shared envelope for every card. Handles enter/exit animation + safe-area padding.
// We slide up + fade so each card feels like a fresh page being lifted into view —
// gentler than Duolingo's snap-cut.
export default function CardWrapper({ children, className = '' }) {
  return (
    <motion.section
      className={
        'flex-1 flex flex-col items-stretch justify-between ' +
        'max-w-md mx-auto w-full px-6 pb-6 ' + className
      }
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ type: 'spring', stiffness: 110, damping: 20, duration: 0.45 }}
    >
      {children}
    </motion.section>
  )
}
