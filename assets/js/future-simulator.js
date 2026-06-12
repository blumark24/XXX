/* ============================================================
   Blumark24 Business X-Ray — Standalone JS
   Fully self-contained. No globals polluted except `FS`.
   ============================================================ */
(function () {
  'use strict';

  const WAPHONE = '966507006849';

  /* ── Sector → pain-point opportunities map ── */
  const OPPS = {
    'مطعم': {
      'الردود':     ['تقليل وقت الرد عبر WhatsApp AI', 'ردود تلقائية على الطلبات الشائعة', 'تحسين تجربة العميل قبل الوصول'],
      'الحجوزات':  ['نظام حجز ذكي يمنع التعارض', 'تذكيرات آلية تقلل الغياب', 'تقرير إشغال يومي فوري'],
      'المبيعات':  ['منيو رقمي يرفع متوسط الطلب', 'Upsell آلي عبر واتساب', 'تقارير مبيعات تكشف الأطباق الأقوى'],
      'المتابعة':  ['CRM يجمع بيانات كل عميل', 'إشعارات تلقائية للعملاء المنتظمين', 'قياس رضا العملاء بعد الزيارة'],
      'التقارير':  ['تقرير يومي مبيعات وإيرادات', 'لوحة تحكم تكشف أوقات الذروة', 'تنبيه فوري عند انخفاض الأداء'],
      'التسويق':  ['حملات واتساب مستهدفة', 'تعزيز تلقائي لتقييمات Google', 'برنامج ولاء يرفع التكرار'],
    },
    'كافيه': {
      'الردود':     ['رد فوري على طلبات واتساب', 'قائمة رقمية تُجيب عن الأسئلة', 'تأكيد الطلب تلقائياً'],
      'الحجوزات':  ['جدول حجز طاولات ذكي', 'تذكيرات قبل الموعد', 'إدارة قائمة الانتظار آلياً'],
      'المبيعات':  ['عروض يومية تُرسل آلياً', 'Combo suggestions رقمية', 'تتبع أكثر المشروبات مبيعاً'],
      'المتابعة':  ['قاعدة عملاء منظمة', 'عيد ميلاد وإشعارات خاصة', 'متابعة العملاء غير النشطين'],
      'التقارير':  ['ملخص يومي آلي للإيرادات', 'مقارنة أداء الأسابيع', 'تنبيه انخفاض المخزون'],
      'التسويق':  ['ستوري واتساب يومي للعروض', 'تقييمات Google برمجياً', 'هاشتاق وحضور رقمي منظم'],
    },
    'عيادة': {
      'الردود':     ['استقبال AI يرد 24/7', 'أسئلة شائعة تُجاب تلقائياً', 'توجيه المريض للتخصص المناسب'],
      'الحجوزات':  ['حجوزات ذكية بلا تعارض', 'تذكيرات تقلل الغياب 60%', 'قائمة انتظار رقمية'],
      'المبيعات':  ['خدمات إضافية تُقترح آلياً', 'باقات علاجية ترفع الإيراد', 'متابعة ما بعد الزيارة'],
      'المتابعة':  ['ملف رقمي لكل مريض', 'تذكير بالجلسات القادمة', 'تقييم رضا المريض آلياً'],
      'التقارير':  ['تقرير زيارات وإيرادات أسبوعي', 'كشف أوقات الذروة والفراغ', 'إحصاءات طبية شاملة'],
      'التسويق':  ['حملات توعية صحية دورية', 'تقييمات Google للعيادة', 'برنامج إحالة المرضى'],
    },
    'متجر': {
      'الردود':     ['رد AI فوري على استفسارات المنتج', 'تتبع الطلب تلقائياً', 'حل شكاوى العملاء فوراً'],
      'الحجوزات':  ['مواعيد استلام منظمة', 'تنسيق التوصيل الذكي', 'تأكيد الطلب برسالة آلية'],
      'المبيعات':  ['توصيات Upsell ذكية', 'عروض مخصصة لكل عميل', 'ربط المخزون بالمبيعات'],
      'المتابعة':  ['CRM يتتبع سلوك الشراء', 'إشعار عودة المنتج المطلوب', 'ولاء يكافئ التكرار'],
      'التقارير':  ['تقرير مبيعات يومي تفصيلي', 'تنبيه نفاد المخزون', 'أداء كل منتج ومنطقة'],
      'التسويق':  ['حملات واتساب موسمية', 'تقييمات المنتج آلياً', 'إعلانات مستهدفة بالبيانات'],
    },
    'فندق': {
      'الردود':     ['مساعد AI للنزلاء 24/7', 'خدمة الغرف رقمياً', 'إجابة استفسارات الحجز فوراً'],
      'الحجوزات':  ['نظام حجز ذكي بلا تعارض', 'Check-in رقمي مريح', 'إدارة الغرف والإشغال آنياً'],
      'المبيعات':  ['خدمات إضافية تُعرض ذكياً', 'رفع متوسط الإقامة', 'باقات خاصة للمناسبات'],
      'المتابعة':  ['CRM لكل نزيل وتفضيلاته', 'مراسلة ما بعد المغادرة', 'تقييم التجربة آلياً'],
      'التقارير':  ['تقرير إشغال وإيرادات يومي', 'مقارنة أداء الأجنحة', 'تحليل مصادر الحجوزات'],
      'التسويق':  ['حملات موسمية مستهدفة', 'تعزيز تقييمات TripAdvisor', 'عروض Last-minute آلية'],
    },
    'شركة': {
      'الردود':     ['AI يرد على عملاء B2B فوراً', 'تأهيل Lead تلقائياً', 'توجيه العميل للمختص المناسب'],
      'الحجوزات':  ['جدولة اجتماعات ذكية', 'تذكيرات مواعيد العملاء', 'لوحة مواعيد الفريق'],
      'المبيعات':  ['Pipeline مبيعات واضح', 'متابعة Lead حتى الإغلاق', 'تقرير يكشف أفضل الفرص'],
      'المتابعة':  ['CRM يتتبع كل تفاعل', 'تنبيه عند توقف التواصل', 'ملف عميل شامل ومحدّث'],
      'التقارير':  ['KPIs أسبوعية آلية', 'أداء الفريق وكل مسؤول', 'تقرير خسائر وفرص مفقودة'],
      'التسويق':  ['حملات LinkedIn وواتساب', 'Case studies آلية', 'نظام إحالة وشراكات'],
    },
  };

  const PKG = {
    'مطعم': 'GROWTH — 999 ريال/شهر',
    'كافيه': 'GROWTH — 999 ريال/شهر',
    'عيادة': 'PRO MAX — 1999 ريال/شهر',
    'متجر':  'GROWTH — 999 ريال/شهر',
    'فندق':  'PRO MAX — 1999 ريال/شهر',
    'شركة':  'PRO MAX — 1999 ريال/شهر',
  };

  const SCAN_STAGES = [
    'قراءة نمط المشروع',
    'تحليل رحلة العميل',
    'كشف نقاط التسرب',
    'تحديد الفرص المخفية',
  ];

  /* ── State ── */
  let state = { sector: '', pain: '', city: '', volume: '', dropoff: '', dataclarity: '' };

  /* ── Helpers ── */
  const $  = id  => document.getElementById(id);
  const $$ = sel => document.querySelectorAll(sel);
  function el(tag, cls, html) {
    const e = document.createElement(tag);
    if (cls)  e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }

  /* ══════════════════════════════════════════════
     BUILD MODAL
  ══════════════════════════════════════════════ */
  function buildModal() {
    if ($('fs-modal')) return;

    const modal = el('div');
    modal.id = 'fs-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'Blumark24 Business X-Ray');

    const closeBtn = el('button');
    closeBtn.id = 'fs-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.setAttribute('aria-label', 'إغلاق');
    closeBtn.addEventListener('click', closeModal);
    modal.appendChild(closeBtn);

    const panel = el('div');
    panel.id = 'fs-panel';
    panel.innerHTML = screenWelcome() + screenSector() + screenPain() + screenCity() + screenVolume() + screenDropoff() + screenDataClarity() + screenScan() + screenResult();
    modal.appendChild(panel);

    document.body.appendChild(modal);

    modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

    wireAll();
  }

  /* ══════════════════════════════════════════════
     SCREENS HTML
  ══════════════════════════════════════════════ */
  function screenWelcome() {
    return `
<div id="fs-scr-welcome" class="fs-screen fs-screen-active">
  <div class="fs-xray-hero">
    <div class="fs-xray-icon-wrap">
      <span class="fs-xray-ring-outer"></span>
      <span class="fs-xray-ring-inner"></span>
      <svg class="fs-xray-scan-icon" width="24" height="24" fill="none" viewBox="0 0 24 24">
        <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.8"/>
        <path d="M20 20l-3-3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <path d="M8 11h6M11 8v6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
      </svg>
    </div>
    <div class="fs-xray-badge">Blumark24 Business X-Ray™</div>
    <h2 class="fs-xray-title">اكتشف أين يخسر مشروعك<br>فرص النمو</h2>
    <p class="fs-xray-desc">فحص ذكي يكشف الفرص المخفية في مشروعك<br>خلال دقيقة واحدة فقط</p>
    <button class="fs-xray-start-btn" id="fs-btn-start">
      <svg width="17" height="17" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M5 3l14 9-14 9V3z"/></svg>
      ابدأ الفحص الذكي
    </button>
  </div>
</div>`;
  }

  function screenSector() {
    const sectors = [
      {v:'مطعم',  icon:'🍽️'},
      {v:'كافيه', icon:'☕'},
      {v:'عيادة', icon:'🏥'},
      {v:'متجر',  icon:'🛍️'},
      {v:'فندق',  icon:'🏨'},
      {v:'شركة',  icon:'🏢'},
    ];
    return `
<div id="fs-scr-sector" class="fs-screen">
  <div class="fs-step-header">
    <div class="fs-step-num">01 / 06</div>
    <h3 class="fs-step-title">ما نوع نشاطك التجاري؟</h3>
    <p class="fs-step-sub">سيُخصِّص الفحص نتائجه بناءً على قطاعك</p>
  </div>
  <div class="fs-sector-grid" id="fs-sector-grid">
    ${sectors.map(s => `<button class="fs-sector-card" data-v="${s.v}"><span class="fs-sector-emoji">${s.icon}</span><span class="fs-sector-name">${s.v}</span></button>`).join('')}
  </div>
  <div class="fs-error" id="fs-err-sector">اختر نوع النشاط للمتابعة</div>
  <button class="fs-xray-next-btn" id="fs-btn-to-pain">التالي →</button>
</div>`;
  }

  function screenPain() {
    const pains = [
      {v:'الردود',    icon:'💬'},
      {v:'الحجوزات', icon:'📅'},
      {v:'المبيعات', icon:'📈'},
      {v:'المتابعة', icon:'👥'},
      {v:'التقارير', icon:'📊'},
      {v:'التسويق',  icon:'📣'},
    ];
    return `
<div id="fs-scr-pain" class="fs-screen">
  <div class="fs-step-header">
    <div class="fs-step-num">02 / 06</div>
    <h3 class="fs-step-title">أين أكبر ضغط في مشروعك؟</h3>
    <p class="fs-step-sub">اختر المجال الذي يستهلك وقتك أو يُفقدك عملاء</p>
  </div>
  <div class="fs-pain-grid" id="fs-pain-grid">
    ${pains.map(p => `<button class="fs-pain-card" data-v="${p.v}"><span class="fs-pain-icon">${p.icon}</span><span class="fs-pain-name">${p.v}</span></button>`).join('')}
  </div>
  <div class="fs-error" id="fs-err-pain">اختر مجال الضغط للمتابعة</div>
  <div class="fs-nav-row">
    <button class="fs-back-btn" id="fs-btn-back-sector">← رجوع</button>
    <button class="fs-xray-next-btn" id="fs-btn-to-city">التالي →</button>
  </div>
</div>`;
  }

  function screenCity() {
    const cities = ['مكة','جدة','الرياض','المدينة','الدمام / الخبر','أخرى'];
    return `
<div id="fs-scr-city" class="fs-screen">
  <div class="fs-step-header">
    <div class="fs-step-num">03 / 06</div>
    <h3 class="fs-step-title">في أي مدينة يعمل مشروعك؟</h3>
    <p class="fs-step-sub">نُخصّص التوصيات بناءً على السوق المحلي</p>
  </div>
  <div class="fs-simple-grid" id="fs-city-grid">
    ${cities.map(c => `<button class="fs-simple-card" data-v="${c}">${c}</button>`).join('')}
  </div>
  <div class="fs-city-other-wrap" id="fs-city-other-wrap" style="display:none">
    <input class="fs-input" id="fs-city-other-input" type="text" placeholder="اكتب اسم المدينة" maxlength="40">
  </div>
  <div class="fs-error" id="fs-err-city">اختر المدينة للمتابعة</div>
  <div class="fs-nav-row">
    <button class="fs-back-btn" id="fs-btn-back-pain">← رجوع</button>
    <button class="fs-xray-next-btn" id="fs-btn-to-volume">التالي →</button>
  </div>
</div>`;
  }

  function screenVolume() {
    const opts = ['أقل من 10','10 - 30','30 - 70','أكثر من 70','غير واضح'];
    return `
<div id="fs-scr-volume" class="fs-screen">
  <div class="fs-step-header">
    <div class="fs-step-num">04 / 06</div>
    <h3 class="fs-step-title">كم استفسار أو طلب يصلك يومياً؟</h3>
    <p class="fs-step-sub">يساعدنا في تحديد حجم الأتمتة المطلوبة</p>
  </div>
  <div class="fs-simple-grid fs-simple-grid-col2" id="fs-volume-grid">
    ${opts.map(o => `<button class="fs-simple-card" data-v="${o}">${o}</button>`).join('')}
  </div>
  <div class="fs-error" id="fs-err-volume">اختر حجم التواصل للمتابعة</div>
  <div class="fs-nav-row">
    <button class="fs-back-btn" id="fs-btn-back-city">← رجوع</button>
    <button class="fs-xray-next-btn" id="fs-btn-to-dropoff">التالي →</button>
  </div>
</div>`;
  }

  function screenDropoff() {
    const opts = ['يتأخر الرد عليه','يسأل ولا يكمل','لا توجد متابعة','الحجز غير منظم','لا يعرف الأسعار أو الخدمات','لا نعرف السبب'];
    return `
<div id="fs-scr-dropoff" class="fs-screen">
  <div class="fs-step-header">
    <div class="fs-step-num">05 / 06</div>
    <h3 class="fs-step-title">أين يضيع العميل قبل أن يُصبح عميلاً فعلياً؟</h3>
    <p class="fs-step-sub">هذا هو المكان الذي تختفي منه الإيرادات</p>
  </div>
  <div class="fs-simple-grid" id="fs-dropoff-grid">
    ${opts.map(o => `<button class="fs-simple-card" data-v="${o}">${o}</button>`).join('')}
  </div>
  <div class="fs-error" id="fs-err-dropoff">اختر نقطة الضياع للمتابعة</div>
  <div class="fs-nav-row">
    <button class="fs-back-btn" id="fs-btn-back-volume">← رجوع</button>
    <button class="fs-xray-next-btn" id="fs-btn-to-dataclarity">التالي →</button>
  </div>
</div>`;
  }

  function screenDataClarity() {
    const opts = ['نعم، عندي تقارير','تقريباً','لا، نعتمد على التوقع','لا توجد قراءة واضحة','أحتاج كشف أدق'];
    return `
<div id="fs-scr-dataclarity" class="fs-screen">
  <div class="fs-step-header">
    <div class="fs-step-num">06 / 06</div>
    <h3 class="fs-step-title">هل تعرف بالأرقام لماذا تخسر بعض العملاء؟</h3>
    <p class="fs-step-sub">مستوى الوضوح يحدد عمق الفحص</p>
  </div>
  <div class="fs-simple-grid fs-simple-grid-col2" id="fs-dataclarity-grid">
    ${opts.map(o => `<button class="fs-simple-card" data-v="${o}">${o}</button>`).join('')}
  </div>
  <div class="fs-error" id="fs-err-dataclarity">اختر مستوى الوضوح للمتابعة</div>
  <div class="fs-nav-row">
    <button class="fs-back-btn" id="fs-btn-back-dropoff">← رجوع</button>
    <button class="fs-xray-next-btn" id="fs-btn-start-scan">ابدأ الفحص ⚡</button>
  </div>
</div>`;
  }

  function screenScan() {
    return `
<div id="fs-scr-scan" class="fs-screen">
  <div class="fs-scan-wrap">
    <div class="fs-scan-pulse-ring"></div>
    <div class="fs-scan-orb">
      <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
        <circle cx="11" cy="11" r="7" stroke="#00A8FF" stroke-width="1.6"/>
        <path d="M20 20l-3-3" stroke="#00A8FF" stroke-width="2" stroke-linecap="round"/>
      </svg>
    </div>
    <div class="fs-scan-label" id="fs-scan-label">جاري تشغيل Blumark24 Brain...</div>
    <div class="fs-scan-track"><div class="fs-scan-fill" id="fs-scan-fill"></div></div>
    <div class="fs-scan-stages" id="fs-scan-stages">
      ${SCAN_STAGES.map((s,i) => `<div class="fs-scan-stage" id="fs-ss-${i}">${s}</div>`).join('')}
    </div>
  </div>
</div>`;
  }

  function screenResult() {
    return `
<div id="fs-scr-result" class="fs-screen">

  <!-- ── Header ── -->
  <div class="fs-dt-header">
    <div class="fs-dt-badge"><span class="fs-dt-dot"></span> تم اكتشاف 3 فرص نمو</div>
    <div class="fs-dt-title" id="fs-res-title">نتائج فحص مشروعك</div>
  </div>

  <!-- ── Cinematic Digital Twin Dashboard ── -->
  <div class="fs-dt-canvas" id="fs-dt-canvas">
    <div class="fs-dt-grid" aria-hidden="true"></div>
    <div class="fs-dt-scanner" aria-hidden="true"></div>
    <div class="fs-dt-dots" aria-hidden="true">
      <span class="fs-dot fs-dot-1"></span>
      <span class="fs-dot fs-dot-2"></span>
      <span class="fs-dot fs-dot-3"></span>
      <span class="fs-dot fs-dot-4"></span>
    </div>
    <div class="fs-dt-topbar">
      <div class="fs-dt-topbar-left">
        <span class="fs-dt-live-dot"></span>
        <span class="fs-dt-topbar-label" id="fs-dt-label">Digital Twin · جارٍ التحليل</span>
      </div>
      <div class="fs-dt-topbar-dots">
        <span style="background:rgba(0,168,255,.5)"></span>
        <span style="background:rgba(34,211,238,.4)"></span>
        <span style="background:rgba(16,185,129,.4)"></span>
      </div>
    </div>
    <div class="fs-dt-modules" id="fs-dt-modules"></div>
    <svg class="fs-dt-flow" height="28" viewBox="0 0 400 28" preserveAspectRatio="none" aria-hidden="true">
      <line x1="2%" y1="14" x2="98%" y2="14"
            stroke="rgba(0,168,255,.22)" stroke-width="1.2"
            stroke-dasharray="5 4" class="fs-dt-flow-line"/>
      <circle cx="2%"  cy="14" r="3" fill="#00A8FF" opacity=".8"/>
      <circle cx="35%" cy="14" r="2.5" fill="rgba(0,168,255,.55)"/>
      <circle cx="68%" cy="14" r="2.5" fill="rgba(34,211,238,.55)"/>
      <circle cx="98%" cy="14" r="3" fill="#10B981" opacity=".8"/>
    </svg>
  </div>

  <!-- ── Before / After ── -->
  <div class="fs-ba-compare">
    <div class="fs-ba-before">
      <div class="fs-ba-section-label fs-ba-label-before">قبل Blumark24</div>
      <ul class="fs-ba-list">
        <li>ردود متأخرة</li>
        <li>فرص غير واضحة</li>
        <li>متابعة يدوية</li>
        <li>قرارات بدون قراءة دقيقة</li>
      </ul>
    </div>
    <div class="fs-ba-divider" aria-hidden="true">→</div>
    <div class="fs-ba-after">
      <div class="fs-ba-section-label fs-ba-label-after">بعد Blumark24 Brain</div>
    </div>
  </div>

  <!-- ── Digital Twin Intelligence Layer ── -->
  <div class="fs-intel-layer">
    <!-- scanner line inside layer -->
    <div class="fs-intel-scan" aria-hidden="true"></div>

    <!-- status row -->
    <div class="fs-intel-status-row">
      <div class="fs-intel-stable">
        <span class="fs-intel-stable-dot"></span>
        التوأم الرقمي جاهز
      </div>
      <div class="fs-intel-dna">تم إنشاء بصمة المشروع</div>
    </div>

    <!-- metrics grid -->
    <div class="fs-intel-metrics">
      <div class="fs-intel-metric fs-im-0">
        <div class="fs-im-label">قابلية النمو</div>
        <div class="fs-im-val fs-im-green">+31%</div>
      </div>
      <div class="fs-intel-metric fs-im-1">
        <div class="fs-im-label">دقة القراءة</div>
        <div class="fs-im-val fs-im-cyan">92%</div>
      </div>
      <div class="fs-intel-metric fs-im-2">
        <div class="fs-im-label">جاهزية الأتمتة</div>
        <div class="fs-im-val fs-im-blue">74/100</div>
      </div>
      <div class="fs-intel-metric fs-im-3">
        <div class="fs-im-label">مناطق نمو مخفية</div>
        <div class="fs-im-val fs-im-amber">3 مناطق</div>
      </div>
    </div>

    <!-- action step -->
    <div class="fs-intel-action">
      <span class="fs-intel-action-label">الخطوة التنفيذية المقترحة</span>
      <span class="fs-intel-action-text">تفعيل WhatsApp AI لاستعادة العملاء قبل خروجهم</span>
    </div>
  </div>

  <!-- ── Package ── -->
  <div class="fs-dt-pkg" id="fs-dt-pkg-box">
    <div class="fs-dt-pkg-label">الحل الأنسب لك</div>
    <div class="fs-dt-pkg-name" id="fs-res-pkg"></div>
    <div class="fs-dt-pkg-reason">الأنسب لحجم نشاطك وتحدياتك الحالية</div>
  </div>

  <!-- ── CTAs ── -->
  <button class="fs-wa-btn" id="fs-wa-btn">
    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
    أرسل نتيجتي إلى واتساب
  </button>
  <button class="fs-reset-link" id="fs-btn-reset">↩ فحص جديد</button>
</div>`;
  }

  /* ══════════════════════════════════════════════
     WIRE EVENTS
  ══════════════════════════════════════════════ */
  function wireAll() {
    /* Welcome → Sector */
    $('fs-btn-start').addEventListener('click', () => goTo('fs-scr-sector'));

    /* Sector chips */
    $$('#fs-sector-grid .fs-sector-card').forEach(c =>
      c.addEventListener('click', () => {
        $$('#fs-sector-grid .fs-sector-card').forEach(x => x.classList.remove('fs-sel'));
        c.classList.add('fs-sel');
        state.sector = c.dataset.v;
        $('fs-err-sector').style.display = 'none';
      }));

    /* Sector → Pain */
    $('fs-btn-to-pain').addEventListener('click', () => {
      if (!state.sector) { $('fs-err-sector').style.display = 'block'; return; }
      goTo('fs-scr-pain');
    });

    /* Pain chips */
    $$('#fs-pain-grid .fs-pain-card').forEach(c =>
      c.addEventListener('click', () => {
        $$('#fs-pain-grid .fs-pain-card').forEach(x => x.classList.remove('fs-sel'));
        c.classList.add('fs-sel');
        state.pain = c.dataset.v;
        $('fs-err-pain').style.display = 'none';
      }));

    /* Pain → City */
    $('fs-btn-to-city').addEventListener('click', () => {
      if (!state.pain) { $('fs-err-pain').style.display = 'block'; return; }
      goTo('fs-scr-city');
    });

    /* City chips + "أخرى" input */
    $$('#fs-city-grid .fs-simple-card').forEach(c =>
      c.addEventListener('click', () => {
        $$('#fs-city-grid .fs-simple-card').forEach(x => x.classList.remove('fs-sel'));
        c.classList.add('fs-sel');
        state.city = c.dataset.v;
        $('fs-err-city').style.display = 'none';
        const wrap = $('fs-city-other-wrap');
        if (wrap) wrap.style.display = c.dataset.v === 'أخرى' ? 'block' : 'none';
      }));
    $('fs-btn-to-volume').addEventListener('click', () => {
      if (!state.city) { $('fs-err-city').style.display = 'block'; return; }
      if (state.city === 'أخرى') {
        const inp = $('fs-city-other-input');
        const val = inp && inp.value.trim();
        if (!val) { $('fs-err-city').style.display = 'block'; return; }
        state.city = val;
      }
      goTo('fs-scr-volume');
    });

    /* Volume chips */
    $$('#fs-volume-grid .fs-simple-card').forEach(c =>
      c.addEventListener('click', () => {
        $$('#fs-volume-grid .fs-simple-card').forEach(x => x.classList.remove('fs-sel'));
        c.classList.add('fs-sel'); state.volume = c.dataset.v;
        $('fs-err-volume').style.display = 'none';
      }));
    $('fs-btn-to-dropoff').addEventListener('click', () => {
      if (!state.volume) { $('fs-err-volume').style.display = 'block'; return; }
      goTo('fs-scr-dropoff');
    });

    /* Dropoff chips */
    $$('#fs-dropoff-grid .fs-simple-card').forEach(c =>
      c.addEventListener('click', () => {
        $$('#fs-dropoff-grid .fs-simple-card').forEach(x => x.classList.remove('fs-sel'));
        c.classList.add('fs-sel'); state.dropoff = c.dataset.v;
        $('fs-err-dropoff').style.display = 'none';
      }));
    $('fs-btn-to-dataclarity').addEventListener('click', () => {
      if (!state.dropoff) { $('fs-err-dropoff').style.display = 'block'; return; }
      goTo('fs-scr-dataclarity');
    });

    /* DataClarity chips */
    $$('#fs-dataclarity-grid .fs-simple-card').forEach(c =>
      c.addEventListener('click', () => {
        $$('#fs-dataclarity-grid .fs-simple-card').forEach(x => x.classList.remove('fs-sel'));
        c.classList.add('fs-sel'); state.dataclarity = c.dataset.v;
        $('fs-err-dataclarity').style.display = 'none';
      }));

    /* DataClarity → Scan */
    $('fs-btn-start-scan').addEventListener('click', () => {
      if (!state.dataclarity) { $('fs-err-dataclarity').style.display = 'block'; return; }
      goTo('fs-scr-scan');
      runScan();
    });

    /* Back buttons */
    $('fs-btn-back-sector').addEventListener('click',   () => goTo('fs-scr-sector'));
    $('fs-btn-back-pain').addEventListener('click',     () => goTo('fs-scr-pain'));
    $('fs-btn-back-city').addEventListener('click',     () => goTo('fs-scr-city'));
    $('fs-btn-back-volume').addEventListener('click',   () => goTo('fs-scr-volume'));
    $('fs-btn-back-dropoff').addEventListener('click',  () => goTo('fs-scr-dropoff'));

    /* WhatsApp */
    $('fs-wa-btn').addEventListener('click', sendWhatsApp);

    /* Reset */
    $('fs-btn-reset').addEventListener('click', resetXRay);
  }

  /* ── Screen transition ── */
  function goTo(id) {
    $$('.fs-screen').forEach(s => s.classList.remove('fs-screen-active'));
    const target = $(id);
    if (target) {
      target.classList.add('fs-screen-active');
      const panel = $('fs-panel');
      if (panel) panel.scrollTop = 0;
    }
  }

  /* ── Scan animation ── */
  function runScan() {
    const fill  = $('fs-scan-fill');
    const label = $('fs-scan-label');
    fill.style.width = '0%';
    $$('.fs-scan-stage').forEach(s => s.classList.remove('fs-ss-active', 'fs-ss-done'));

    let i = 0;
    function tick() {
      if (i >= SCAN_STAGES.length) {
        fill.style.width = '100%';
        setTimeout(() => {
          buildResult();
          goTo('fs-scr-result');
        }, 400);
        return;
      }
      const stg = $('fs-ss-' + i);
      if (stg) {
        if (i > 0) $('fs-ss-' + (i-1)).classList.replace('fs-ss-active', 'fs-ss-done');
        stg.classList.add('fs-ss-active');
      }
      label.textContent = SCAN_STAGES[i];
      fill.style.width = ((i + 1) / SCAN_STAGES.length * 90) + '%';
      i++;
      setTimeout(tick, 750);
    }
    tick();
  }

  /* ── Build cinematic result ── */
  const MODULE_ICONS = ['🤖','⚡','📊'];

  function buildResult() {
    const sec  = state.sector || 'مطعم';
    const pain = state.pain   || 'الردود';
    const opps = (OPPS[sec] && OPPS[sec][pain]) || OPPS['مطعم']['الردود'];

    $('fs-res-title').textContent  = `نتائج فحص ${sec} · تحدي ${pain}`;
    $('fs-res-pkg').textContent    = PKG[sec] || 'GROWTH — 999 ريال/شهر';
    $('fs-dt-label').textContent   = `Digital Twin · ${sec}`;

    /* render modules with staggered entrance */
    $('fs-dt-modules').innerHTML = opps.map((o, i) => `
      <div class="fs-dt-module fs-dt-mod-${i}" style="animation-delay:${i * 0.18 + 0.1}s">
        <div class="fs-dt-mod-top">
          <span class="fs-dt-mod-icon">${MODULE_ICONS[i] || '✦'}</span>
          <span class="fs-dt-mod-num">0${i + 1}</span>
        </div>
        <div class="fs-dt-mod-text">${o}</div>
        <div class="fs-dt-mod-status">
          <span class="fs-dt-mod-check">✓</span> نشط
        </div>
      </div>`).join('');
  }

  /* ── WhatsApp ── */
  function sendWhatsApp() {
    const msg = [
      'مرحباً Blumark24 👋',
      'أجريت فحص Blumark24 Brain',
      `نوع النشاط: ${state.sector || 'غير محدد'}`,
      `أكبر ضغط: ${state.pain || 'غير محدد'}`,
      `المدينة: ${state.city || 'غير محددة'}`,
      `حجم التواصل اليومي: ${state.volume || 'غير محدد'}`,
      `نقطة ضياع العميل: ${state.dropoff || 'غير محددة'}`,
      `وضوح الأرقام: ${state.dataclarity || 'غير محدد'}`,
      'وأرغب بمعرفة الحل الأنسب لمشروعي.',
    ].join('\n');
    window.open(`https://wa.me/${WAPHONE}?text=${encodeURIComponent(msg)}`, '_blank');
  }

  /* ── Open / Close / Reset ── */
  function openModal() {
    buildModal();
    resetXRay();
    const m = $('fs-modal');
    m.classList.add('open', 'fs-opening');
    document.body.style.overflow = 'hidden';
    setTimeout(() => m.classList.remove('fs-opening'), 500);
  }
  function closeModal() {
    const m = $('fs-modal');
    if (m) m.classList.remove('open');
    document.body.style.overflow = '';
  }
  function resetXRay() {
    state = { sector: '', pain: '', city: '', volume: '', dropoff: '', dataclarity: '' };
    $$('.fs-sector-card, .fs-pain-card, .fs-simple-card').forEach(c => c.classList.remove('fs-sel'));
    ['fs-err-sector','fs-err-pain','fs-err-city','fs-err-volume','fs-err-dropoff','fs-err-dataclarity'].forEach(id => {
      const e = $(id); if (e) e.style.display = 'none';
    });
    const wrap = $('fs-city-other-wrap');
    if (wrap) wrap.style.display = 'none';
    const inp = $('fs-city-other-input');
    if (inp) inp.value = '';
    const fill = $('fs-scan-fill');
    if (fill) fill.style.width = '0%';
    goTo('fs-scr-welcome');
  }

  /* ── Public API ── */
  window.FS = {
    open:   openModal,
    close:  closeModal,
    reset:  resetXRay,
    /* legacy stubs kept so any external call won't throw */
    showAfter:  () => {},
    showBefore: () => {},
  };

})();
