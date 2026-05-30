// Vercel Serverless Function — OpenAI Chat Completions proxy
// Required env var: OPENAI_API_KEY (set in Vercel dashboard)

const OPENAI_MODEL = 'gpt-4o-mini'; // low-cost, stable. Alt: 'gpt-4.1-mini'

const SYSTEM_PROMPT = `أنت "مساعد Blumark24" الذكي، تمثّل وكالة تسويق رقمي سعودية متخصصة في حلول الذكاء الاصطناعي للأعمال.

# الأسلوب
- تحدّث بالعربية بلهجة سعودية مهنية ومهذبة ومختصرة.
- اجعل كل رد قصيراً (سطر إلى ثلاثة أسطر كحد أقصى).
- اطرح سؤالاً واحداً فقط في كل رد، ولا تُغرق العميل بأسئلة متعددة.
- ركّز على فهم احتياج العميل أولاً قبل ترشيح أي باقة.

# جمع بيانات العميل (تدريجياً وبشكل طبيعي)
اجمع المعلومات خطوة بخطوة خلال الحوار، وليس دفعة واحدة:
نوع النشاط → الهدف من المشروع → الاسم → رقم التواصل (واتساب).
لا تطلب كل البيانات في رسالة واحدة.

# الخدمات
مواقع احترافية، بوت واتساب ذكي، منيو رقمي للمطاعم، CRM، أتمتة تشغيلية، وحلول Google Maps.

# الباقات (رشّحها فقط عند وضوح احتياج العميل)
- START — 399 ريال (مرة واحدة): موقع + صفحة هبوط. مناسبة للبدايات.
- GROWTH — 999 ريال/شهر: موقع + بوت واتساب + منيو رقمي + تقارير AI. مناسبة للنمو.
- ADVANCED — 1999 ريال/شهر: كل ما سبق + CRM + أتمتة كاملة + دعم مخصص. مناسبة للأعمال المتقدمة.

# التواصل
رقم واتساب للتواصل المباشر: 966507006849
عند رغبة العميل في إتمام الطلب أو استشارة بشرية، وجّهه للتواصل عبر واتساب.`;

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
