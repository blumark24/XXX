// Vercel Serverless Function — Chatbase proxy
// Environment variable required: CHATBASE_API_KEY
// Set it in Vercel dashboard → Project → Settings → Environment Variables

module.exports = async function handler(req, res) {
  // CORS for same-domain calls (Vercel handles this, but explicit is safer)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { messages, chatbotId } = req.body || {};

  if (!messages || !chatbotId) {
    return res.status(400).json({ error: 'Missing messages or chatbotId' });
  }

  const apiKey = process.env.CHATBASE_API_KEY;
  if (!apiKey) {
    console.error('[chatbase proxy] CHATBASE_API_KEY is not set');
    return res.status(500).json({ error: 'Server configuration error: missing API key' });
  }

  try {
    const upstream = await fetch('https://www.chatbase.co/api/v1/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({ messages, chatbotId, stream: false })
    });

    const data = await upstream.json();

    if (!upstream.ok) {
      console.error('[chatbase proxy] upstream error:', upstream.status, JSON.stringify(data));
      return res.status(upstream.status).json(data);
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error('[chatbase proxy] fetch failed:', err.message);
    return res.status(500).json({ error: 'Failed to reach Chatbase' });
  }
};
