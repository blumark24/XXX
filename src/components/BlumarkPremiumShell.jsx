import { useState } from 'react';
import { FaInstagram, FaLinkedinIn, FaTiktok } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { Menu, X } from 'lucide-react';

const LOGO_SRC = '/assets/branding/blumark24-logo.png';
const WHATSAPP_URL = 'https://wa.me/966551234567';

const navLinks = [
  { label: 'الرئيسية', href: '#hero' },
  { label: 'خدماتنا', href: '#services' },
  { label: 'الباقات', href: '#pricing' },
  { label: 'لماذا Blumark', href: '#why' },
  { label: 'آراء العملاء', href: '#testimonials' },
  { label: 'اتصل بنا', href: '#contact' },
];

const socialLinks = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/blumark24?igsh=eDM3a2VycGFwcnlo',
    icon: FaInstagram,
  },
  {
    label: 'X',
    href: 'https://x.com/blumark24?s=21',
    icon: FaXTwitter,
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/blumark24ksa/',
    icon: FaLinkedinIn,
  },
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com/@blumark24?_r=1&_t=ZS-95yQcm1ZBxZ',
    icon: FaTiktok,
  },
];

const services = ['تصميم المواقع', 'بوت واتساب الذكي', 'المتجر الرقمي', 'CRM', 'تقارير AI'];
const packages = ['START', 'GROWTH', 'PRO MAX'];

function SocialIcons({ className = '' }) {
  return (
    <div className={`flex items-center gap-3 ${className}`} dir="ltr">
      {socialLinks.map(({ label, href, icon: Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="grid h-12 w-12 place-items-center rounded-2xl border border-cyan-300/20 bg-[#0A1628]/70 text-white shadow-[0_0_24px_rgba(34,211,238,.10)] backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-[0_0_18px_rgba(34,211,238,.22)] focus:outline-none focus:ring-2 focus:ring-cyan-300/50"
        >
          <Icon className="h-[22px] w-[22px]" aria-hidden="true" />
        </a>
      ))}
    </div>
  );
}

export function PremiumHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-cyan-300/15 bg-[#0A1628]/72 backdrop-blur-2xl supports-[backdrop-filter]:bg-[#0A1628]/58" dir="ltr">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-20 lg:px-8">
          <a href="#hero" aria-label="Blumark24 الرئيسية" className="flex shrink-0 items-center">
            <img
              src={LOGO_SRC}
              alt="Blumark24"
              width="190"
              height="auto"
              className="block h-auto w-[160px] object-contain md:w-[190px]"
              decoding="async"
              fetchPriority="high"
            />
          </a>

          <nav className="hidden items-center gap-8 lg:flex" dir="rtl" aria-label="روابط الموقع الرئيسية">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-white/70 transition hover:text-cyan-300"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-5 py-3 text-sm font-bold text-white shadow-[0_0_24px_rgba(34,211,238,.12)] transition hover:-translate-y-0.5 hover:border-cyan-300/60 hover:bg-cyan-300/15 lg:inline-flex"
            >
              ابدأ مشروعك الآن
            </a>

            <button
              type="button"
              onClick={() => setIsOpen(true)}
              aria-label="فتح القائمة"
              aria-expanded={isOpen}
              className="grid h-[52px] w-[52px] place-items-center rounded-2xl border border-cyan-300/20 bg-white/[.04] text-cyan-300 shadow-[0_0_24px_rgba(34,211,238,.12)] backdrop-blur-xl transition hover:border-cyan-300/50 hover:bg-cyan-300/10 lg:hidden"
            >
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <MobileSidebar open={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}

function MobileSidebar({ open, onClose }) {
  return (
    <div className={`fixed inset-0 z-[60] lg:hidden ${open ? 'pointer-events-auto' : 'pointer-events-none'}`} aria-hidden={!open}>
      <button
        type="button"
        aria-label="إغلاق خلفية القائمة"
        onClick={onClose}
        className={`absolute inset-0 bg-black/55 backdrop-blur-sm transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}
      />

      <aside
        className={`absolute right-0 top-0 flex h-full w-[min(88vw,390px)] flex-col border-l border-cyan-300/20 bg-[#0A1628]/94 p-5 text-white shadow-[-24px_0_80px_rgba(0,0,0,.45)] backdrop-blur-2xl transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}
        dir="rtl"
        role="dialog"
        aria-modal="true"
        aria-label="قائمة Blumark24"
      >
        <div className="flex items-center justify-between" dir="ltr">
          <img src={LOGO_SRC} alt="Blumark24" width="160" className="block h-auto w-[160px] object-contain" />
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق القائمة"
            className="grid h-12 w-12 place-items-center rounded-2xl border border-cyan-300/20 bg-white/[.04] text-cyan-300 transition hover:border-cyan-300/60 hover:bg-cyan-300/10"
          >
            <X className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <nav className="mt-10 grid gap-3" aria-label="روابط قائمة الجوال">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="rounded-2xl border border-white/5 bg-white/[.03] px-4 py-4 text-base font-semibold text-white/80 transition hover:border-cyan-300/25 hover:bg-cyan-300/10 hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center justify-center rounded-2xl bg-gradient-to-l from-[#22D3EE] to-[#1E6FD9] px-5 py-4 text-base font-extrabold text-white shadow-[0_0_28px_rgba(34,211,238,.24)] transition hover:-translate-y-0.5"
        >
          ابدأ مشروعك الآن
        </a>

        <div className="mt-auto border-t border-cyan-300/15 pt-6">
          <p className="mb-4 text-sm font-bold text-white/60">تواصل معنا</p>
          <SocialIcons className="justify-start" />
        </div>
      </aside>
    </div>
  );
}

export function PremiumFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-cyan-300/15 bg-[#07111f] px-4 py-14 text-white sm:px-6 lg:px-8" dir="rtl">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-cyan-300/60 to-transparent" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-cyan-300/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <img src={LOGO_SRC} alt="Blumark24" width="190" className="mb-5 block h-auto w-[190px] object-contain" />
          <p className="max-w-sm text-sm leading-7 text-white/62">
            Blumark24 شركة حلول ذكاء اصطناعي وأتمتة أعمال تساعد المنشآت في السعودية على بناء حضور رقمي ذكي، تحسين تجربة العملاء، ورفع كفاءة التشغيل.
          </p>
        </div>

        <FooterColumn title="الخدمات" items={services} />
        <FooterColumn title="الباقات" items={packages} />

        <div>
          <h3 className="mb-5 text-base font-extrabold text-white">تواصل معنا</h3>
          <SocialIcons className="mb-6" />
          <div className="space-y-3 text-sm text-white/62" dir="ltr">
            <a className="block transition hover:text-cyan-300" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">+966 55 123 4567</a>
            <a className="block transition hover:text-cyan-300" href="mailto:info@blumark24.com">info@blumark24.com</a>
            <a className="block transition hover:text-cyan-300" href="https://www.blumark24.com" target="_blank" rel="noopener noreferrer">www.blumark24.com</a>
          </div>
        </div>
      </div>

      <div className="relative mx-auto mt-12 flex max-w-7xl flex-col gap-3 border-t border-cyan-300/10 pt-6 text-sm text-white/45 md:flex-row md:items-center md:justify-between" dir="rtl">
        <p>© {new Date().getFullYear()} Blumark24. جميع الحقوق محفوظة.</p>
        <p>AI SaaS Interface · Saudi Market Ready</p>
      </div>
    </footer>
  );
}

function FooterColumn({ title, items }) {
  return (
    <div>
      <h3 className="mb-5 text-base font-extrabold text-white">{title}</h3>
      <ul className="grid gap-3 text-sm text-white/62">
        {items.map((item) => (
          <li key={item}>
            <a href="#services" className="transition hover:text-cyan-300">
              {item}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function BlumarkPremiumShell({ children }) {
  return (
    <div className="min-h-screen bg-[#0A1628] text-white" dir="rtl">
      <PremiumHeader />
      <main className="pt-[76px] lg:pt-20">{children}</main>
      <PremiumFooter />
    </div>
  );
}
