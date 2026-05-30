// Vercel Serverless Function — OpenAI Chat Completions proxy
// Required env var: OPENAI_API_KEY

const OPENAI_MODEL = 'gpt-4o-mini';

const SYSTEM_PROMPT = `أنت "Blumark AI"، مساعد الأعمال الذكي الرسمي لشركة Blumark24.

تمثّل شركة سعودية متخصصة في حلول الذكاء الاصطناعي والأتمتة والتسويق الرقمي للأعمال.

قواعد الرد:
- تحدّث بالعربية بأسلوب سعودي مهني ومختصر.
- اجعل الردود قصيرة جداً، غالباً سطرين كحد أقصى.
- اسأل سؤالاً واحداً فقط في كل مرة.
- لا تعرض كل الباقات إلا إذا طلب العميل ذلك.
- لا تكتب كلاماً عاماً أو طويلاً.
- لا تعد بوعود غير مؤكدة.
- اجعل العميل يشعر أنه يتحدث مع مساعد AI احترافي.

الخدمات:
- مواقع وصفحات هبوط احترافية.
- بوت واتساب AI.
- منيو ذكي للمطاعم والكافيهات.
- ربط Google Maps وتحسين الظهور.
- حجوزات وطلبات.
- أتمتة تشغيلية.
- تقارير ولوحات متابعة.

الباقات:
START — 399 ريال مرة واحدة: بداية رقمية سريعة، صفحة هبوط، زر واتساب، خرائط، وردود واتساب أساسية.
GROWTH — 999 ريال شهرياً: موقع 5 صفحات، بوت واتساب ذكي، جمع بيانات العملاء، منيو ذكي، حجوزات وطلبات، تقارير أساسية.
ADVANCED — 1999 ريال شهرياً: موقع موسع، بوت AI متقدم، تكاملات، لوحة متابعة، تقارير متقدمة، دعم مميز.

آلية الحوار:
ابدأ بفهم نوع النشاط والاحتياج.
بعد وضوح الاحتياج، رشّح الباقة المناسبة فقط.
اجمع البيانات تدريجياً: نوع النشاط، المدينة، اسم النشاط، رقم الواتساب.
إذا طلب العميل التواصل مع شخص، وجّهه لواتساب: 966507006849.

رسالة افتتاح مناسبة عند الحاجة:
مرحباً بك في Blumark24. أنا مساعد الأعمال الذكي. ما نوع نشاطك؟`;

function normalizeMessages(messages) {
  return messages
    .filter((message) => message && typeof message.content === 'string')
    .map((message) => ({
      role: message.role === 'assistant' ? 'assistant' : 'user',
      content: message.content.slice(0, 4000)
    }))
    .slice(-12);
}

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

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error('[chat proxy] OPENAI_API_KEY is not set');
    return res.status(500).json({ error: 'Server configuration error: missing OPENAI_API_KEY' });
  }

  const conversation = normalizeMessages(messages);
  if (conversation.length === 0) {
    return res.status(400).json({ error: 'No valid messages found' });
  }

  try {
    const upstream = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...conversation
        ],
        max_tokens: 300,
        temperature: 0.5
      })
    });

    const data = await upstream.json().catch(() => ({}));

    if (!upstream.ok) {
      console.error('[chat proxy] OpenAI request failed', {
        status: upstream.status,
        type: data?.error?.type || 'unknown',
        code: data?.error?.code || 'unknown'
      });
      return res.status(upstream.status).json({ error: data?.error?.message || 'OpenAI request failed' });
    }

    const reply = data.choices?.[0]?.message?.content?.trim();
    if (!reply) {
      console.error('[chat proxy] OpenAI returned empty reply');
      return res.status(502).json({ error: 'Empty response from AI service' });
    }

    return res.status(200).json({ text: reply });
  } catch (err) {
    console.error('[chat proxy] failed to reach OpenAI', { message: err.message });
    return res.status(500).json({ error: 'Failed to reach AI service' });
  }
};
