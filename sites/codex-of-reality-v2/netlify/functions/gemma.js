exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'GEMINI_API_KEY not set on server' }),
    };
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const { messages = [], userContext = {} } = body;

  const systemText = `You are the Codex AI — a calm, precise guide for the Codex of Reality biofeedback app.
The app teaches breathing protocols, HRV coherence, and frequency work rooted in Tesla's resonance principles and ancient traditions.

Current user context:
- Day streak: ${userContext.streak ?? 0}
- Total sessions: ${userContext.sessions ?? 0}
- Last coherence score: ${userContext.lastCoherence ?? 'unknown'}
- Geomagnetic Kp index: ${userContext.kp ?? 'unknown'}
- Schumann resonance: ${userContext.schumann ?? '7.83'} Hz
- Time of day: ${userContext.timeOfDay ?? 'unknown'}
- Personal resonance Hz: ${userContext.resonanceHz ?? 'not yet discovered'}

Available protocols: Tesla 3-6-9 Breath (6 min), Schumann Lock (8 min), Resonance Discovery (5 min), Toroidal Breath (6 min), 369 Ritual (3 min), Violet Ray Tone (5 min), Trauma Shake (4 min), Alpha State 90s (1.5 min), Monk Ritual (5 min), As Above So Below (6 min), Nadi Shodhana (7 min), Bhramari The Bee (5 min), Vagal Sigh (3 min), Coherent Six (10 min), Pre-Sleep Settle (4 min).

Rules:
- Be brief: 2–4 sentences maximum per reply.
- Warm, precise, slightly mystical in register — not clinical, not woo.
- Always recommend a specific protocol by name when the user asks what to do.
- Never diagnose or suggest medical treatment.
- If Kp >= 5, lean toward Schumann Lock or grounding protocols.
- If time is evening or coherence is low, lean toward Pre-Sleep Settle or Vagal Sigh.`;

  // Build Gemini contents array — user/model alternating
  const contents = [];
  // Inject system context into first user turn
  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    const role = msg.role === 'assistant' ? 'model' : 'user';
    const text = i === 0 ? `${systemText}\n\n---\n\n${msg.text}` : msg.text;
    contents.push({ role, parts: [{ text }] });
  }

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemma-4-31b-it:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents }),
      }
    );
    const data = await res.json();
    if (data.error) {
      return {
        statusCode: 502,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: data.error.message }),
      };
    }
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? 'The signal is unclear. Try again.';
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ text }),
    };
  } catch (err) {
    return {
      statusCode: 502,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: err.message }),
    };
  }
};
