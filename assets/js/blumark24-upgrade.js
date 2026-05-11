(() => {
  const LOGO_SRC = '/assets/branding/blumark24-logo.png?v=40';
  const socialLinks = [
    {
      label: 'Instagram',
      href: 'https://www.instagram.com/blumark24?igsh=eDM3a2VycGFwcnlo',
      svg: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7.75 2h8.5A5.76 5.76 0 0 1 22 7.75v8.5A5.76 5.76 0 0 1 16.25 22h-8.5A5.76 5.76 0 0 1 2 16.25v-8.5A5.76 5.76 0 0 1 7.75 2Zm0 2A3.75 3.75 0 0 0 4 7.75v8.5A3.75 3.75 0 0 0 7.75 20h8.5A3.75 3.75 0 0 0 20 16.25v-8.5A3.75 3.75 0 0 0 16.25 4h-8.5Zm8.75 2.15a1.35 1.35 0 1 1 0 2.7 1.35 1.35 0 0 1 0-2.7ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"/></svg>'
    },
    {
      label: 'X',
      href: 'https://x.com/blumark24?s=21',
      svg: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.9 2h3.27l-7.14 8.16L23.43 22h-6.58l-5.15-6.73L5.8 22H2.53l7.64-8.73L2.1 2h6.75l4.66 6.16L18.9 2Zm-1.15 17.92h1.81L7.86 3.97H5.92l11.83 15.95Z"/></svg>'
    },
    {
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/company/blumark24ksa/',
      svg: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5ZM.4 8h4.2v14H.4V8Zm7.1 0h4.02v1.92h.06c.56-1.06 1.94-2.18 3.99-2.18 4.27 0 5.06 2.81 5.06 6.47V22h-4.2v-6.9c0-1.65-.03-3.77-2.3-3.77-2.3 0-2.65 1.79-2.65 3.65V22h-4.2V8Z"/></svg>'
    },
    {
      label: 'TikTok',
      href: 'https://www.tiktok.com/@blumark24?_r=1&_t=ZS-95yQcm1ZBxZ',
      svg: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.6 5.82a6.35 6.35 0 0 0 3.76 1.2v3.8a10.02 10.02 0 0 1-3.76-.75v5.93A6 6 0 1 1 10.6 10v3.93a2.2 2.2 0 1 0 1.55 2.1V2h4.45v3.82Z"/></svg>'
    }
  ];

  function addAssetLinks() {
    if (!document.querySelector('link[href*="blumark24-upgrade.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = '/assets/css/blumark24-upgrade.css?v=2';
      document.head.appendChild(link);
    }
  }

  function upgradeHeader() {
    const navbar = document.querySelector('#navbar, nav');
    if (!navbar) return;

    navbar.classList.add('bm-premium-header');
    const row = navbar.querySelector('.nav-layout-ltr') || navbar.querySelector('.flex.items-center.justify-between') || navbar.firstElementChild;
    if (row) row.classList.add('site-header-row');

    const logo = navbar.querySelector('img.brand-logo, img[alt*="Blumark"], img[src*="logo"]');
    if (logo) {
      logo.src = LOGO_SRC;
      logo.classList.add('brand-logo');
      logo.alt = 'Blumark24';
      logo.setAttribute('decoding', 'async');
      logo.setAttribute('fetchpriority', 'high');
      logo.removeAttribute('height');
    }

    const menu = navbar.querySelector('#menu-toggle, button[onclick*="toggleMenu"], button.lg\\:hidden');
    if (menu) {
      menu.classList.add('menu-button');
      menu.setAttribute('aria-label', 'فتح القائمة');
    }
  }

  function createSocialIcons() {
    const wrap = document.createElement('div');
    wrap.className = 'social-links bm-social-links';
    wrap.setAttribute('aria-label', 'روابط التواصل الاجتماعي');

    socialLinks.forEach(({ label, href, svg }) => {
      const a = document.createElement('a');
      a.className = 'social-link';
      a.href = href;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.setAttribute('aria-label', label);
      a.innerHTML = svg;
      wrap.appendChild(a);
    });
    return wrap;
  }

  function replaceSocialBlocks() {
    const legacyTextNodes = [...document.querySelectorAll('a, span, div')].filter((node) => {
      const txt = (node.textContent || '').trim();
      return txt.includes('📷') || txt.includes('🐦') || txt.includes('💼') || txt.includes('💬');
    });

    legacyTextNodes.slice(0, 3).forEach((node) => {
      if (!node.closest('.bm-social-links')) {
        node.replaceWith(createSocialIcons());
      }
    });

    const footer = document.querySelector('footer');
    if (footer && !footer.querySelector('.bm-social-links')) {
      const box = document.createElement('div');
      box.className = 'bm-footer-social-injection';
      box.innerHTML = '<p class="bm-social-title">تواصل معنا</p>';
      box.appendChild(createSocialIcons());
      footer.appendChild(box);
    }
  }

  function upgradeLinks() {
    document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp"]').forEach((a) => {
      a.href = 'https://wa.me/966507006849';
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.setAttribute('aria-label', a.getAttribute('aria-label') || 'تواصل عبر واتساب');
    });
  }

  function addMeta() {
    const metas = [
      ['description', 'Blumark24 تقدم حلول الذكاء الاصطناعي للأعمال، أتمتة العمليات، الشات بوت الذكي، المواقع الاحترافية، والتحول الرقمي للشركات في السعودية.'],
      ['robots', 'index, follow'],
      ['theme-color', '#0A1628']
    ];
    metas.forEach(([name, content]) => {
      if (!document.querySelector(`meta[name="${name}"]`)) {
        const meta = document.createElement('meta');
        meta.name = name;
        meta.content = content;
        document.head.appendChild(meta);
      }
    });
  }

  function run() {
    addAssetLinks();
    addMeta();
    upgradeHeader();
    replaceSocialBlocks();
    upgradeLinks();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true });
  } else {
    run();
  }
})();
