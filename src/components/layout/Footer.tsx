import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

export default function Footer() {
  const t = useTranslations('footer')
  const year = new Date().getFullYear()

  return (
    <footer className="bg-void relative overflow-hidden">
      {/* Top amber rule */}
      <div className="amber-rule w-full" />

      {/* Ambient glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] pointer-events-none opacity-[0.04]"
        style={{ background: 'radial-gradient(ellipse, #D4973A 0%, transparent 70%)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20 mb-14">

          {/* Brand */}
          <div>
            <span className="font-display font-extrabold text-xl uppercase tracking-tight text-white block mb-4">
              Too<span className="amber-text-gradient">Skill</span>
            </span>
            <p className="text-stone text-sm leading-relaxed mb-2">{t('tagline')}</p>
            <p className="font-mono text-[0.58rem] tracking-[0.2em] uppercase text-amber/35">
              {t('powered_by')}
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-mono text-[0.6rem] tracking-[0.22em] uppercase text-amber/50 mb-5">
              {t('links_title')}
            </h3>
            <ul className="space-y-3">
              {(
                [
                  ['courses', '/corsi'],
                  ['about', '/chi-siamo'],
                  ['contact', '/contatti'],
                ] as const
              ).map(([key, href]) => (
                <li key={key}>
                  <Link
                    href={href}
                    className="text-sm text-stone hover:text-white transition-colors duration-200"
                  >
                    {t(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-mono text-[0.6rem] tracking-[0.22em] uppercase text-amber/50 mb-5">
              Contatti
            </h3>
            <p className="text-sm text-stone mb-2">info@tooskill.it</p>
            <a
              href="https://sigestconsulting.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-stone hover:text-white transition-colors duration-200"
            >
              sigestconsulting.com
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-8"
          style={{ borderTop: '1px solid rgba(212,151,58,0.08)' }}
        >
          <p className="font-mono text-[0.6rem] tracking-[0.18em] uppercase text-stone/40">
            {t('copyright', { year })}
          </p>
          <Link
            href="/privacy"
            className="font-mono text-[0.6rem] tracking-[0.18em] uppercase text-stone/40 hover:text-white transition-colors duration-200"
          >
            {t('privacy')}
          </Link>
        </div>
      </div>
    </footer>
  )
}
