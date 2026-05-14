import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Sparkles, Mic, PhoneOff } from 'lucide-react'
import { startVoiceCoach, stopVoiceCoach, isVoiceCoachSupported } from '../lib/voiceCoach.js'

// Premium feature: real-time AI voice coach powered by Retell.
// Sits on the Start Screen as an optional warm-up before the lesson.
// Degrades gracefully if env vars aren't configured on the deployment.
//
// States:
//   'idle'        — button visible, ready to start
//   'connecting'  — fetching token + opening webrtc session
//   'in-call'     — call active, end button visible
//   'error'       — show calm message, allow retry
//   'unavailable' — server returned 503 (premium not configured)

export default function VoiceCoachButton() {
  const [phase, setPhase]   = useState('idle')
  const [errMsg, setErrMsg] = useState('')
  const mountedRef = useRef(true)

  useEffect(() => () => {
    mountedRef.current = false
    stopVoiceCoach()
  }, [])

  if (!isVoiceCoachSupported()) return null

  const start = async () => {
    setPhase('connecting')
    setErrMsg('')
    try {
      await startVoiceCoach({
        onStart: () => mountedRef.current && setPhase('in-call'),
        onEnd:   () => mountedRef.current && setPhase('idle'),
        onError: (e) => {
          if (!mountedRef.current) return
          setErrMsg(e.message || 'Voice coach paused for now.')
          setPhase(e.code === 'voice-coach-unavailable' ? 'unavailable' : 'error')
        }
      })
    } catch (e) {
      if (!mountedRef.current) return
      setErrMsg(e.message || 'Voice coach paused for now.')
      setPhase(e.code === 'voice-coach-unavailable' ? 'unavailable' : 'error')
    }
  }

  const end = () => {
    stopVoiceCoach()
    setPhase('idle')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="w-full mt-4"
    >
      <AnimatePresence mode="wait">
        {(phase === 'idle' || phase === 'error') && (
          <motion.button
            key="idle"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            whileTap={{ scale: 0.97 }}
            onClick={start}
            className="w-full py-3.5 rounded-2xl bg-cream ring-2 ring-amber-soft hover:ring-amber transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-4 focus:ring-amber/40"
          >
            <Sparkles className="w-4 h-4 text-terracotta" strokeWidth={2} />
            <span className="font-display text-base font-medium text-charcoal">
              Talk to your AI Coach
            </span>
            <span className="text-[10px] font-sans font-semibold uppercase tracking-wider text-terracotta bg-amber-soft/60 px-2 py-0.5 rounded-full">
              Premium
            </span>
          </motion.button>
        )}

        {phase === 'connecting' && (
          <motion.div
            key="connecting"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="w-full py-3.5 rounded-2xl bg-sage-mist/60 flex items-center justify-center gap-2"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-2 h-2 rounded-full bg-sage"
            />
            <span className="font-display text-sm text-warm-grey">Connecting…</span>
          </motion.div>
        )}

        {phase === 'in-call' && (
          <motion.div
            key="in-call"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="w-full"
          >
            <div className="w-full py-3 rounded-2xl bg-sage-mist flex items-center justify-center gap-2 mb-2">
              <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Mic className="w-4 h-4 text-sage" />
              </motion.div>
              <span className="font-display text-sm text-charcoal">Coach is listening</span>
            </div>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={end}
              className="w-full py-3 rounded-2xl bg-cream ring-2 ring-warm-line flex items-center justify-center gap-2 focus:outline-none focus:ring-4 focus:ring-sage/40"
            >
              <PhoneOff className="w-4 h-4 text-warm-grey" />
              <span className="font-sans text-sm text-warm-grey">End session</span>
            </motion.button>
          </motion.div>
        )}

        {phase === 'unavailable' && (
          <motion.div
            key="unavailable"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="w-full py-3 rounded-2xl bg-cream ring-2 ring-warm-line text-center"
          >
            <p className="text-xs text-warm-grey">
              Premium voice coach — coming soon.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {errMsg && phase === 'error' && (
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="text-xs text-warm-grey text-center mt-2"
        >
          {errMsg}
        </motion.p>
      )}
    </motion.div>
  )
}
