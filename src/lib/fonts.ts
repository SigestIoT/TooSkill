import { Syne, DM_Sans, Instrument_Serif, DM_Mono } from 'next/font/google'

// Display — geometric, architectural (replaces Plus Jakarta Sans)
export const jakarta = Syne({
  subsets: ['latin'],
  variable: '--font-jakarta',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
})

// Body — clean, warm (replaces Inter)
export const inter = DM_Sans({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['300', '400', '500', '600'],
  display: 'swap',
})

// Serif — elegant italic accent moments
export const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  variable: '--font-instrument',
  weight: ['400'],
  style: ['normal', 'italic'],
  display: 'swap',
})

// Mono — labels, counters, technical details
export const dmMono = DM_Mono({
  subsets: ['latin'],
  variable: '--font-dm-mono',
  weight: ['300', '400', '500'],
  display: 'swap',
})
