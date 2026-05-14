// Vercel serverless function — runs ONLY on Vercel's servers, never in the browser.
// This is the only place the Retell API key is ever read. The client receives a
// short-lived access_token instead of the key itself.
//
// Flow:
//   browser →  POST /api/create-web-call  →  Retell  →  access_token
//   browser ←  access_token  ← (this function)
//   browser → Retell Web SDK uses access_token to open a voice session

export default async function handler(req, res) {
  // CORS-safe: only allow POST from same origin
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Support both common naming conventions for the env vars so users who
  // copy-paste from different Retell tutorials don't get tripped up.
  const apiKey  = process.env.RETELL_API_KEY  || process.env.retellai_api
  const agentId = process.env.RETELL_AGENT_ID || process.env.retellai_agent_id

  if (!apiKey || !agentId) {
    // Graceful: don't leak which env var is missing
    return res.status(503).json({
      error: 'voice-coach-unavailable',
      message: 'Premium voice coach is not configured for this deployment.'
    })
  }

  try {
    const response = await fetch('https://api.retellai.com/v2/create-web-call', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type':  'application/json'
      },
      body: JSON.stringify({ agent_id: agentId })
    })

    if (!response.ok) {
      const text = await response.text()
      console.error('[retell] upstream error', response.status, text)
      return res.status(502).json({
        error: 'voice-coach-failed',
        message: 'The voice coach is briefly unavailable. Please try again.'
      })
    }

    const data = await response.json()
    // Only forward what the client needs — never expose the API key.
    return res.status(200).json({
      access_token: data.access_token,
      call_id:      data.call_id
    })
  } catch (err) {
    console.error('[retell] network error', err)
    return res.status(500).json({
      error: 'voice-coach-failed',
      message: 'The voice coach could not be reached. Please try again.'
    })
  }
}
