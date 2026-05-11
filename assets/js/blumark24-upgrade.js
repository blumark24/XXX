(() => {
  const socialLinks = [
    ['Instagram','https://www.instagram.com/blumark24?igsh=eDM3a2VycGFwcnlo','IG'],
    ['X','https://x.com/blumark24?s=21','X'],
    ['LinkedIn','https://www.linkedin.com/company/blumark24ksa/','in'],
    ['TikTok','https://www.tiktok.com/@blumark24?_r=1&_t=ZS-95yQcm1ZBxZ','TT']
  ];

  function css(el, styles){ Object.assign(el.style, styles); }

  function addCss(){
    if (document.querySelector('#bm-runtime-social-css')) return;
    const style = document.createElement('style');
    style.id = 'bm-runtime-social-css';
    style.textContent = `
      .bm-social-management{margin-top:32px;padding:24px;border:1px solid rgba(0,168,255,.25);border-radius:24px;background:rgba(255,255,255,.035);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);text-align:center;box-shadow:0 16px 48px rgba(0,0,0,.28),0 0 24px rgba(0,168,255,.08)}
      .bm-social-management-title{font-size:20px;font-weight:800;color:#fff;margin:0 0 8px}
      .bm-social-management-desc{color:rgba(255,255,255,.62);font-size:14px;margin:0 0 18px;line-height:1.8}
      .bm-social-management-icons{display:flex;gap:12px;justify-content:center;align-items:center;flex-wrap:wrap;direction:ltr}
      .bm-social-management-icon{width:48px;height:48px;display:inline-flex;align-items:center;justify-content:center;border-radius:16px;background:rgba(10,22,40,.72);border:1px solid rgba(34,211,238,.22);color:#fff;font-weight:900;font-size:18px;text-decoration:none;box-shadow:0 0 18px rgba(34,211,238,.14);transition:transform .2s ease,border-color .2s ease,box-shadow .2s ease}
      .bm-social-management-icon:hover{transform:translateY(-2px);border-color:#22D3EE;box-shadow:0 0 18px rgba(34,211,238,.24)}
    `;
    document.head.appendChild(style);
  }

  function createBlock(){
    const box = document.createElement('div');
    box.className = 'bm-social-management';
    box.innerHTML = '<h3 class="bm-social-management-title">إدارة التواصل الاجتماعي</h3><p class="bm-social-management-desc">تابع Blumark24 عبر المنصات الرسمية وتواصل معنا من القنوات المعتمدة.</p>';
    const icons = document.createElement('div');
    icons.className = 'bm-social-management-icons';
    socialLinks.forEach(([label, href, mark]) => {
      const a = document.createElement('a');
      a.href = href;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.ariaLabel = label;
      a.className = 'bm-social-management-icon';
      a.textContent = mark;
      icons.appendChild(a);
    });
    box.appendChild(icons);
    return box;
  }

  function run(){
    addCss();
    const footer = document.querySelector('footer') || document.body;
    if (!document.querySelector('.bm-social-management')) footer.appendChild(createBlock());
    document.querySelectorAll('a[href*="wa.me"],a[href*="whatsapp"]').forEach(a=>{a.href='https://wa.me/966507006849';a.target='_blank';a.rel='noopener noreferrer';});
  }

  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', run, {once:true}) : run();
})();
