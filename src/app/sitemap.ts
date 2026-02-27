import type { MetadataRoute } from 'next'
import { createAdminClient } from '@/lib/supabase/admin'

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? 'https://tooskill.it'
const locales = ['it', 'en']

function url(path: string) {
  const paths = locales.map((l) => ({
    url: `${BASE}${l === 'it' ? '' : `/${l}`}${path}`,
    lastModified: new Date(),
    alternates: {
      languages: Object.fromEntries(
        locales.map((loc) => [
          loc,
          `${BASE}${loc === 'it' ? '' : `/${loc}`}${path}`,
        ])
      ),
    },
  }))
  return paths
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = ['', '/corsi', '/chi-siamo', '/contatti', '/privacy']
  const staticEntries = staticPaths.flatMap((p) => url(p))

  // Dynamic course pages
  const courseEntries: MetadataRoute.Sitemap = []
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
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
