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

خدمات Blumark24 تشمل المواقع وصفحات الهبوط، بوت واتساب AI، المنيو الذكي، تحسين Google Maps، الحجوزات والطلبات، الأتمتة التشغيلية، والتقارير، ونظام Blumark24 OS لإدارة الأعمال (https://blumark24-os.vercel.app).

الباقات:
START: بداية رقمية سريعة للأعمال الصغيرة.
GROWTH: موقع وبوت واتساب ذكي وجمع بيانات وحجوزات وتقارير أساسية.
ADVANCED: حلول موسعة وتكاملات وتقارير متقدمة ودعم مميز.

سياسة توجيه أرقام واتساب — التزم بها حرفياً:

أ) رقم المبيعات والاستشارات والتواصل العام: https://wa.me/966507006849
استخدمه عند: استشارة مجانية، أبغى أبدأ، أبغى أتواصل، رقمكم، أبغى أطلب الخدمة، أبغى أكلم الفريق، عميل جديد، استفسار عن الباقات، استفسار عن الخدمات.
رد بهذه الصيغة بالضبط:
"أكيد. تقدر تبدأ باستشارة مجانية مع فريق Blumark24 عبر واتساب:
https://wa.me/966507006849"

ب) رقم الدعم الفني للعملاء المشتركين فقط: https://wa.me/966501910097
استخدمه فقط عند: أنا عميل مشترك، عندي مشكلة في الخدمة، الدعم الفني، النظام لا يعمل، البوت لا يعمل، أحتاج دعم لاشتراكي، متابعة اشتراك حالي.
رد بهذه الصيغة بالضبط:
"للدعم الفني وخدمة العملاء المشتركين، تقدر تتواصل عبر واتساب:
https://wa.me/966501910097"

قواعد صارمة:
لا تستخدم رقم الدعم 966501910097 مع العملاء الجدد أو طلبات الاستشارة المجانية.
لا تستخدم رقم المبيعات 966507006849 مع طلبات الدعم الفني للمشتركين.
لا تذكر الرقمين معاً في رد واحد. اختر الرقم المناسب لحالة العميل فقط.

قواعد إخراج صارمة:
ممنوع إظهار التفكير الداخلي أو شرح طريقة تفكيرك.
ممنوع استخدام كلمات مثل THOUGHT أو Thought أو reasoning أو chain-of-thought أو "تحليل داخلي" أو "أفكر" أو "سأحلل" داخل الرد.
أرسل النتيجة النهائية فقط، بدون مقدمات أو تعليق على نفسك.
ممنوع استخدام Markdown links مثل [نص](رابط). الروابط تظهر كنص خام فقط، مثل: https://wa.me/966507006849`;

// Deterministic shortcut routes — short-circuit Gemini for clear intents.
// Order matters:
//   1. Business-type signals (restaurant) qualify the lead before any handoff,
//      so "عندي مطعم وأبغى بوت واتساب" answers with the restaurant qualifier
//      instead of jumping straight to the sales link.
//   2. Support is checked before sales so "أنا عميل مشترك ... واتساب" is not
//      misrouted to the sales template.
const SHORTCUT_ROUTES = [
  {
    name: 'restaurant',
    keywords: ['مطعم'],
    text: 'مناسب. لمطعمك نرشح بوت واتساب + منيو ذكي لتنظيم الطلبات والردود. هل عندك منيو جاهز؟'
  },
  {
    name: 'support',
    keywords: [
      'أنا عميل مشترك',
      'عميل مشترك',
      'الدعم الفني',
      'عندي مشكلة في الخدمة',
      'النظام لا يعمل',
      'البوت لا يعمل',
      'متابعة اشتراك',
      'مشكلة تشغيلية',
      'خدمة العملاء',
      'دعم'
    ],
    text: 'للدعم الفني وخدمة العملاء المشتركين، تقدر تتواصل عبر واتساب:\nhttps://wa.me/966501910097'
  },
  {
    name: 'sales',
    keywords: [
      'استشارة مجانية',
      'أبغى استشارة',
      'احجز لي استشارة',
      'استشارة',
      'رقمكم',
      'رابط الواتساب',
      'واتساب',
      'أبغى أتواصل',
      'أبغى أبدأ',
      'أبغى أطلب الخدمة',
      'أبغى أكلم الفريق'
    ],
    text: 'أكيد. تقدر تبدأ باستشارة مجانية مع فريق Blumark24 عبر واتساب:\nhttps://wa.me/966507006849'
  },
  {
    name: 'packages',
    keywords: ['الباقات'],
    text: 'باقات Blumark24:\n\n1. START — 399 ريال\nبداية رقمية سريعة.\n2. GROWTH — 999 ريال شهرياً\nموقع + بوت واتساب + منيو ذكي.\n3. ADVANCED — 1999 ريال شهرياً\nأتمتة متقدمة + تقارير + تكاملات.\n\nما نوع نشاطك عشان أرشح لك الأنسب؟'
  },
  {
    name: 'services',
    keywords: ['الخدمات'],
    text: 'خدمات Blumark24:\n\n• مواقع وصفحات هبوط احترافية\n• بوت واتساب AI\n• منيو ذكي للمطاعم والكافيهات\n• ربط Google Maps\n• حجوزات وطلبات\n• تقارير ولوحات متابعة\n• Blumark24 OS لإدارة الأعمال:\nhttps://blumark24-os.vercel.app\n\nما نوع نشاطك؟'
  },
  {
    name: 'os',
    keywords: ['Blumark24 OS', 'نظام إدارة الأعمال', 'إدارة الأعمال', 'os'],
    text: 'Blumark24 OS هو نظام لإدارة الأعمال والعمليات والعملاء والمهام من مكان واحد:\nhttps://blumark24-os.vercel.app'
  }
];

function matchShortcut(text) {
  if (!text || typeof text !== 'string') return null;
  for (const route of SHORTCUT_ROUTES) {
    const haystack = text.toLowerCase();
    if (route.keywords.some((kw) => haystack.includes(kw.toLowerCase()))) return route.text;
  }
  return null;
}

const REASONING_LEAK_PATTERNS = [
  /THOUGHT\s*:/i,
  /\breasoning\b/i,
  /chain[\s-]?of[\s-]?thought/i,
  /تحليل داخلي/,
  /أفكر/,
  /سأحلل/
];

function hasReasoningLeak(text) {
  return REASONING_LEAK_PATTERNS.some((pattern) => pattern.test(text));
}

function stripMarkdownLinks(text) {
  return text.replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '$2');
}

const SAFE_FALLBACK_REPLY = 'واضح. أقدر أساعدك بتحديد الحل الأنسب. ما نوع نشاطك التجاري؟';

function lastUserMessageContent(messages) {
  for (let i = messages.length - 1; i >= 0; i--) {
    const m = messages[i];
    if (m && m.role === 'user' && typeof m.content === 'string') return m.content;
  }
  return '';
}

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

  const shortcut = matchShortcut(lastUserMessageContent(messages));
  if (shortcut) {
    return res.status(200).json({ text: shortcut });
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

    const rawReply = extractReply(data);
    if (!rawReply) {
      console.error('[chat proxy] Gemini returned empty reply', {
        finishReason: data?.candidates?.[0]?.finishReason || 'unknown'
      });
      return res.status(502).json({ error: 'Empty response from AI service' });
    }

    const sanitizedReply = stripMarkdownLinks(rawReply);
    if (hasReasoningLeak(sanitizedReply)) {
      console.warn('[chat proxy] reasoning leak detected, returning safe fallback');
      return res.status(200).json({ text: SAFE_FALLBACK_REPLY });
    }

    return res.status(200).json({ text: sanitizedReply });
  } catch (err) {
    console.error('[chat proxy] failed to reach Gemini', { message: err.message });
    return res.status(500).json({ error: 'Failed to reach AI service' });
  }
};
