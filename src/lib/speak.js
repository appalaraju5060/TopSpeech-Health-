// Tiny wrapper around the browser's Web Speech API.
// For the prototype only — production would use recorded SLP audio so every
// user hears the same pronunciation, instead of relying on whichever TTS
// engine ships with their device.
//
// Why slower than 1x: speech therapy benefits from deliberate, audible
// articulation. The default rate sounds rushed for someone trying to
// identify a specific phoneme.

const DEFAULT = { rate: 0.85, pitch: 1.0, volume: 1.0, lang: 'en-US' }

let cachedVoice = null

function pickVoice() {
  if (cachedVoice) return cachedVoice
  if (typeof window === 'undefined' || !window.speechSynthesis) return null
  const voices = window.speechSynthesis.getVoices()
  if (!voices.length) return null
  // Prefer Google / Microsoft / Samantha — generally clearest English voices
  // across Chrome, Edge, and Safari respectively.
  cachedVoice =
    voices.find(v => /Google US English/i.test(v.name)) ||
    voices.find(v => /Samantha/i.test(v.name)) ||
    voices.find(v => /Microsoft (Aria|Jenny|Zira)/i.test(v.name)) ||
    voices.find(v => v.lang?.startsWith('en') && v.default) ||
    voices.find(v => v.lang?.startsWith('en')) ||
    voices[0]
  return cachedVoice
}

// On Chrome/Edge the voice list loads asynchronously — warm it up on import.
if (typeof window !== 'undefined' && window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoice = null
    pickVoice()
  }
  pickVoice()
}

export function speak(text, opts = {}) {
  if (typeof window === 'undefined') return
  if (!('speechSynthesis' in window)) return
  // Stop anything mid-utterance so taps feel responsive, not stacked.
  window.speechSynthesis.cancel()

  const u = new SpeechSynthesisUtterance(text)
  const cfg = { ...DEFAULT, ...opts }
  u.rate   = cfg.rate
  u.pitch  = cfg.pitch
  u.volume = cfg.volume
  u.lang   = cfg.lang
  const v = pickVoice()
  if (v) u.voice = v

  window.speechSynthesis.speak(u)
}

export function supportsSpeech() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}
