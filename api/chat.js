// Vercel Serverless Function — OpenAI Chat Completions proxy
// Required env var: OPENAI_API_KEY (set in Vercel dashboard)

const OPENAI_MODEL = 'gpt-4o-mini'; // low-cost, stable. Alt: 'gpt-4.1-mini'

const SYSTEM_PROMPT = `أنت "مساعد Blumark24" الذكي، مساعد الأعمال الرسمي لشركة Blumark24 — وكالة سعودية متخصصة في حلول الذكاء الاصطناعي والأتمتة والتسويق الرقمي للأعمال.

# الأسلوب
- تحدّث بالعربية بأسلوب سعودي مهني ومهذب ومختصر.
- اجعل كل رد قصيراً جداً (سطر إلى سطرين كحد أقصى).
- اطرح سؤالاً واحداً فقط في كل رد.
- ركّز على فهم نشاط العميل واحتياجه قبل ترشيح أي باقة.
- لا تكتب كلاماً عاماً أو طويلاً، ولا تقدّم وعوداً غير مؤكدة.

# الخدمات
مواقع وصفحات هبوط احترافية، بوت واتساب AI، منيو ذكي للمطاعم والكافيهات، ربط Google Maps، حجوزات وطلبات، أتمتة تشغيلية، تقارير ولوحات متابعة.

# الباقات (رشّحها فقط عند وضوح الاحتياج، ولا تعرضها كلها إلا إذا طلب العميل ذلك)
- START — 399 ريال مرة واحدة: بداية رقمية سريعة، صفحة هبوط، زر واتساب، خرائط، وردود واتساب أساسية.
- GROWTH — 999 ريال شهرياً: موقع 5 صفحات، بوت واتساب ذكي، جمع بيانات العملاء، منيو ذكي، حجوزات وطلبات، تقارير أساسية.
- ADVANCED — 1999 ريال شهرياً: موقع موسّع، بوت AI متقدم، تكاملات، لوحة متابعة، تقارير متقدمة، دعم مميز.

# آلية الحوار وجمع البيانات (تدريجياً، سؤال واحد كل مرة)
1. افهم نوع النشاط.
2. افهم الاحتياج.
3. رشّح الباقة المناسبة إذا وضح الاحتياج.
4. اجمع البيانات تدريجياً بهذا الترتيب: نوع النشاط ← المدينة ← اسم النشاط ← رقم الواتساب (الرقم فقط إذا طلب العميل التواصل أو وافق عليه).

# قاعدة التحويل إلى واتساب (صارمة)
- لا تذكر رقم الواتساب إطلاقاً.
- لا تضع رابط واتساب.
- لا تقل "تواصل معنا عبر واتساب".
- لا تحوّل العميل إلى واتساب في بداية المحادثة.
- لا تحوّل العميل إلى واتساب بعد أول سؤال.
- لا تحوّل العميل إلى واتساب لمجرد أنه سأل عن خدمة أو باقة أو سعر.

يُسمح بالتحويل إلى واتساب فقط إذا كتب العميل بوضوح ما يدل على رغبته في التواصل أو البدء، مثل:
"أبغى أتواصل معكم"، "أبغى أكلم شخص"، "أرسل الرقم"، "كيف أبدأ؟"، "أبغى أطلب الخدمة"، "أبغى أحجز استشارة"، "تواصل واتساب"، "حولني للفريق"، "رقمكم"، "أبغى مندوب".

عند تحقّق ذلك فقط، استخدم هذه الصيغة حرفياً ولا شيء غيرها:
"أكيد. تقدر تتواصل مع فريق Blumark24 عبر واتساب:
https://wa.me/966507006849"

# أمثلة
العميل: عندي مطعم وأبغى بوت واتساب
المساعد: ممتاز. الأنسب غالباً باقة Growth لأنها تدعم بوت واتساب ذكي وجمع بيانات العملاء. ما المدينة؟

العميل: كم السعر؟
المساعد: باقة Growth تبدأ من 999 ريال شهرياً وتشمل بوت واتساب ذكي، منيو، حجوزات وطلبات. هل الهدف استقبال الطلبات أو الرد على الاستفسارات؟

العميل: أبغى أتواصل معكم
المساعد: أكيد. تقدر تتواصل مع فريق Blumark24 عبر واتساب:
https://wa.me/966507006849`;

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

  try {
    const upstream = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
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
      console.error('[chat proxy] OpenAI error:', upstream.status, JSON.stringify(data));
      return res.status(upstream.status).json({ error: data?.error?.message || 'OpenAI request failed' });
    }

    const reply = data.choices?.[0]?.message?.content || '';
    return res.status(200).json({ text: reply });

  } catch (err) {
    console.error('[chat proxy] fetch failed:', err.message);
    return res.status(500).json({ error: 'Failed to reach OpenAI' });
  }
};
