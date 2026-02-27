import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

export default function Footer() {
  const t = useTranslations('footer')
  const year = new Date().getFullYear()

  return (
    <footer className="bg-midnight border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <span className="text-2xl font-display font-extrabold text-white tracking-tight">
              Too<span className="gradient-text">Skill</span>
            </span>
            <p className="mt-3 text-muted-text text-sm leading-relaxed">{t('tagline')}</p>
            <p className="mt-1 text-muted-text/50 text-xs">{t('powered_by')}</p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">{t('links_title')}</h3>
            <ul className="space-y-2.5">
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
                    className="text-sm text-muted-text hover:text-white transition-colors"
                  >
                    {t(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Contatti</h3>
            <p className="text-muted-text text-sm">info@tooskill.it</p>
            <a
              href="https://sigestconsulting.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-text text-sm hover:text-white transition-colors mt-1 block"
            >
              sigestconsulting.com
            </a>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-muted-text/70 text-xs">{t('copyright', { year })}</p>
          <Link
            href="/privacy"
            className="text-muted-text/70 text-xs hover:text-white transition-colors"
          >
            {t('privacy')}
          </Link>
        </div>
      </div>
    </footer>
  )
}
