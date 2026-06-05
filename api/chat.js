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

خدمات Blumark24 تشمل المواقع وصفحات الهبوط، بوت واتساب AI، المنيو الذكي، تحسين Google Maps، الحجوزات والطلبات، الأتمتة التشغيلية، والتقارير، ونظام Blumark24 OS لإدارة الأعمال.
ممنوع كتابة رابط Blumark24 OS كنص. إذا احتجت ذكر منتج OS اكتب فقط: Blumark24 OS لإدارة الأعمال (بدون رابط).

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
    name: 'greeting',
    keywords: [
      'سلام',
      'السلام عليكم',
      'هلا',
      'أهلا',
      'اهلا',
      'أهلاً',
      'مرحبا',
      'مرحباً',
      'الو',
      'هاي'
    ],
    text: 'وعليكم السلام. أهلاً بك في Blumark24. كيف أقدر أخدمك اليوم؟'
  },
  {
    name: 'restaurant',
    keywords: ['مطعم', 'مطهم', 'مطاعم'],
    text: 'مناسب. للمطاعم نرشح موقع سريع + منيو ذكي + واتساب AI لتنظيم الطلبات والردود. هل عندك منيو جاهز؟'
  },
  {
    name: 'cafe',
    keywords: ['كافيه', 'مقهى', 'قهوة'],
    text: 'مناسب. للكافيهات نرشح منيو ذكي + واتساب AI + خرائط Google لزيادة الطلبات والزيارات. هل عندك منيو جاهز؟'
  },
  {
    name: 'pharmacy',
    keywords: ['صيدلية', 'صيدليه', 'صيدليات', /pharmacy/i],
    text: 'مناسب. للصيدليات نرشح موقع تعريفي + واتساب AI للرد على الاستفسارات وتنظيم الطلبات. هل عندك خدمة توصيل حالياً؟'
  },
  {
    name: 'clinic',
    keywords: ['عيادة', 'عيادات', 'مركز طبي', 'طبيب'],
    text: 'مناسب. للعيادات نرشح حجز مواعيد + واتساب AI + ربط Google Maps لتسهيل وصول العملاء. هل تحتاج حجوزات أم ردود فقط؟'
  },
  {
    name: 'store',
    keywords: ['متجر', 'محل', 'تجارة', 'بيع'],
    text: 'مناسب. للمتاجر نرشح صفحة احترافية + واتساب AI لتنظيم الطلبات والاستفسارات. هل البيع عندك عبر واتساب حالياً؟'
  },
  {
    name: 'car_wash',
    keywords: ['مغسلة سيارات', 'مغسله سيارات', 'غسيل سيارات', 'مغسلة'],
    text: 'مناسب. نرشح لك موقع سريع + حجز مواعيد + واتساب AI لتنظيم الطلبات. هل عندك خدمة حجز حالياً؟'
  },
  {
    name: 'hotel',
    keywords: ['فندق', 'فنادق', 'شقق مفروشة', 'شقق'],
    text: 'مناسب. للفنادق نرشح موقع تعريفي + واتساب AI + حجوزات ذكية وتنظيم استفسارات العملاء. هل تستقبلون الحجوزات عبر واتساب حالياً؟'
  },
  {
    name: 'salon',
    keywords: ['صالون', 'مشغل', 'حلاق', 'سبا'],
    text: 'مناسب. نرشح لك حجوزات ذكية + واتساب AI + صفحة تعريفية للخدمات والأسعار. هل عندك نظام حجز حالياً؟'
  },
  {
    name: 'company',
    keywords: ['شركة', 'مؤسسة', 'مكتب'],
    text: 'مناسب. نقدر نساعدك بموقع احترافي + أتمتة تواصل + تقارير وتنظيم العملاء. ما أهم هدف عندك حالياً؟'
  },
  {
    name: 'how_help',
    keywords: ['كيف تخدمني', 'كيف تفيدني', 'وش تقدمون لي', 'كيف تساعدني', 'ايش تسوون', 'وش خدماتكم'],
    text: 'نساعدك ببناء حضور رقمي يجيب عملاء: موقع، واتساب AI، منيو ذكي، حجوزات، وتحسين ظهورك في Google. ما نوع نشاطك؟'
  },
  {
    name: 'wellbeing',
    keywords: ['كيفك', 'كيف الحال', 'كيفك يا حب'],
    text: 'بخير، الله يسعدك. جاهز أساعدك في اختيار الحل الأنسب لنشاطك.'
  },
  {
    name: 'who_are_you',
    keywords: ['من أنتم', 'مين أنتم', 'وش شركتكم'],
    text: 'Blumark24 شركة سعودية تقدم حلول ذكاء اصطناعي للأعمال: مواقع احترافية، واتساب AI، منيو ذكي، أتمتة، وتقارير نمو. ما نوع نشاطك؟'
  },
  {
    name: 'how_generic',
    keywords: ['كيف', 'كيف يعني'],
    text: 'تقصد كيف نقدر نخدم نشاطك؟ نبدأ بفهم نوع نشاطك ثم نرشح لك الحل الأنسب: موقع، واتساب AI، حجوزات، أو أتمتة.'
  },
  {
    name: 'acknowledgement',
    keywords: ['اي', 'نعم', 'تمام', 'اوك', 'طيب'],
    text: 'تمام. ما نوع نشاطك التجاري عشان أحدد لك الحل الأنسب؟'
  },
  {
    name: 'unsure',
    keywords: ['ماعرف', 'مدري', 'لا'],
    text: 'ولا يهمك. اكتب لي نوع نشاطك فقط، مثل: مطعم، عيادة، متجر، كافيه، أو صيدلية.'
  },
  {
    name: 'os',
    keywords: [
      'Blumark24 OS',
      'blumark24 os',
      'بلومارك او اس',
      'بلومارك OS',
      /\bOS\b/,
      /\bos\b/,
      'نظام إدارة الأعمال',
      'إدارة الأعمال',
      'نظام ادارة الاعمال',
      'ادارة الاعمال',
      'منصة إدارة الأعمال',
      'برنامج إدارة الأعمال'
    ],
    text: 'Blumark24 OS هو نظام تشغيل أعمال عربي مدعوم بالذكاء الاصطناعي، يساعد المنشآت على إدارة العملاء والموظفين والمهام والهيكل الإداري من منصة واحدة آمنة متعددة العملاء، مع مساعد تنفيذي ذكي يحلل بيانات المنشأة ويقترح قرارات تشغيلية قابلة للتنفيذ.\n\nهل ترغب بمعرفة كيف يخدم نشاطك تحديداً؟'
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
    text: 'خدمات Blumark24:\n\n• مواقع وصفحات هبوط احترافية\n• بوت واتساب AI\n• منيو ذكي للمطاعم والكافيهات\n• ربط Google Maps\n• حجوزات وطلبات\n• تقارير ولوحات متابعة\n• [[BLUMARK24_OS_LINK]]\n\nما نوع نشاطك؟'
  }
];

function matchShortcut(text) {
  if (!text || typeof text !== 'string') return null;
  for (const route of SHORTCUT_ROUTES) {
    for (const kw of route.keywords) {
      const hit = kw instanceof RegExp ? kw.test(text) : text.includes(kw);
      if (hit) return route.text;
    }
  }
  return null;
}

const REASONING_LEAK_PATTERNS = [
  /\bTHOUGHT\b/i,
  /\bThought\b/i,
  /\breasoning\b/i,
  /chain[\s-]?of[\s-]?thought/i,
  /The user has provided/i,
  /The user has/i,
  /The user is/i,
  /I need to/i,
  /I should/i,
  /A good next step/i,
  /Now I need/i,
  /Given the/i,
  /Let me/i,
  /analysis/i,
  /internal reasoning/i,
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

// Replace any raw Blumark24 OS URL Gemini might emit with the safe
// placeholder so the chat renderer turns it into the labeled anchor.
function maskOsUrl(text) {
  return text.replace(/https?:\/\/blumark24-os\.vercel\.app[^\s)"'،.]*\/?/gi, '[[BLUMARK24_OS_LINK]]');
}

const SAFE_FALLBACK_REPLY = 'فهمت عليك. اكتب لي نوع نشاطك أو الخدمة التي تحتاجها، وأنا أرشح لك الأنسب.';
const GENERAL_ACTIVITY_REPLY = 'مناسب. نقدر نساعدك بحضور رقمي وردود ذكية وتنظيم طلبات العملاء. ما الخدمة الأهم لك حالياً: موقع، واتساب AI، أو حجوزات؟';

function sanitizeReply(text) {
  if (!text || typeof text !== 'string') return SAFE_FALLBACK_REPLY;

  const cleaned = stripMarkdownLinks(maskOsUrl(text)).trim();
  if (!cleaned || hasReasoningLeak(cleaned)) return SAFE_FALLBACK_REPLY;

  return cleaned;
}

function shouldUseGeneralActivityReply(text) {
  const value = typeof text === 'string' ? text.trim() : '';
  if (!value) return false;
  if (value.length <= 24) return true;
  return /(عندي|عندنا|نشاط|مشروع|أبغى|ابغى|ابي|أحتاج|احتاج|عشوائي|غير مطابق)/i.test(value);
}

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
  if (req.method !== 'POST') return res.status(200).json({ text: SAFE_FALLBACK_REPLY });

  const { messages } = req.body || {};
  if (!messages || !Array.isArray(messages)) {
    return res.status(200).json({ text: SAFE_FALLBACK_REPLY });
  }

  const userMessage = lastUserMessageContent(messages);
  const shortcut = matchShortcut(userMessage);
  if (shortcut) {
    return res.status(200).json({ text: shortcut });
  }

  if (shouldUseGeneralActivityReply(userMessage)) {
    return res.status(200).json({ text: GENERAL_ACTIVITY_REPLY });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('[chat proxy] GEMINI_API_KEY is not set');
    return res.status(200).json({ text: SAFE_FALLBACK_REPLY });
  }

  const conversation = normalizeMessages(messages);
  if (conversation.length === 0) {
    return res.status(200).json({ text: SAFE_FALLBACK_REPLY });
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
      return res.status(200).json({ text: SAFE_FALLBACK_REPLY });
    }

    const rawReply = extractReply(data);
    if (!rawReply) {
      console.error('[chat proxy] Gemini returned empty reply', {
        finishReason: data?.candidates?.[0]?.finishReason || 'unknown'
      });
      return res.status(200).json({ text: SAFE_FALLBACK_REPLY });
    }

    const sanitizedReply = sanitizeReply(rawReply);
    if (sanitizedReply === SAFE_FALLBACK_REPLY && hasReasoningLeak(rawReply)) {
      console.warn('[chat proxy] reasoning leak detected, returning safe fallback');
    }

    return res.status(200).json({ text: sanitizedReply });
  } catch (err) {
    console.error('[chat proxy] failed to reach Gemini', { message: err.message });
    return res.status(200).json({ text: SAFE_FALLBACK_REPLY });
  }
};
