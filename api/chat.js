// Vercel Serverless Function - Gemini API proxy
// Required env var: GEMINI_API_KEY

const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const SYSTEM_PROMPT = `أنت "Blumark AI"، مساعد الأعمال الذكي الرسمي لشركة Blumark24.

تحدث بالعربية أولاً وبأسلوب سعودي مهني وواضح.
اجعل ردودك قصيرة جداً، وغالباً في سطر أو سطرين فقط.
اسأل سؤالاً واحداً فقط في كل مرة.
ابدأ بفهم نوع نشاط العميل واحتياجه.
رشح باقة واحدة مناسبة فقط عند الحاجة: START أو GROWTH أو ADVANCED.
اجمع البيانات تدريجياً دون إزعاج العميل: نوع النشاط، المدينة، الاسم، رقم الواتساب.
لا تكتب كلاماً عاماً أو طويلاً، ولا تقدم وعوداً غير مؤكدة.

خدمات Blumark24 تشمل المواقع وصفحات الهبوط، بوت واتساب AI، المنيو الذكي، تحسين Google Maps، الحجوزات والطلبات، الأتمتة التشغيلية، والتقارير.

الباقات:
START: بداية رقمية سريعة للأعمال الصغيرة.
GROWTH: موقع وبوت واتساب ذكي وجمع بيانات وحجوزات وتقارير أساسية.
ADVANCED: حلول موسعة وتكاملات وتقارير متقدمة ودعم مميز.

إذا طلب العميل التواصل مع شخص، وجهه إلى واتساب: 966507006849.`;

function normalizeMessages(messages) {
  return messages
    .filter((message) => message && typeof message.content === 'string')
    .map((message) => ({
      role: message.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: message.content.slice(0, 4000) }]
    }))
    .slice(-12);
}

function extractReply(data) {
  return data?.candidates?.[0]?.content?.parts
    ?.map((part) => part.text || '')
    .join('')
    .trim();
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

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('[chat proxy] GEMINI_API_KEY is not set');
    return res.status(500).json({ error: 'Server configuration error: missing GEMINI_API_KEY' });
  }

  const conversation = normalizeMessages(messages);
  if (conversation.length === 0) {
    return res.status(400).json({ error: 'No valid messages found' });
  }

  try {
    const upstream = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: SYSTEM_PROMPT }]
        },
        contents: conversation,
        generationConfig: {
          maxOutputTokens: 300,
          temperature: 0.5
        }
      })
    });

    const data = await upstream.json().catch(() => ({}));

    if (!upstream.ok) {
      console.error('[chat proxy] Gemini request failed', {
        status: upstream.status,
        apiStatus: data?.error?.status || 'unknown',
        code: data?.error?.code || 'unknown'
      });
      return res.status(upstream.status).json({ error: data?.error?.message || 'Gemini request failed' });
    }

    const reply = extractReply(data);
    if (!reply) {
      console.error('[chat proxy] Gemini returned empty reply', {
        finishReason: data?.candidates?.[0]?.finishReason || 'unknown'
      });
      return res.status(502).json({ error: 'Empty response from AI service' });
    }

    return res.status(200).json({ text: reply });
  } catch (err) {
    console.error('[chat proxy] failed to reach Gemini', { message: err.message });
    return res.status(500).json({ error: 'Failed to reach AI service' });
  }
};
