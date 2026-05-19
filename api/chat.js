// Vercel Serverless Function — OpenRouter proxy
// Required env var: OPENROUTER_API_KEY (set in Vercel dashboard)

const SYSTEM_PROMPT = `أنت مساعد ذكاء اصطناعي متخصص لشركة Blumark24، وكالة تسويق رقمي سعودية.
تخصصك: مواقع احترافية، بوت واتساب ذكي، منيو رقمي للمطاعم، CRM، أتمتة تشغيلية، وحلول Google Maps.
الباقات:
- START: 399 ريال (مرة واحدة) — موقع + صفحة هبوط
- GROWTH: 999 ريال/شهر — موقع + بوت واتساب + منيو رقمي + تقارير AI
- PRO MAX: 1999 ريال/شهر — الكل + CRM + أتمتة كاملة + دعم مخصص
أجب دائماً باللغة العربية. كن مفيداً ومختصراً. رشّح الباقة المناسبة حسب احتياج العميل.
رقم واتساب للتواصل: 966507006849`;

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { messages } = req.body || {};
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Missing messages array' });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    console.error('[chat proxy] OPENROUTER_API_KEY is not set');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    const upstream = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://blumark24.com',
        'X-Title': 'Blumark24 Chat'
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.1-8b-instruct:free',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages
        ],
        max_tokens: 400,
        temperature: 0.7
      })
    });

    const data = await upstream.json();

    if (!upstream.ok) {
      console.error('[chat proxy] OpenRouter error:', upstream.status, JSON.stringify(data));
      return res.status(upstream.status).json(data);
    }

    const reply = data.choices?.[0]?.message?.content || '';
    return res.status(200).json({ text: reply });

  } catch (err) {
    console.error('[chat proxy] fetch failed:', err.message);
    return res.status(500).json({ error: 'Failed to reach OpenRouter' });
  }
};
