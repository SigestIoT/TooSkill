import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { getMessages, getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { jakarta, inter, instrumentSerif, dmMono } from '@/lib/fonts'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CookieBanner from '@/components/layout/CookieBanner'
import '../globals.css'

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? 'https://tooskill.it'

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'TooSkill',
  alternateName: 'TooSkill — Sigest S.r.l.',
  url: BASE,
  logo: `${BASE}/icon-512.png`,
  description:
    'Formazione SAP professionale per aziende e professionisti. Corsi certificati, docenti esperti, percorsi personalizzati.',
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'info@tooskill.it',
    contactType: 'customer service',
    availableLanguage: ['Italian', 'English'],
  },
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'hero' })
  const canonicalBase = `${BASE}${locale === 'it' ? '' : `/${locale}`}`

  return {
    title: {
      default: 'TooSkill — Formazione SAP Professionale',
      template: '%s | TooSkill',
    },
    description: t('subheadline'),
    robots: { index: true, follow: true },
    alternates: {
      canonical: canonicalBase,
      languages: { it: BASE, en: `${BASE}/en` },
    },
    openGraph: {
      siteName: 'TooSkill',
      type: 'website',
      locale: locale === 'it' ? 'it_IT' : 'en_US',
      alternateLocale: locale === 'it' ? 'en_US' : 'it_IT',
      url: canonicalBase,
      images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'TooSkill — Formazione SAP' }],
    },
    twitter: {
      card: 'summary_large_image',
      images: ['/opengraph-image'],
    },
  }
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()

  const messages = await getMessages()

  return (
    <html lang={locale} className={`${jakarta.variable} ${inter.variable} ${instrumentSerif.variable} ${dmMono.variable}`}>
      <body className="bg-background text-foreground antialiased">
        <NextIntlClientProvider messages={messages}>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
          />
          <Navbar />
          <main>{children}</main>
          <Footer />
          <CookieBanner />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
