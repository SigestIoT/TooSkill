import type { MetadataRoute } from 'next'
import { createAdminClient } from '@/lib/supabase/admin'

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? 'https://tooskill.it'
const locales = ['it', 'en']

type Frequency = MetadataRoute.Sitemap[number]['changeFrequency']

const priorities: Record<string, number> = {
  '': 1.0,
  '/corsi': 0.9,
  '/contatti': 0.8,
  '/chi-siamo': 0.7,
  '/privacy': 0.3,
}

const frequencies: Record<string, Frequency> = {
  '': 'weekly',
  '/corsi': 'weekly',
  '/contatti': 'monthly',
  '/chi-siamo': 'monthly',
  '/privacy': 'yearly',
}

function url(path: string) {
  return locales.map((l) => ({
    url: `${BASE}${l === 'it' ? '' : `/${l}`}${path}`,
    lastModified: new Date(),
    changeFrequency: frequencies[path] ?? 'monthly',
    priority: priorities[path] ?? 0.6,
    alternates: {
      languages: Object.fromEntries(
        locales.map((loc) => [loc, `${BASE}${loc === 'it' ? '' : `/${loc}`}${path}`])
      ),
    },
  }))
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = ['', '/corsi', '/chi-siamo', '/contatti', '/privacy']
  const staticEntries = staticPaths.flatMap((p) => url(p))

  // Dynamic course pages
  const courseEntries: MetadataRoute.Sitemap = []
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const supabase = createAdminClient()
    const { data } = await supabase
      .from('courses')
      .select('slug, updated_at')
      .eq('is_published', true)
    if (data) {
      for (const course of data) {
        courseEntries.push(
          ...locales.map((l) => ({
            url: `${BASE}${l === 'it' ? '' : `/${l}`}/corsi/${course.slug}`,
            lastModified: new Date(course.updated_at),
            changeFrequency: 'monthly' as Frequency,
            priority: 0.8,
            alternates: {
              languages: Object.fromEntries(
                locales.map((loc) => [
                  loc,
                  `${BASE}${loc === 'it' ? '' : `/${loc}`}/corsi/${course.slug}`,
                ])
              ),
            },
          }))
        )
      }
    }
  }

  return [...staticEntries, ...courseEntries]
}
