// Vercel serverless function — server-side only, never reaches the client bundle.
// This is where the Retell API key is used safely. The client never sees it;
// it only receives a short-lived access_token that authenticates the WebRTC
// session for ONE call.
//
// Env vars required in Vercel dashboard (Settings → Environment Variables):
//   RETELL_API_KEY   — your Retell account API key (sk_live_… or similar)
//   RETELL_AGENT_ID  — the agent_id of the speech-coach agent you created
//
// Local dev: if you have a .env or env file with these vars at the project
// root, Vercel CLI / `vercel dev` will pick them up. Vite alone does NOT
// run serverless functions — use `vercel dev` to test the API route locally.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey  = process.env.RETELL_API_KEY  || process.env.retellai_api
  const agentId = process.env.RETELL_AGENT_ID || process.env.retellai_agent_id

  if (!apiKey || !agentId) {
    return res.status(503).json({
      error: 'Coach not configured',
      hint:  'Set RETELL_API_KEY and RETELL_AGENT_ID in Vercel env vars'
    })
  }

  try {
    const upstream = await fetch('https://api.retellai.com/v2/create-web-call', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type':  'application/json'
      },
      body: JSON.stringify({ agent_id: agentId })
    })

    if (!upstream.ok) {
      const detail = await upstream.text()
      return res.status(upstream.status).json({
        error:  'Retell API rejected the call',
        status: upstream.status,
        detail
      })
    }

    const data = await upstream.json()
    // Return ONLY what the client needs. Never echo the API key.
    return res.status(200).json({
      access_token: data.access_token,
      call_id:      data.call_id
    })
  } catch (err) {
    return res.status(500).json({
      error:  'Failed to reach Retell',
      detail: err instanceof Error ? err.message : String(err)
    })
  }
}
