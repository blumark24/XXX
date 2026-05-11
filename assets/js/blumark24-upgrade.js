(() => {
  const socialLinks = [
    ['Instagram','https://www.instagram.com/blumark24?igsh=eDM3a2VycGFwcnlo','◎'],
    ['X','https://x.com/blumark24?s=21','𝕏'],
    ['LinkedIn','https://www.linkedin.com/company/blumark24ksa/','in'],
    ['TikTok','https://www.tiktok.com/@blumark24?_r=1&_t=ZS-95yQcm1ZBxZ','♪']
  ];

  function addCss(){
    if (document.querySelector('#bm-runtime-social-css')) return;
    const style = document.createElement('style');
    style.id = 'bm-runtime-social-css';
    style.textContent = `
      .bm-social-management{display:none!important}
      .bm-social-management-icons,.bm-social-replacement{display:flex;gap:12px;justify-content:center;align-items:center;flex-wrap:wrap;direction:ltr}
      .bm-social-management-icon,.bm-social-replacement a{width:48px;height:48px;display:inline-flex;align-items:center;justify-content:center;border-radius:16px;background:rgba(10,22,40,.72);border:1px solid rgba(34,211,238,.22);color:#fff;font-weight:900;font-size:20px;text-decoration:none;box-shadow:0 0 18px rgba(34,211,238,.14);transition:transform .2s ease,border-color .2s ease,box-shadow .2s ease}
      .bm-social-management-icon:hover,.bm-social-replacement a:hover{transform:translateY(-2px);border-color:#22D3EE;box-shadow:0 0 18px rgba(34,211,238,.24)}
    `;
    document.head.appendChild(style);
  }

  function createIcons(){
    const wrap = document.createElement('div');
    wrap.className = 'bm-social-replacement';
    socialLinks.forEach(([label, href, mark])=>{
      const a = document.createElement('a');
      a.href = href;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.setAttribute('aria-label', label);
      a.textContent = mark;
      wrap.appendChild(a);
    });
    return wrap;
  }

  function looksLikeOldSocial(node){
    const text = (node.textContent || '').trim();
    return text.includes('💬') || text.includes('💼') || text.includes('🔎') || text.includes('📷') || text.includes('📱') || text.includes('🐦');
  }

  function replaceOldSocial(){
    const candidates = [...document.querySelectorAll('footer div, footer a, footer span')].filter(looksLikeOldSocial);
    let target = candidates.find(n => (n.textContent || '').includes('💬') && (n.textContent || '').includes('💼')) || candidates[0];
    if (!target) return;
    const container = target.closest('.flex') || target.parentElement || target;
    if (container && !container.querySelector('.bm-social-replacement')) {
      container.innerHTML = '';
      container.appendChild(createIcons());
    }
  }

  function removeInjectedBottom(){
    document.querySelectorAll('.bm-social-management,.bm-footer-social-injection').forEach(el => el.remove());
  }

  function fixWhatsApp(){
    document.querySelectorAll('a[href*="wa.me"],a[href*="whatsapp"]').forEach(a=>{a.href='https://wa.me/966507006849';a.target='_blank';a.rel='noopener noreferrer';});
  }

  function run(){
    addCss();
    removeInjectedBottom();
    replaceOldSocial();
    fixWhatsApp();
  }

  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', run, {once:true}) : run();
})();
