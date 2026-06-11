/* ============================================================
   Blumark24 Future Simulator — Standalone JS
   Fully self-contained. No globals polluted except `FS`.
   ============================================================ */
(function () {
  'use strict';

  /* ── Data ── */
  const MODULES = {
    'مطعم':  [
      {icon:'🤖',title:'واتساب AI',    desc:'يرد ويبيع'},
      {icon:'📋',title:'Smart Menu',   desc:'منيو رقمي'},
      {icon:'🛒',title:'الطلبات',       desc:'إدارة آنية'},
      {icon:'⭐',title:'Google Reviews',desc:'تعزيز التقييم'},
      {icon:'❤️',title:'Loyalty',       desc:'برنامج ولاء'},
      {icon:'📊',title:'تقارير',         desc:'مبيعات يومية'},
    ],
    'كافيه': [
      {icon:'🤖',title:'واتساب AI',    desc:'يرد ويبيع'},
      {icon:'📋',title:'Smart Menu',   desc:'منيو رقمي'},
      {icon:'🛒',title:'الطلبات',       desc:'إدارة آنية'},
      {icon:'⭐',title:'Google Reviews',desc:'تعزيز التقييم'},
      {icon:'❤️',title:'Loyalty',       desc:'برنامج ولاء'},
      {icon:'📊',title:'تقارير',         desc:'إيرادات يومية'},
    ],
    'عيادة': [
      {icon:'🤖',title:'AI استقبال',    desc:'يرد 24/7'},
      {icon:'📅',title:'الحجوزات',       desc:'جدولة ذكية'},
      {icon:'💊',title:'تذكير المرضى',   desc:'آلي ودقيق'},
      {icon:'📊',title:'تقارير زيارات', desc:'إحصاءات شاملة'},
      {icon:'🗂️',title:'ملفات المرضى',  desc:'CRM طبي'},
      {icon:'⭐',title:'تقييمات',         desc:'بناء السمعة'},
    ],
    'متجر': [
      {icon:'🤖',title:'دعم AI',         desc:'يرد ويبيع'},
      {icon:'🛒',title:'الطلبات',         desc:'تتبع آني'},
      {icon:'💡',title:'توصيات',          desc:'Upsell ذكي'},
      {icon:'📦',title:'المخزون',         desc:'تنبيهات تلقائية'},
      {icon:'👥',title:'CRM',             desc:'بيانات العملاء'},
      {icon:'📊',title:'تقارير',          desc:'أداء المبيعات'},
    ],
    'فندق': [
      {icon:'🤖',title:'AI مساعد',       desc:'خدمة النزلاء'},
      {icon:'📅',title:'الحجوزات',        desc:'نظام ذكي'},
      {icon:'🏠',title:'الإشغال',         desc:'Dashboard آني'},
      {icon:'⭐',title:'التقييمات',       desc:'إدارة السمعة'},
      {icon:'🔔',title:'تنبيهات',         desc:'Check-in/out'},
      {icon:'📊',title:'الإيرادات',       desc:'تقارير يومية'},
    ],
    'شركة': [
      {icon:'👥',title:'CRM',            desc:'إدارة العملاء'},
      {icon:'🎯',title:'Leads',          desc:'متابعة المبيعات'},
      {icon:'⚙️',title:'Workflow',       desc:'أتمتة العمليات'},
      {icon:'🤖',title:'AI مساعد',       desc:'دعم الفريق'},
      {icon:'📊',title:'التقارير',        desc:'KPIs متكاملة'},
      {icon:'📋',title:'المهام',          desc:'تنظيم المشاريع'},
    ],
  };

  const MODULES_BEFORE = [
    {icon:'⏳',title:'ردود متأخرة',      desc:'يدوي وبطيء'},
    {icon:'📄',title:'طلبات ورقية',      desc:'غير منظمة'},
    {icon:'❌',title:'لا تقارير',         desc:'بدون بيانات'},
    {icon:'🔇',title:'ظهور ضعيف',        desc:'بدون Google'},
    {icon:'❌',title:'لا CRM',            desc:'بيانات مفقودة'},
    {icon:'💤',title:'بدون أتمتة',       desc:'كل شيء يدوي'},
  ];

  const METRICS_AFTER = {
    'مطعم':  [{val:'↑68%',lbl:'مبيعات واتساب'},{val:'4.8★',lbl:'تقييم Google'},{val:'×3',lbl:'الطلبات الرقمية'},{val:'0 ث',lbl:'رد فوري'}],
    'كافيه': [{val:'↑55%',lbl:'طلبات رقمية'}, {val:'4.9★',lbl:'تقييم Google'},{val:'×2.5',lbl:'عمليات أسرع'},    {val:'0 ث',lbl:'رد فوري'}],
    'عيادة': [{val:'↑80%',lbl:'حجوزات ممتلئة'},{val:'95%', lbl:'تذكير فعّال'},{val:'0',   lbl:'غياب بدون تنبيه'},{val:'24/7',lbl:'استقبال AI'}],
    'متجر':  [{val:'↑72%',lbl:'إيرادات شهرية'},{val:'×4',  lbl:'سرعة الرد'},   {val:'↑40%',lbl:'Upsell ناجح'},   {val:'0',   lbl:'فقدان عميل'}],
    'فندق':  [{val:'↑60%',lbl:'إشغال الغرف'}, {val:'4.9★',lbl:'التقييم'},      {val:'×3',  lbl:'رضا النزلاء'},   {val:'24/7',lbl:'خدمة AI'}],
    'شركة':  [{val:'↑85%',lbl:'متابعة Leads'},{val:'×5',  lbl:'إنتاجية الفريق'},{val:'↓70%',lbl:'وقت يدوي'},    {val:'100%',lbl:'مرئية البيانات'}],
  };
  const METRICS_BEFORE = [
    {val:'منخفض',lbl:'ظهور رقمي'},
    {val:'بطيء', lbl:'وقت الرد'},
    {val:'يدوي', lbl:'العمليات'},
    {val:'مفقود',lbl:'تحليل البيانات'},
  ];

  const PKG = {
    'مطعم':'GROWTH — 999 ريال/شهر',
    'كافيه':'GROWTH — 999 ريال/شهر',
    'عيادة':'PRO MAX — 1999 ريال/شهر',
    'متجر':'GROWTH — 999 ريال/شهر',
    'فندق':'PRO MAX — 1999 ريال/شهر',
    'شركة':'PRO MAX — 1999 ريال/شهر',
  };

  const WAPHONE = '966507006849';

  const STAGES = [
    {icon:'🔍', title:'تحليل الظهور الرقمي',  desc:'فحص وجودك على الإنترنت'},
    {icon:'🗺️', title:'بناء رحلة العميل',      desc:'رسم نقاط تفاعل العميل'},
    {icon:'⚡', title:'اكتشاف فرص الأتمتة',   desc:'تحديد العمليات القابلة للأتمتة'},
    {icon:'🚀', title:'تجهيز النسخة المستقبلية',desc:'بناء التوأم الرقمي'},
  ];

  /* ── State ── */
  let state = { biz:'', city:'', challenge:'', hasWeb:'', hasWa:'', hasMaps:'' };
  let afterMode = true;

  /* ── Helpers ── */
  const $  = id  => document.getElementById(id);
  const $$ = sel => document.querySelectorAll(sel);

  function el(tag, cls, html) {
    const e = document.createElement(tag);
    if (cls)  e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }

  /* ── Build Modal DOM ── */
  function buildModal() {
    if ($('fs-modal')) return; // already built

    const modal = el('div');
    modal.id = 'fs-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'محاكي مستقبل مشروعك');

    const closeBtn = el('button');
    closeBtn.id = 'fs-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.setAttribute('aria-label', 'إغلاق');
    closeBtn.addEventListener('click', closeModal);
    modal.appendChild(closeBtn);

    const panel = el('div');
    panel.id = 'fs-panel';
    panel.innerHTML = buildStep1HTML() + buildStep2HTML() + buildStep3HTML();
    modal.appendChild(panel);

    document.body.appendChild(modal);

    /* backdrop close */
    modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
    /* ESC close */
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

    /* wire chips & toggles */
    wireInteractivity();
  }

  /* ── Step 1 HTML ── */
  function buildStep1HTML() {
    return `
<div id="fs-step1" class="fs-step fs-active" style="padding-top:20px">
  <div class="fs-badge"><span class="fs-badge-dot"></span> Blumark24 Future Simulator™</div>
  <div class="fs-title">محاكي مستقبل مشروعك</div>
  <div class="fs-sub">6 أسئلة فقط · نبني لك التوأم الرقمي كاملاً</div>

  <div class="fs-field">
    <label>نوع النشاط <span class="fs-req">*</span></label>
    <div class="fs-chips" id="fs-biz-chips">
      <button class="fs-chip" data-v="مطعم">🍽️ مطعم</button>
      <button class="fs-chip" data-v="كافيه">☕ كافيه</button>
      <button class="fs-chip" data-v="عيادة">🏥 عيادة</button>
      <button class="fs-chip" data-v="متجر">🛍️ متجر</button>
      <button class="fs-chip" data-v="فندق">🏨 فندق</button>
      <button class="fs-chip" data-v="شركة">🏢 شركة</button>
    </div>
  </div>

  <div class="fs-field">
    <label>المدينة</label>
    <input id="fs-city" class="fs-input" type="text" placeholder="مثال: الرياض، جدة، الدمام...">
  </div>

  <div class="fs-field">
    <label>أكبر تحدٍّ تواجهه <span class="fs-req">*</span></label>
    <div class="fs-chips" id="fs-challenge-chips">
      <button class="fs-chip" data-v="المبيعات">📈 المبيعات</button>
      <button class="fs-chip" data-v="الردود">💬 الردود</button>
      <button class="fs-chip" data-v="الحجوزات">📅 الحجوزات</button>
      <button class="fs-chip" data-v="الظهور">🌐 الظهور</button>
      <button class="fs-chip" data-v="التنظيم">⚙️ التنظيم</button>
    </div>
  </div>

  <div class="fs-field">
    <label>هل لديك موقع إلكتروني؟</label>
    <div class="fs-toggle-row" id="fs-web-btns">
      <button class="fs-toggle-btn" data-v="نعم">نعم ✅</button>
      <button class="fs-toggle-btn" data-v="لا">لا ❌</button>
    </div>
  </div>

  <div class="fs-field">
    <label>هل لديك واتساب أعمال؟</label>
    <div class="fs-toggle-row" id="fs-wa-btns">
      <button class="fs-toggle-btn" data-v="نعم">نعم ✅</button>
      <button class="fs-toggle-btn" data-v="لا">لا ❌</button>
    </div>
  </div>

  <div class="fs-field">
    <label>هل Google Maps مفعّل؟</label>
    <div class="fs-toggle-row" id="fs-maps-btns">
      <button class="fs-toggle-btn" data-v="نعم">نعم ✅</button>
      <button class="fs-toggle-btn" data-v="لا">لا ❌</button>
    </div>
  </div>

  <div class="fs-error" id="fs-form-error">فضلاً اختر نوع النشاط والتحدي الأكبر.</div>

  <button class="fs-btn-primary" id="fs-start-btn">
    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
    </svg>
    ابنِ توأمي الرقمي الآن
  </button>
</div>`;
  }

  /* ── Step 2 HTML ── */
  function buildStep2HTML() {
    const stagesHtml = STAGES.map((s,i) => `
      <div class="fs-stage" id="fs-stg-${i}">
        <div class="fs-stage-icon">${s.icon}</div>
        <div class="fs-stage-info">
          <div class="fs-stage-title">${s.title}</div>
          <div class="fs-stage-desc">${s.desc}</div>
        </div>
        <div class="fs-spinner" id="fs-spin-${i}"></div>
        <div class="fs-check"   id="fs-chk-${i}">✓</div>
      </div>`).join('');

    return `
<div id="fs-step2" class="fs-step" style="max-width:480px;margin:0 auto;padding-top:40px">
  <div class="fs-proc-center">
    <div class="fs-proc-brain">🧠</div>
    <div class="fs-title" style="font-size:1.25rem">جارٍ بناء التوأم الرقمي لمشروعك...</div>
    <div class="fs-sub">يرجى الانتظار · نحن نبني مستقبلك</div>
  </div>
  <div class="fs-progress-track"><div class="fs-progress-fill" id="fs-progress"></div></div>
  <div id="fs-stages">${stagesHtml}</div>
</div>`;
  }

  /* ── Step 3 HTML (skeleton; filled dynamically) ── */
  function buildStep3HTML() {
    return `
<div id="fs-step3" class="fs-step">
  <div class="fs-badge"><span class="fs-badge-dot" style="background:#10B981"></span> التوأم الرقمي جاهز ✓</div>
  <div class="fs-twin-header">
    <div>
      <div class="fs-title" id="fs-twin-title">التوأم الرقمي لمشروعك خلال 30 يوم</div>
      <div class="fs-sub" id="fs-twin-sub">اضغط "مشروعي الآن" لرؤية الفرق</div>
    </div>
    <div class="fs-ba-toggle">
      <button class="fs-ba-btn fs-ba-active" id="fs-btn-after"  onclick="FS.showAfter()">بعد Blumark24 ✨</button>
      <button class="fs-ba-btn"              id="fs-btn-before" onclick="FS.showBefore()">مشروعي الآن</button>
    </div>
  </div>

  <div class="fs-canvas" id="fs-canvas">
    <div class="fs-scanner" id="fs-scanner"></div>
    <div class="fs-top-bar">
      <div class="fs-topbar-left">
        <span class="fs-pulse-dot" id="fs-pulse-dot"></span>
        <span class="fs-topbar-title" id="fs-dash-title">لوحة تحكم ذكية</span>
      </div>
      <div class="fs-topbar-dots">
        <span style="background:rgba(0,168,255,.4)"></span>
        <span style="background:rgba(34,211,238,.3)"></span>
        <span style="background:rgba(16,185,129,.3)"></span>
      </div>
    </div>
    <div class="fs-modules" id="fs-modules"></div>
    <div style="padding:13px;background:rgba(255,255,255,.02);border-radius:13px;border:1px solid rgba(0,168,255,.1);margin-top:4px">
      <div style="font-size:.73rem;color:#64748b;font-weight:700;margin-bottom:7px" id="fs-metric-title">مؤشرات الأداء المتوقعة</div>
      <div class="fs-metrics" id="fs-metrics"></div>
    </div>
    <svg class="fs-flow" height="38" viewBox="0 0 400 38" preserveAspectRatio="none">
      <line x1="5%" y1="19" x2="95%" y2="19" stroke="rgba(0,168,255,.28)" stroke-width="1.5" class="fs-flow-line"/>
      <circle cx="5%"  cy="19" r="3" fill="#00A8FF"/>
      <circle cx="30%" cy="19" r="3" fill="rgba(0,168,255,.5)"/>
      <circle cx="60%" cy="19" r="3" fill="rgba(34,211,238,.5)"/>
      <circle cx="95%" cy="19" r="3" fill="#10B981"/>
    </svg>
  </div>

  <div class="fs-pkg-box">
    <div class="fs-pkg-label">الباقة المقترحة لك</div>
    <div class="fs-pkg-name"   id="fs-pkg-name">GROWTH — 999 ريال/شهر</div>
    <div class="fs-pkg-reason" id="fs-pkg-reason">الأنسب لحجم نشاطك وتحدياتك الحالية</div>
  </div>

  <button class="fs-wa-btn" id="fs-wa-btn">
    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
    أرسل لي خطة النمو المجانية
  </button>
  <button class="fs-reset-link" onclick="FS.reset()">↩ ابدأ من جديد</button>
</div>`;
  }

  /* ── Wire interactivity ── */
  function wireInteractivity() {
    /* chips */
    $$('#fs-biz-chips .fs-chip').forEach(c =>
      c.addEventListener('click', () => {
        $$('#fs-biz-chips .fs-chip').forEach(x => x.classList.remove('fs-sel'));
        c.classList.add('fs-sel');
        state.biz = c.dataset.v;
      }));
    $$('#fs-challenge-chips .fs-chip').forEach(c =>
      c.addEventListener('click', () => {
        $$('#fs-challenge-chips .fs-chip').forEach(x => x.classList.remove('fs-sel'));
        c.classList.add('fs-sel');
        state.challenge = c.dataset.v;
      }));

    /* toggles */
    [['#fs-web-btns','hasWeb'],['#fs-wa-btns','hasWa'],['#fs-maps-btns','hasMaps']].forEach(([sel,key]) => {
      $$(sel + ' .fs-toggle-btn').forEach(b =>
        b.addEventListener('click', () => {
          $$(sel + ' .fs-toggle-btn').forEach(x => x.classList.remove('fs-sel'));
          b.classList.add('fs-sel');
          state[key] = b.dataset.v;
        }));
    });

    /* start */
    $('fs-start-btn').addEventListener('click', startProcessing);

    /* WhatsApp */
    $('fs-wa-btn').addEventListener('click', sendWhatsApp);
  }

  /* ── Open / Close ── */
  function openModal() {
    buildModal();
    reset();
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

  /* ── Reset ── */
  function reset() {
    state = { biz:'', city:'', challenge:'', hasWeb:'', hasWa:'', hasMaps:'' };
    afterMode = true;
    ['fs-step1','fs-step2','fs-step3'].forEach(id => {
      const el = $(id);
      if (el) { el.classList.remove('fs-active'); }
    });
    const s1 = $('fs-step1');
    if (s1) s1.classList.add('fs-active');
    const prog = $('fs-progress');
    if (prog) prog.style.width = '0%';
    const err = $('fs-form-error');
    if (err) err.style.display = 'none';
    $$('.fs-chip').forEach(c => c.classList.remove('fs-sel'));
    $$('.fs-toggle-btn').forEach(b => b.classList.remove('fs-sel'));
    const city = $('fs-city');
    if (city) city.value = '';
    const modal = $('fs-modal');
    if (modal) modal.scrollTop = 0;
  }

  /* ── Processing ── */
  function startProcessing() {
    if (!state.biz || !state.challenge) {
      $('fs-form-error').style.display = 'block';
      return;
    }
    $('fs-form-error').style.display = 'none';
    $('fs-step1').classList.remove('fs-active');
    $('fs-step2').classList.add('fs-active');
    $('fs-modal').scrollTop = 0;
    runStages(0);
  }

  function runStages(i) {
    if (i >= STAGES.length) {
      setTimeout(() => {
        $('fs-step2').classList.remove('fs-active');
        buildResult();
        $('fs-step3').classList.add('fs-active');
        $('fs-modal').scrollTop = 0;
      }, 350);
      return;
    }
    const stg  = $('fs-stg-' + i);
    const spin = $('fs-spin-' + i);
    const chk  = $('fs-chk-'  + i);
    stg.classList.add('fs-stage-active');
    spin.style.display = 'block';
    $('fs-progress').style.width = ((i * 25) + 10) + '%';

    setTimeout(() => {
      spin.style.display = 'none';
      chk.style.display  = 'block';
      stg.classList.remove('fs-stage-active');
      stg.classList.add('fs-stage-done');
      $('fs-progress').style.width = ((i + 1) * 25) + '%';
      setTimeout(() => runStages(i + 1), 280);
    }, 950);
  }

  /* ── Build Result ── */
  function buildResult() {
    const biz = state.biz;
    afterMode = true;
    $('fs-twin-title').textContent = `التوأم الرقمي لـ "${biz}" خلال 30 يوماً`;
    $('fs-twin-sub').textContent   = 'اضغط "مشروعي الآن" لرؤية الفرق';
    $('fs-dash-title').textContent = `لوحة تحكم ${biz} الذكية`;
    $('fs-pkg-name').textContent   = PKG[biz] || 'GROWTH — 999 ريال/شهر';
    $('fs-pulse-dot').style.background = '#10B981';
    $('fs-btn-after').classList.add('fs-ba-active');
    $('fs-btn-before').classList.remove('fs-ba-active');
    $('fs-canvas').classList.remove('fs-before');
    renderModules(MODULES[biz] || MODULES['شركة'], true);
    renderMetrics(METRICS_AFTER[biz] || METRICS_AFTER['شركة'], true);
    $('fs-metric-title').textContent = 'مؤشرات الأداء المتوقعة بعد 30 يوم';
  }

  /* ── Before / After ── */
  function showAfter() {
    afterMode = true;
    const biz = state.biz;
    $('fs-btn-after').classList.add('fs-ba-active');
    $('fs-btn-before').classList.remove('fs-ba-active');
    $('fs-canvas').classList.remove('fs-before');
    $('fs-dash-title').textContent = `لوحة تحكم ${biz} الذكية`;
    $('fs-pulse-dot').style.background = '#10B981';
    $('fs-metric-title').textContent = 'مؤشرات الأداء المتوقعة بعد 30 يوم';
    renderModules(MODULES[biz] || MODULES['شركة'], true);
    renderMetrics(METRICS_AFTER[biz] || METRICS_AFTER['شركة'], true);
  }
  function showBefore() {
    afterMode = false;
    $('fs-btn-before').classList.add('fs-ba-active');
    $('fs-btn-after').classList.remove('fs-ba-active');
    $('fs-canvas').classList.add('fs-before');
    $('fs-dash-title').textContent = 'الوضع الحالي';
    $('fs-pulse-dot').style.background = '#ef4444';
    $('fs-metric-title').textContent = 'مؤشرات الأداء الحالية';
    renderModules(MODULES_BEFORE, false);
    renderMetrics(METRICS_BEFORE, false);
  }

  /* ── Render helpers ── */
  function renderModules(list, active) {
    $('fs-modules').innerHTML = list.map((m, idx) => `
      <div class="fs-module ${active ? 'fs-m-active' : 'fs-m-inactive'}" style="animation-delay:${idx * 0.18}s">
        <div class="fs-module-icon">${m.icon}</div>
        <div class="fs-module-title">${m.title}</div>
        <div class="fs-module-status">${active ? '● نشط' : '○ ' + m.desc}</div>
      </div>`).join('');
  }
  function renderMetrics(list, active) {
    $('fs-metrics').innerHTML = list.map(m => `
      <div class="fs-metric ${active ? 'fs-m-active' : 'fs-m-inactive'}">
        <div class="fs-metric-val">${m.val}</div>
        <div class="fs-metric-label">${m.lbl}</div>
      </div>`).join('');
  }

  /* ── WhatsApp ── */
  function sendWhatsApp() {
    const pkg = PKG[state.biz] || 'GROWTH';
    const msg = [
      'مرحباً Blumark24 🌟',
      'أريد خطة النمو المجانية لمشروعي 🚀',
      '',
      `🏢 النشاط: ${state.biz || 'غير محدد'}`,
      `📍 المدينة: ${($('fs-city') && $('fs-city').value) || state.city || 'غير محددة'}`,
      `🎯 أكبر تحدي: ${state.challenge || 'غير محدد'}`,
      `🌐 موقع: ${state.hasWeb || 'غير محدد'}`,
      `💬 واتساب أعمال: ${state.hasWa || 'غير محدد'}`,
      `📍 Google Maps: ${state.hasMaps || 'غير محدد'}`,
      `📦 الباقة المقترحة: ${pkg}`,
      '',
      'أرجو إرسال خطة النمو التفصيلية.',
    ].join('\n');
    window.open(`https://wa.me/${WAPHONE}?text=${encodeURIComponent(msg)}`, '_blank');
  }

  /* ── Expose public API ── */
  window.FS = { open: openModal, close: closeModal, reset, showAfter, showBefore };

})();
