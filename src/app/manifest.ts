import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'TooSkill — Formazione SAP Professionale',
    short_name: 'TooSkill',
    description: 'Corsi SAP certificati per professionisti e aziende. Formazione pratica, docenti esperti, percorsi personalizzati.',
    start_url: '/',
    display: 'standalone',
    background_color: '#09080A',
    theme_color: '#D4973A',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
