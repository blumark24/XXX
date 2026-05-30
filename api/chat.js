// Vercel Serverless Function - n8n AI Chat Proxy
// No env vars needed - calls n8n webhook directly

const N8N_WEBHOOK = 'https://n8n-production-5f31.up.railway.app/webhook/website-chat';
const REPLY_FIELDS = ['reply', 'text', 'message', 'output', 'response', 'data'];

function extractReply(value, seen = new Set()) {
  if (typeof value === 'string') {
    const reply = value.trim();
    return reply || null;
  }

  if (!value || typeof value !== 'object' || seen.has(value)) return null;
  seen.add(value);

  if (Array.isArray(value)) {
    for (const item of value) {
      const reply = extractReply(item, seen);
      if (reply) return reply;
    }
    return null;
  }

  for (const field of REPLY_FIELDS) {
    if (Object.prototype.hasOwnProperty.call(value, field)) {
      const reply = extractReply(value[field], seen);
      if (reply) return reply;
    }
  }

  return null;
}

function describeResponseShape(value) {
  if (Array.isArray(value)) return `array(length=${value.length})`;
  if (value && typeof value === 'object') return `object(keys=${Object.keys(value).slice(0, 10).join(',') || 'none'})`;
  return typeof value;
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { messages, sessionId } = req.body || {};

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Missing messages array' });
  }

  // Get the latest user message from the chat history.
  const lastUserMessage = [...messages].reverse().find((message) => message.role === 'user');
  if (!lastUserMessage?.content) {
    return res.status(400).json({ error: 'No user message found' });
  }

  // Preserve an existing session ID when the frontend sends one; otherwise create a lightweight web session.
  const session = sessionId || `web_${Date.now()}`;

  try {
    console.info('[chat proxy] sending POST request to n8n', { platform: 'Website' });
    const upstream = await fetch(N8N_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: session,
        message: lastUserMessage.content,
        name: 'زائر الموقع',
        platform: 'Website'
      })
    });

    const contentType = upstream.headers.get('content-type') || 'unknown';
    const rawBody = await upstream.text();
    let data = {};

    try {
      data = rawBody ? JSON.parse(rawBody) : {};
    } catch (_parseError) {
      console.error('[chat proxy] n8n returned non-JSON response', {
        status: upstream.status,
        contentType,
        bodyLength: rawBody.length
      });
      return res.status(502).json({ error: 'Invalid response from AI service' });
    }

    const responseShape = describeResponseShape(data);
    if (!upstream.ok) {
      console.error('[chat proxy] n8n request failed', {
        status: upstream.status,
        contentType,
        responseShape
      });
      return res.status(502).json({ error: 'n8n request failed' });
    }

    const reply = extractReply(data);
    if (!reply) {
      console.error('[chat proxy] n8n response did not contain a supported reply field', {
        status: upstream.status,
        contentType,
        responseShape
      });
      return res.status(502).json({ error: 'Empty response from AI service' });
    }

    console.info('[chat proxy] n8n response accepted', {
      status: upstream.status,
      contentType,
      responseShape
    });
    return res.status(200).json({ text: reply });
  } catch (err) {
    console.error('[chat proxy] failed to reach n8n', { message: err.message });
    return res.status(500).json({ error: 'Failed to reach AI service' });
  }
};
