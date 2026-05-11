(() => {
  function run(){
    document.querySelectorAll('.bm-social-management,.bm-footer-social-injection,.bm-social-replacement').forEach(el => el.remove());
    const items = [
      ['Instagram','https://www.instagram.com/blumark24?igsh=eDM3a2VycGFwcnlo','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"></rect><circle cx="12" cy="12" r="4"></circle><circle cx="17.5" cy="6.5" r="1"></circle></svg>'],
      ['X','https://x.com/blumark24?s=21','<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.654l-5.214-6.817-5.965 6.817H1.684l7.73-8.835L1.25 2.25h6.823l4.713 6.231 5.458-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z"/></svg>'],
      ['LinkedIn','https://www.linkedin.com/company/blumark24ksa/','<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5ZM.4 8h4.2v14H.4V8Zm7.1 0h4.02v1.92h.06c.56-1.06 1.94-2.18 3.99-2.18 4.27 0 5.06 2.81 5.06 6.47V22h-4.2v-6.9c0-1.65-.03-3.77-2.3-3.77-2.3 0-2.65 1.79-2.65 3.65V22h-4.2V8Z"/></svg>'],
      ['TikTok','https://www.tiktok.com/@blumark24?_r=1&_t=ZS-95yQcm1ZBxZ','<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.6 5.82a6.35 6.35 0 0 0 3.76 1.2v3.8a10.02 10.02 0 0 1-3.76-.75v5.93A6 6 0 1 1 10.6 10v3.93a2.2 2.2 0 1 0 1.55 2.1V2h4.45v3.82Z"/></svg>']
    ];
    let style=document.querySelector('#bm-runtime-social-css');
    if(!style){style=document.createElement('style');style.id='bm-runtime-social-css';document.head.appendChild(style)}
    style.textContent='.bm-social-replacement{display:flex;gap:12px;align-items:center;justify-content:center;direction:ltr}.bm-social-replacement a{width:48px;height:48px;display:inline-flex;align-items:center;justify-content:center;border-radius:16px;background:rgba(10,22,40,.72);border:1px solid rgba(34,211,238,.22);color:#fff;text-decoration:none;box-shadow:0 0 18px rgba(34,211,238,.14);transition:transform .2s ease,border-color .2s ease,box-shadow .2s ease}.bm-social-replacement a:hover{transform:translateY(-2px);border-color:#22D3EE;box-shadow:0 0 18px rgba(34,211,238,.24)}.bm-social-replacement svg{width:22px;height:22px;display:block}';
    const wrap=document.createElement('div');wrap.className='bm-social-replacement';items.forEach(([label,href,svg])=>{const a=document.createElement('a');a.href=href;a.target='_blank';a.rel='noopener noreferrer';a.setAttribute('aria-label',label);a.innerHTML=svg;wrap.appendChild(a)});
    const nodes=[...document.querySelectorAll('footer div,footer a,footer span')].filter(n=>{const t=(n.textContent||'');return t.includes('💬')||t.includes('💼')||t.includes('🔎')||t.includes('📷')||t.includes('📱')||t.includes('🐦')||t.includes('◎')||t.includes('𝕏')||t.includes('TT')});
    const target=nodes.find(n=>(n.textContent||'').includes('💬')&&(n.textContent||'').includes('💼'))||nodes[0];
    if(target){const container=target.closest('.flex')||target.parentElement||target;container.innerHTML='';container.appendChild(wrap)}
    document.querySelectorAll('a[href*=wa\.me],a[href*=whatsapp]').forEach(a=>{a.href='https://wa.me/966507006849';a.target='_blank';a.rel='noopener noreferrer'});
  }
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',run,{once:true}):run();
})();
