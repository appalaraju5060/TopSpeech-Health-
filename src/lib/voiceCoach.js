// Client-side wrapper around the Retell Web SDK.
//
// Design notes for the interview:
//
// (1) We never put the Retell API key in the browser. The serverless function
//     at /api/create-web-call holds the key and only hands the browser a
//     short-lived access_token for a single call.
//
// (2) This module degrades gracefully. If Retell is not configured (no env
//     vars set on Vercel), the serverless function returns 503 and the UI
//     shows a calm "Premium voice coach is unavailable" message. The rest
//     of the lesson keeps working.
//
// (3) The "voice coach" framing is deliberate. Our innovation is
//     Patient Self-Monitoring — the user judges themselves. Retell here is
//     NOT a judge layer. It's the warm clinical voice that encourages and
//     guides — never tells the user they were "wrong." Same emotional grammar
//     as the rest of the app, just delivered through a richer voice.

import { RetellWebClient } from 'retell-client-js-sdk'

let client = null

function getClient() {
  if (!client) client = new RetellWebClient()
  return client
}

export async function startVoiceCoach({ onStart, onEnd, onError } = {}) {
  // 1. Ask our own serverless function for a session token.
  let token
  try {
    const res = await fetch('/api/create-web-call', { method: 'POST' })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      const err = new Error(data.message || 'Voice coach unavailable')
      err.code = data.error || 'unknown'
      err.status = res.status
      throw err
    }
    const data = await res.json()
    token = data.access_token
    if (!token) throw new Error('No access token returned')
  } catch (err) {
    onError?.(err)
    throw err
  }

  // 2. Open the real-time voice session via Retell's Web SDK.
  const c = getClient()

  // Wire events ONCE — re-binding on each call leaks listeners.
  c.removeAllListeners?.()
  c.on('call_started', () => onStart?.())
  c.on('call_ended',   () => onEnd?.())
  c.on('error',        (e) => onError?.(e))

  try {
    await c.startCall({ accessToken: token })
  } catch (err) {
    onError?.(err)
    throw err
  }
}

export function stopVoiceCoach() {
  try { getClient().stopCall() } catch { /* ignore */ }
}

export function isVoiceCoachSupported() {
  // Retell needs WebRTC + getUserMedia. Both standard on modern browsers,
  // but iOS Safari requires a user gesture to grant mic permission — which
  // we already have (the button tap).
  return typeof window !== 'undefined'
    && typeof navigator !== 'undefined'
    && !!navigator.mediaDevices?.getUserMedia
    && typeof RTCPeerConnection !== 'undefined'
}
