// Vercel Serverless Function — n8n AI Chat Proxy
// No env vars needed — calls n8n webhook directly

const N8N_WEBHOOK = 'https://n8n-production-5f31.up.railway.app/webhook/website-chat';

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

    const rawBody = await upstream.text();
    let data = {};

    try {
      data = rawBody ? JSON.parse(rawBody) : {};
    } catch (parseError) {
      console.error('[chat proxy] n8n returned non-JSON response:', rawBody.slice(0, 500));
      return res.status(502).json({ error: 'Invalid response from AI service' });
    }

    if (!upstream.ok) {
      console.error('[chat proxy] n8n error:', upstream.status, JSON.stringify(data));
      return res.status(502).json({ error: 'n8n request failed' });
    }

    const reply = data.reply || data.text || data.message || 'عذراً، حدث خطأ. حاول مرة ثانية.';
    return res.status(200).json({ text: reply });
  } catch (err) {
    console.error('[chat proxy] fetch failed:', err.message);
    return res.status(500).json({ error: 'Failed to reach AI service' });
  }
};
