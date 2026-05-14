// Vercel serverless function — runs ONLY on Vercel's servers, never in the browser.
// Holds the Retell API key safely. Configures the agent's VOICE and SYSTEM PROMPT
// from code on every call, so the Retell dashboard never needs to be touched.
//
// Flow:
//   1. PATCH the agent  → set voice_id  ("11labs-Monika")
//   2. PATCH the LLM     → set general_prompt (our hardcoded coach prompt + opener)
//   3. POST  create-web-call → receive access_token
//   4. Return access_token to the browser
//
// Env vars required in Vercel:
//   RETELL_API_KEY   (server-only, never exposed)
//   RETELL_AGENT_ID  (the speech-coach agent)
//
// Why patch every call instead of hardcoding once on the dashboard:
//   - The prompt, voice, and behavior live in source-controlled code
//   - One source of truth — no drift between deployment and dashboard
//   - The agent on the dashboard is an empty shell; this file is the brain

// ----- Coach configuration (single source of truth) -------------------------

const COACH_VOICE_ID = '11labs-Monika'

const COACH_PROMPT = `You are Monika, a warm and patient AI speech coach for The Rollr Academy at TopSpeech Health. You help adults working on rhotacism — the R sound.

CORE PRINCIPLES:
- Never tell the user they were "wrong." Use language like "almost there," "good try," "let's try that one again."
- The user is working on a real vulnerability. Protect their dignity in every response.
- Keep responses short — 1 to 2 sentences. Speech therapy is a doing practice, not a talking one.
- After the user says a word, give ONE specific cue: tongue position, lip shape, jaw, or breath.
- If they sound frustrated, validate it: "That one IS tough. Take a breath."
- Use real SLP techniques: minimal pairs (rabbit vs wabbit), slow-then-fast, mirror placement.

WHAT TO ACTUALLY DO:
1. Greet them warmly and invite them to say "rabbit" slowly.
2. After their attempt, offer ONE specific motor cue.
3. Ask them to try again, or to move to a sentence: "The rabbit ran around the red barn."
4. Praise effort and progress, never perfection.

YOUR OPENER (always start with this — be calm, never rushed):
"Hi, I'm Monika. I'm here to coach you through the R sound at your own pace. Whenever you're ready, try saying 'rabbit' for me — take it slowly."

REMEMBER: the user judges themselves. You are a coach, not a judge.`

const RETELL_BEGIN_MESSAGE =
  "Hi, I'm Monika. I'm here to coach you through the R sound at your own pace. Whenever you're ready, try saying rabbit for me — take it slowly."

// ----- Helpers ----------------------------------------------------------------

const RETELL_BASE = 'https://api.retellai.com'

async function retell(path, { method = 'GET', body, apiKey } = {}) {
  const res = await fetch(`${RETELL_BASE}${path}`, {
    method,
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type':  'application/json'
    },
    body: body ? JSON.stringify(body) : undefined
  })
  let data = null
  try { data = await res.json() } catch { /* may be empty */ }
  return { ok: res.ok, status: res.status, data }
}

// Patch the agent (voice) and its LLM (prompt) so all behavior is code-driven.
// Best-effort: if Retell rejects the patches, we still try to create the call —
// the dashboard config will be used as fallback.
async function configureAgent({ apiKey, agentId }) {
  // 1. Fetch the agent so we know which LLM it uses.
  const agentRead = await retell(`/get-agent/${agentId}`, { apiKey })
  const llmId =
    agentRead.data?.response_engine?.llm_id ||
    agentRead.data?.llm_id

  // 2. Patch the agent's voice + opening line.
  await retell(`/update-agent/${agentId}`, {
    method: 'PATCH',
    apiKey,
    body: {
      voice_id:       COACH_VOICE_ID,
      begin_message:  RETELL_BEGIN_MESSAGE
    }
  })

  // 3. Patch the LLM's system prompt (only possible if it's a retell-llm).
  if (llmId) {
    await retell(`/update-retell-llm/${llmId}`, {
      method: 'PATCH',
      apiKey,
      body: {
        general_prompt: COACH_PROMPT,
        begin_message:  RETELL_BEGIN_MESSAGE
      }
    })
  }
}

// ----- Handler ----------------------------------------------------------------

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'method_not_allowed' })
  }

  const apiKey  = process.env.RETELL_API_KEY  || process.env.retellai_api
  const agentId = process.env.RETELL_AGENT_ID || process.env.retellai_agent_id

  if (!apiKey || !agentId) {
    return res.status(503).json({
      error: 'voice-coach-unavailable',
      message: 'Premium voice coach is not configured for this deployment.'
    })
  }

  // Best-effort: configure agent voice + prompt from our code constants.
  // Failures here don't block the call — the agent's dashboard config will be used.
  try {
    await configureAgent({ apiKey, agentId })
  } catch (err) {
    console.warn('[retell] could not patch agent config', err)
  }

  // Create the actual web call session.
  const call = await retell('/v2/create-web-call', {
    method: 'POST',
    apiKey,
    body: { agent_id: agentId }
  })

  if (!call.ok) {
    console.error('[retell] create-web-call failed', call.status, call.data)
    return res.status(502).json({
      error: 'voice-coach-failed',
      message: 'The voice coach is briefly unavailable. Please try again.'
    })
  }

  if (!call.data?.access_token) {
    return res.status(502).json({
      error: 'voice-coach-failed',
      message: 'The coach session could not be opened.'
    })
  }

  // Return ONLY what the client needs — never expose the API key.
  return res.status(200).json({
    access_token: call.data.access_token,
    call_id:      call.data.call_id
  })
}
