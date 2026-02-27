# TooSkill Website — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task-by-task.

**Goal:** Build the complete TooSkill SAP training website — marketing vetrina, dynamic course catalog with admin CRUD, lead capture via contact forms, bilingual IT/EN, deployed on Vercel.

**Architecture:** Next.js 15 App Router with `[locale]` dynamic segment for i18n (next-intl). Public routes under `src/app/[locale]/`. Admin panel outside locale routing at `src/app/admin/[guid]/`. API routes under `src/app/api/`. Supabase PostgreSQL for persistence. JWT httpOnly cookie for admin auth. Resend for transactional email.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS v4, shadcn/ui (New York), Framer Motion, next-intl v4, Supabase JS v2, @supabase/ssr, Resend v4, jose v5, bcryptjs, Vercel

**Design reference:** `docs/plans/2026-02-27-tooskill-website-design.md`

---

## Task 1: Project Bootstrap

**Files:**
- Create: entire project via `create-next-app`
- Create: `.env.local.example`
- Create: `src/types/` directory

**Step 1: Scaffold**

```bash
# Run inside TooSkill_v2/ (directory must be empty or just have docs/)
npx create-next-app@latest . \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"
# When prompted: npm, No to Turbopack
```

**Step 2: Install dependencies**

```bash
npm install next-intl framer-motion @supabase/supabase-js @supabase/ssr resend jose bcryptjs
npm install -D @types/bcryptjs
```

**Step 3: Init shadcn/ui**

```bash
npx shadcn@latest init
# Style: New York | Base color: Slate | CSS variables: yes

npx shadcn@latest add button badge card input textarea label select \
  dialog table tabs separator scroll-area dropdown-menu
```

**Step 4: Create `.env.local.example`**

```bash
# .env.local.example
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

RESEND_API_KEY=
ADMIN_EMAIL=

ADMIN_ROUTE_GUID=
ADMIN_PASSWORD_HASH=
ADMIN_JWT_SECRET=

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Copy to `.env.local` before development. `ADMIN_PASSWORD_HASH` = `bcryptjs.hashSync("yourpassword", 12)` — generate via a one-off Node script.

**Step 5: Verify**

```bash
npm run dev
# Expected: server starts on http://localhost:3000, no TS errors
```

**Step 6: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js 15 + deps + shadcn/ui"
```

---

## Task 2: Design System — Tokens, Fonts, Global Styles

**Files:**
- Modify: `src/app/globals.css`
- Create: `src/lib/fonts.ts`

**Step 1: Add fonts — `src/lib/fonts.ts`**

```ts
import { Plus_Jakarta_Sans, Inter } from 'next/font/google'

export const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
})

export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})
```

**Step 2: Replace `src/app/globals.css`**

```css
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  /* Brand colors */
  --color-midnight: #060B18;
  --color-deep: #0D1B2A;
  --color-primary: #4F6EF7;
  --color-primary-dark: #3D58E8;
  --color-cyan: #00C9FF;
  --color-surface: #F8FAFF;
  --color-muted-text: #8892A4;

  /* Fonts */
  --font-sans: var(--font-inter);
  --font-display: var(--font-jakarta);

  /* shadcn/ui overrides */
  --radius: 0.75rem;
  --background: #ffffff;
  --foreground: #0D1B2A;
  --primary: #4F6EF7;
  --primary-foreground: #ffffff;
  --muted: #F8FAFF;
  --muted-foreground: #8892A4;
  --border: #E2E8F0;
  --ring: #4F6EF7;
}

* {
  border-color: var(--color-border);
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-sans), sans-serif;
  background: var(--background);
  color: var(--foreground);
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-display), sans-serif;
}

/* Glow utility */
.glow-primary {
  box-shadow: 0 0 40px rgba(79, 110, 247, 0.3);
}
.glow-cyan {
  box-shadow: 0 0 40px rgba(0, 201, 255, 0.25);
}

/* Gradient text utility */
.gradient-text {
  background: linear-gradient(135deg, #4F6EF7 0%, #00C9FF 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Glassmorphism card */
.glass-card {
  background: rgba(13, 27, 42, 0.6);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(79, 110, 247, 0.2);
}

/* Mesh gradient background */
.mesh-bg {
  background:
    radial-gradient(ellipse 80% 50% at 20% 40%, rgba(79, 110, 247, 0.15) 0%, transparent 60%),
    radial-gradient(ellipse 60% 40% at 80% 60%, rgba(0, 201, 255, 0.1) 0%, transparent 60%),
    #060B18;
}
```

**Step 3: Verify fonts load**

```bash
npm run dev
# Check browser: fonts should be Plus Jakarta Sans (headings) and Inter (body)
```

**Step 4: Commit**

```bash
git add src/app/globals.css src/lib/fonts.ts
git commit -m "feat: design system tokens, fonts, global styles"
```

---

## Task 3: i18n Setup (next-intl)

**Files:**
- Create: `src/i18n/routing.ts`
- Create: `src/i18n/navigation.ts`
- Create: `src/i18n/request.ts`
- Create: `src/middleware.ts`
- Create: `messages/it.json`
- Create: `messages/en.json`

**Step 1: `src/i18n/routing.ts`**

```ts
import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['it', 'en'],
  defaultLocale: 'it',
})
```

**Step 2: `src/i18n/navigation.ts`**

```ts
import { createNavigation } from 'next-intl/navigation'
import { routing } from './routing'

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing)
```

**Step 3: `src/i18n/request.ts`**

```ts
import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'
import { hasLocale } from 'next-intl'

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  }
})
```

**Step 4: `src/middleware.ts`**

```ts
import createIntlMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import { NextResponse, type NextRequest } from 'next/server'

const intlMiddleware = createIntlMiddleware(routing)

export function middleware(request: NextRequest) {
  // Admin routes: skip i18n, handle separately
  if (request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.next()
  }
  return intlMiddleware(request)
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
```

**Step 5: `messages/it.json`** (starter — expand as needed)

```json
{
  "nav": {
    "courses": "Corsi",
    "about": "Chi siamo",
    "contact": "Contatti",
    "cta": "Esplora i Corsi"
  },
  "hero": {
    "badge": "Formazione SAP Professionale",
    "headline": "Trasforma il tuo team in esperti SAP",
    "subheadline": "Percorsi formativi pratici e personalizzati, sviluppati da consulenti attivi con oltre 20 anni di esperienza nel mondo SAP.",
    "cta_primary": "Scopri i Corsi",
    "cta_secondary": "Contattaci"
  },
  "stats": {
    "years": "anni di esperienza",
    "projects": "progetti realizzati",
    "countries": "paesi serviti",
    "collaborators": "collaboratori"
  },
  "why": {
    "title": "Perché scegliere TooSkill",
    "subtitle": "Non la solita formazione. Corsi progettati da chi lavora ogni giorno con SAP in progetti reali.",
    "items": [
      {
        "title": "100% Pratico",
        "desc": "Niente teoria inutile. Ogni modulo è costruito attorno a casi d'uso reali e scenari aziendali concreti."
      },
      {
        "title": "Docenti-Consulenti",
        "desc": "I nostri formatori sono consulenti SAP attivi. Portano in aula l'esperienza di decine di progetti."
      },
      {
        "title": "Su Misura",
        "desc": "Analizziamo le esigenze della tua azienda e costruiamo un percorso formativo adatto alla tua realtà."
      },
      {
        "title": "Risultati Misurabili",
        "desc": "Meno errori, processi più fluidi, team più autonomi. Ogni corso punta a obiettivi concreti e verificabili."
      }
    ]
  },
  "how": {
    "title": "Come funziona",
    "subtitle": "Un processo semplice, pensato per adattarsi alle tue esigenze senza complicazioni.",
    "steps": [
      { "step": "01", "title": "Analisi", "desc": "Comprendiamo le tue esigenze, il livello del team e gli obiettivi aziendali." },
      { "step": "02", "title": "Formazione", "desc": "Eroghiamo il corso nel formato più adatto: in presenza, virtuale o blended." },
      { "step": "03", "title": "Risultati", "desc": "Il tuo team opera con maggiore autonomia, efficienza e competenza su SAP." }
    ]
  },
  "levels": {
    "title": "I nostri percorsi",
    "subtitle": "Quattro livelli di intensità per adattarsi a qualsiasi esigenza, da un aggiornamento rapido a una formazione completa.",
    "items": [
      {
        "name": "Express",
        "desc": "Aggiornamento rapido e mirato. Ideale per chi ha già una base e necessita di colmare lacune specifiche.",
        "duration": "1–2 giorni"
      },
      {
        "name": "Base",
        "desc": "Il punto di partenza ideale per chi si avvicina per la prima volta al mondo SAP.",
        "duration": "3–5 giorni"
      },
      {
        "name": "Completa",
        "desc": "Formazione approfondita per diventare esperti di uno o più moduli SAP.",
        "duration": "2–4 settimane"
      },
      {
        "name": "Personalizzata",
        "desc": "Progettata interamente sulle esigenze specifiche della tua azienda e del tuo team.",
        "duration": "Su richiesta"
      }
    ]
  },
  "featured": {
    "title": "Corsi in evidenza",
    "subtitle": "Scopri i percorsi formativi più richiesti dalle aziende.",
    "cta": "Vedi tutti i corsi",
    "request": "Richiedi info"
  },
  "cta_section": {
    "title": "Pronto a potenziare il tuo team?",
    "subtitle": "Parliamo delle tue esigenze. Ti proporremo il percorso formativo più adatto alla tua realtà aziendale.",
    "button": "Contattaci ora"
  },
  "courses": {
    "title": "Tutti i corsi",
    "subtitle": "Formazione SAP pratica e personalizzata per ogni livello e modulo.",
    "filter_module": "Filtra per modulo",
    "filter_level": "Filtra per livello",
    "all": "Tutti",
    "duration": "Durata",
    "hours": "ore",
    "request_info": "Richiedi informazioni",
    "no_results": "Nessun corso trovato con i filtri selezionati."
  },
  "course_detail": {
    "objectives": "Obiettivi del corso",
    "program": "Programma",
    "prerequisites": "Prerequisiti",
    "duration": "Durata",
    "level": "Livello",
    "module": "Modulo SAP",
    "register": "Iscriviti o richiedi info",
    "related": "Corsi correlati"
  },
  "contact": {
    "title": "Contattaci",
    "subtitle": "Hai domande sui nostri corsi? Vuoi un programma su misura per la tua azienda? Scrivici.",
    "name": "Nome e Cognome",
    "email": "Email",
    "company": "Azienda",
    "phone": "Telefono",
    "message": "Messaggio",
    "course": "Corso di interesse (opzionale)",
    "submit": "Invia richiesta",
    "success": "Grazie! Ti risponderemo al più presto.",
    "error": "Si è verificato un errore. Riprova."
  },
  "about": {
    "title": "Chi siamo",
    "subtitle": "TooSkill nasce dall'esperienza di Sigest per portare la formazione SAP a un livello superiore.",
    "sigest_title": "Sigest — La nostra origine",
    "sigest_desc": "Con oltre 20 anni di consulenza SAP e più di 100 progetti realizzati in 10+ paesi, Sigest è un punto di riferimento per la digital transformation basata su SAP. TooSkill è la naturale evoluzione di questa esperienza: formazione pratica, concreta, erogata da chi SAP lo usa ogni giorno.",
    "values_title": "I nostri valori",
    "values": [
      { "title": "Praticità", "desc": "Ogni ora di formazione deve tradursi in valore operativo concreto." },
      { "title": "Competenza", "desc": "I nostri docenti sono professionisti attivi, non solo insegnanti." },
      { "title": "Personalizzazione", "desc": "Nessun corso standard: adattiamo tutto alla tua realtà." },
      { "title": "Risultati", "desc": "Misuriamo il successo dai miglioramenti operativi del tuo team." }
    ]
  },
  "footer": {
    "tagline": "Formazione SAP pratica e personalizzata.",
    "powered_by": "Un brand Sigest Consulting",
    "links_title": "Link utili",
    "courses": "Corsi",
    "about": "Chi siamo",
    "contact": "Contatti",
    "privacy": "Privacy Policy",
    "copyright": "© {year} TooSkill by Sigest. Tutti i diritti riservati."
  },
  "modules": {
    "FI": "Contabilità Finanziaria",
    "CO": "Controlling",
    "SCM": "Supply Chain",
    "ABAP": "Sviluppo ABAP",
    "FIORI": "SAP Fiori / UX",
    "S4HANA": "S/4HANA",
    "HANA": "SAP HANA",
    "OTHER": "Altro"
  },
  "levels_map": {
    "express": "Express",
    "base": "Base",
    "completa": "Completa",
    "personalizzata": "Personalizzata"
  }
}
```

**Step 6: `messages/en.json`** — scaffold with same keys, English values (translate the Italian above; keep structure identical)

Key English values (fill rest by translation):
```json
{
  "nav": { "courses": "Courses", "about": "About", "contact": "Contact", "cta": "Explore Courses" },
  "hero": {
    "badge": "Professional SAP Training",
    "headline": "Transform your team into SAP experts",
    "subheadline": "Practical, customized training programs developed by active consultants with 20+ years of SAP experience.",
    "cta_primary": "Explore Courses",
    "cta_secondary": "Contact Us"
  }
}
```
(Continue translating all keys from `it.json`)

**Step 7: `next.config.ts`** — add next-intl plugin

```ts
import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
    ],
  },
}

export default withNextIntl(nextConfig)
```

**Step 8: Verify**

```bash
npm run build
# Expected: Build succeeds, [locale] routes generated
```

**Step 9: Commit**

```bash
git add -A
git commit -m "feat: next-intl i18n setup, messages IT/EN"
```

---

## Task 4: Supabase — Schema, Client, Types

**Files:**
- Create: `supabase/schema.sql`
- Create: `src/lib/supabase/client.ts`
- Create: `src/lib/supabase/server.ts`
- Create: `src/lib/supabase/admin.ts`
- Create: `src/types/database.ts`

**Step 1: `supabase/schema.sql`** — run this in Supabase SQL editor

```sql
-- Enum-like text constraints
CREATE TABLE courses (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          text UNIQUE NOT NULL,
  title         jsonb NOT NULL DEFAULT '{"it":"","en":""}',
  description   jsonb NOT NULL DEFAULT '{"it":"","en":""}',
  objectives    jsonb DEFAULT '{"it":[],"en":[]}',
  program       jsonb DEFAULT '{"it":[],"en":[]}',
  prerequisites jsonb DEFAULT '{"it":"","en":""}',
  module        text NOT NULL CHECK (module IN ('FI','CO','SCM','ABAP','FIORI','S4HANA','HANA','OTHER')),
  level         text NOT NULL CHECK (level IN ('express','base','completa','personalizzata')),
  duration_hours integer,
  price_info    text,
  image_url     text,
  is_published  boolean NOT NULL DEFAULT false,
  is_featured   boolean NOT NULL DEFAULT false,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE contact_requests (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text NOT NULL,
  email         text NOT NULL,
  company       text,
  phone         text,
  course_id     uuid REFERENCES courses(id) ON DELETE SET NULL,
  course_title  text,
  message       text NOT NULL,
  type          text NOT NULL DEFAULT 'general' CHECK (type IN ('course_inquiry','general','custom_training')),
  status        text NOT NULL DEFAULT 'new' CHECK (status IN ('new','read','replied')),
  locale        text NOT NULL DEFAULT 'it',
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- RLS: enable and restrict
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;

-- Public can read published courses
CREATE POLICY "Public read published courses"
  ON courses FOR SELECT
  USING (is_published = true);

-- contact_requests: public can insert only (no select)
CREATE POLICY "Public insert contact_requests"
  ON contact_requests FOR INSERT
  WITH CHECK (true);

-- Service role bypasses RLS (used server-side for admin)
```

**Step 2: `src/lib/supabase/client.ts`** — browser client

```ts
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

**Step 3: `src/lib/supabase/server.ts`** — server component client

```ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        },
      },
    }
  )
}
```

**Step 4: `src/lib/supabase/admin.ts`** — service role client for admin operations

```ts
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

export function createAdminClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}
```

**Step 5: `src/types/database.ts`**

```ts
export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export type CourseModule = 'FI' | 'CO' | 'SCM' | 'ABAP' | 'FIORI' | 'S4HANA' | 'HANA' | 'OTHER'
export type CourseLevel = 'express' | 'base' | 'completa' | 'personalizzata'
export type ContactType = 'course_inquiry' | 'general' | 'custom_training'
export type ContactStatus = 'new' | 'read' | 'replied'

export interface LocalizedString {
  it: string
  en: string
}

export interface ProgramSection {
  title: string
  items: string[]
}

export interface LocalizedProgram {
  it: ProgramSection[]
  en: ProgramSection[]
}

export interface LocalizedStringArray {
  it: string[]
  en: string[]
}

export interface Course {
  id: string
  slug: string
  title: LocalizedString
  description: LocalizedString
  objectives: LocalizedStringArray
  program: LocalizedProgram
  prerequisites: LocalizedString
  module: CourseModule
  level: CourseLevel
  duration_hours: number | null
  price_info: string | null
  image_url: string | null
  is_published: boolean
  is_featured: boolean
  created_at: string
  updated_at: string
}

export interface ContactRequest {
  id: string
  name: string
  email: string
  company: string | null
  phone: string | null
  course_id: string | null
  course_title: string | null
  message: string
  type: ContactType
  status: ContactStatus
  locale: string
  created_at: string
}

export interface Database {
  public: {
    Tables: {
      courses: { Row: Course; Insert: Omit<Course, 'id' | 'created_at' | 'updated_at'>; Update: Partial<Omit<Course, 'id' | 'created_at'>> }
      contact_requests: { Row: ContactRequest; Insert: Omit<ContactRequest, 'id' | 'created_at' | 'status'>; Update: Partial<Pick<ContactRequest, 'status'>> }
    }
  }
}
```

**Step 6: Verify**

```bash
npm run build
# Expected: TypeScript compiles, no type errors
```

**Step 7: Commit**

```bash
git add -A
git commit -m "feat: Supabase schema, clients, database types"
```

---

## Task 5: Root Layout + Navbar + Footer

**Files:**
- Modify: `src/app/layout.tsx` (root — minimal, no locale)
- Create: `src/app/[locale]/layout.tsx`
- Create: `src/components/layout/Navbar.tsx`
- Create: `src/components/layout/Footer.tsx`
- Create: `src/components/layout/LanguageSwitcher.tsx`

**Step 1: Root `src/app/layout.tsx`**

```tsx
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://tooskill.it'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children
}
```

**Step 2: `src/app/[locale]/layout.tsx`**

```tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { getMessages, getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { jakarta, inter } from '@/lib/fonts'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import '../globals.css'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'hero' })
  return {
    title: { default: 'TooSkill — Formazione SAP', template: '%s | TooSkill' },
    description: t('subheadline'),
    openGraph: { siteName: 'TooSkill', locale: locale === 'it' ? 'it_IT' : 'en_US' },
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
    <html lang={locale} className={`${jakarta.variable} ${inter.variable}`}>
      <body className="bg-white text-deep antialiased">
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
```

**Step 3: `src/components/layout/LanguageSwitcher.tsx`**

```tsx
'use client'
import { useLocale } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/navigation'

export default function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const toggle = () => {
    router.replace(pathname, { locale: locale === 'it' ? 'en' : 'it' })
  }

  return (
    <button
      onClick={toggle}
      className="text-sm font-medium text-muted-text hover:text-primary transition-colors px-2 py-1 rounded border border-transparent hover:border-primary/30"
    >
      {locale === 'it' ? 'EN' : 'IT'}
    </button>
  )
}
```

**Step 4: `src/components/layout/Navbar.tsx`**

```tsx
'use client'
import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'
import LanguageSwitcher from './LanguageSwitcher'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const t = useTranslations('nav')
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { href: '/corsi', label: t('courses') },
    { href: '/chi-siamo', label: t('about') },
    { href: '/contatti', label: t('contact') },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-deep/95 backdrop-blur-md shadow-lg border-b border-primary/10' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-display font-800 text-white">
              Too<span className="gradient-text">Skill</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {links.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-white/70 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher />
            <Button asChild size="sm" className="bg-primary hover:bg-primary-dark text-white">
              <Link href="/corsi">{t('cta')}</Link>
            </Button>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-deep/98 backdrop-blur-md border-t border-white/10 px-4 pb-4">
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="block py-3 text-white/80 hover:text-white border-b border-white/5"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex items-center gap-3 pt-4">
            <LanguageSwitcher />
            <Button asChild size="sm" className="bg-primary text-white flex-1">
              <Link href="/corsi">{t('cta')}</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
```

**Step 5: `src/components/layout/Footer.tsx`**

```tsx
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

export default function Footer() {
  const t = useTranslations('footer')
  const year = new Date().getFullYear()

  return (
    <footer className="bg-midnight border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <span className="text-2xl font-display font-800 text-white">
              Too<span className="gradient-text">Skill</span>
            </span>
            <p className="mt-2 text-muted-text text-sm">{t('tagline')}</p>
            <p className="mt-1 text-muted-text/60 text-xs">{t('powered_by')}</p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">{t('links_title')}</h3>
            <ul className="space-y-2 text-sm text-muted-text">
              {(['courses','/corsi'], ['about','/chi-siamo'], ['contact','/contatti']).map(([key, href]) => (
                <li key={key}>
                  <Link href={href} className="hover:text-white transition-colors">
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
            <p className="text-muted-text text-sm mt-1">
              <a href="https://sigestconsulting.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                sigestconsulting.com
              </a>
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-muted-text text-xs">{t('copyright', { year })}</p>
          <Link href="/privacy" className="text-muted-text text-xs hover:text-white transition-colors">
            {t('privacy')}
          </Link>
        </div>
      </div>
    </footer>
  )
}
```

**Step 6: Verify**

```bash
npm run dev
# Navigate to http://localhost:3000 — Navbar should render with gradient logo
# Scroll — Navbar should transition from transparent to deep blue
npm run build
```

**Step 7: Commit**

```bash
git add -A
git commit -m "feat: Navbar (sticky, scrolled state, mobile menu), Footer, LanguageSwitcher"
```

---

## Task 6: Homepage — Hero + Trust Bar

**Files:**
- Create: `src/app/[locale]/page.tsx`
- Create: `src/components/home/Hero.tsx`
- Create: `src/components/home/TrustBar.tsx`

**Step 1: `src/app/[locale]/page.tsx`**

```tsx
import Hero from '@/components/home/Hero'
import TrustBar from '@/components/home/TrustBar'
import WhyTooSkill from '@/components/home/WhyTooSkill'
import HowItWorks from '@/components/home/HowItWorks'
import TrainingLevels from '@/components/home/TrainingLevels'
import StatsSection from '@/components/home/StatsSection'
import FeaturedCourses from '@/components/home/FeaturedCourses'
import CtaSection from '@/components/home/CtaSection'

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <WhyTooSkill />
      <HowItWorks />
      <TrainingLevels />
      <StatsSection />
      <FeaturedCourses />
      <CtaSection />
    </>
  )
}
```

**Step 2: `src/components/home/Hero.tsx`**

```tsx
'use client'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { ArrowRight, ChevronDown } from 'lucide-react'

const stats = [
  { value: '20+', key: 'years' },
  { value: '100+', key: 'projects' },
  { value: '10+', key: 'countries' },
]

export default function Hero() {
  const t = useTranslations('hero')
  const ts = useTranslations('stats')

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center mesh-bg overflow-hidden">
      {/* Animated grid overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'linear-gradient(rgba(79,110,247,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(79,110,247,.5) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-cyan/8 blur-3xl" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-cyan animate-pulse" />
          {t('badge')}
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl lg:text-7xl font-display font-800 text-white leading-[1.1] tracking-tight mb-6"
        >
          {t('headline').split('SAP').map((part, i, arr) =>
            i < arr.length - 1 ? (
              <span key={i}>
                {part}
                <span className="gradient-text">SAP</span>
              </span>
            ) : part
          )}
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          {t('subheadline')}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Button asChild size="lg" className="bg-primary hover:bg-primary-dark text-white glow-primary px-8 py-6 text-base">
            <Link href="/corsi">
              {t('cta_primary')} <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/5 px-8 py-6 text-base">
            <Link href="/contatti">{t('cta_secondary')}</Link>
          </Button>
        </motion.div>

        {/* Stat chips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          {stats.map((s) => (
            <div key={s.key} className="glass-card rounded-xl px-6 py-3 text-center">
              <p className="text-2xl font-display font-800 gradient-text">{s.value}</p>
              <p className="text-xs text-white/50 mt-1">{ts(s.key)}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/30 animate-bounce"
      >
        <ChevronDown size={24} />
      </motion.div>
    </section>
  )
}
```

**Step 3: `src/components/home/TrustBar.tsx`**

```tsx
import { Badge } from '@/components/ui/badge'

const modules = ['SAP FI', 'SAP CO', 'S/4HANA', 'SAP ABAP', 'SAP HANA', 'SAP Fiori', 'Supply Chain']

export default function TrustBar() {
  return (
    <section className="bg-surface border-y border-border/50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <p className="text-muted-text text-sm font-medium shrink-0">Moduli coperti:</p>
          <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
            {modules.map((m) => (
              <Badge key={m} variant="secondary" className="bg-primary/8 text-primary border border-primary/20 text-xs">
                {m}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
```

**Step 4: Verify**

```bash
npm run dev
# http://localhost:3000 — Hero should render with dark background, gradient headline, stat chips
# Navbar should be transparent over hero, blue on scroll
```

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: homepage Hero section with animations, TrustBar modules"
```

---

## Task 7: Homepage — Why, How It Works, Training Levels

**Files:**
- Create: `src/components/home/WhyTooSkill.tsx`
- Create: `src/components/home/HowItWorks.tsx`
- Create: `src/components/home/TrainingLevels.tsx`

**Step 1: `src/components/home/WhyTooSkill.tsx`**

```tsx
'use client'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { Lightbulb, Users, Settings, TrendingUp } from 'lucide-react'

const icons = [Lightbulb, Users, Settings, TrendingUp]

export default function WhyTooSkill() {
  const t = useTranslations('why')
  const items = t.raw('items') as { title: string; desc: string }[]

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-display font-800 text-deep">{t('title')}</h2>
          <p className="mt-4 text-muted-text max-w-2xl mx-auto">{t('subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item, i) => {
            const Icon = icons[i]
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-6 rounded-2xl border border-border/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display font-700 text-deep text-lg mb-2">{item.title}</h3>
                <p className="text-muted-text text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
```

**Step 2: `src/components/home/HowItWorks.tsx`**

```tsx
'use client'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'

export default function HowItWorks() {
  const t = useTranslations('how')
  const steps = t.raw('steps') as { step: string; title: string; desc: string }[]

  return (
    <section className="py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-display font-800 text-deep">{t('title')}</h2>
          <p className="mt-4 text-muted-text max-w-xl mx-auto">{t('subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector line (desktop) */}
          <div className="hidden md:block absolute top-12 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-primary/30 via-cyan/50 to-primary/30" />

          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative text-center"
            >
              <div className="w-24 h-24 rounded-full bg-midnight flex items-center justify-center mx-auto mb-6 relative z-10">
                <span className="text-3xl font-display font-800 gradient-text">{step.step}</span>
              </div>
              <h3 className="text-xl font-display font-700 text-deep mb-3">{step.title}</h3>
              <p className="text-muted-text text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

**Step 3: `src/components/home/TrainingLevels.tsx`**

```tsx
'use client'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { Zap, BookOpen, GraduationCap, Puzzle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const icons = [Zap, BookOpen, GraduationCap, Puzzle]
const accents = ['border-yellow-400/30 hover:border-yellow-400/60', 'border-primary/30 hover:border-primary/60', 'border-cyan/30 hover:border-cyan/60', 'border-purple-400/30 hover:border-purple-400/60']

export default function TrainingLevels() {
  const t = useTranslations('levels')
  const items = t.raw('items') as { name: string; desc: string; duration: string }[]

  return (
    <section className="py-24 bg-midnight">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-display font-800 text-white">{t('title')}</h2>
          <p className="mt-4 text-white/50 max-w-xl mx-auto">{t('subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, i) => {
            const Icon = icons[i]
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`glass-card rounded-2xl p-6 border transition-all cursor-default ${accents[i]}`}
              >
                <Icon className="w-8 h-8 text-white/60 mb-4" />
                <Badge variant="outline" className="text-white/60 border-white/20 text-xs mb-3">
                  {item.duration}
                </Badge>
                <h3 className="text-xl font-display font-700 text-white mb-2">{item.name}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
```

**Step 4: Verify**

```bash
npm run dev
# Scroll down on homepage — all three sections should appear with scroll animations
```

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: homepage WhyTooSkill, HowItWorks, TrainingLevels sections"
```

---

## Task 8: Homepage — Stats, Featured Courses, CTA

**Files:**
- Create: `src/components/home/StatsSection.tsx`
- Create: `src/components/home/FeaturedCourses.tsx`
- Create: `src/components/courses/CourseCard.tsx`
- Create: `src/components/home/CtaSection.tsx`

**Step 1: `src/components/home/StatsSection.tsx`**

```tsx
'use client'
import { useTranslations } from 'next-intl'
import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

const statsData = [
  { value: 20, suffix: '+', key: 'years' },
  { value: 100, suffix: '+', key: 'projects' },
  { value: 10, suffix: '+', key: 'countries' },
  { value: 20, suffix: '+', key: 'collaborators' },
]

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    let start = 0
    const step = Math.ceil(value / 40)
    const timer = setInterval(() => {
      start += step
      if (start >= value) { setCount(value); clearInterval(timer) }
      else setCount(start)
    }, 30)
    return () => clearInterval(timer)
  }, [inView, value])

  return (
    <span ref={ref} className="text-4xl sm:text-5xl font-display font-800 gradient-text">
      {count}{suffix}
    </span>
  )
}

export default function StatsSection() {
  const t = useTranslations('stats')

  return (
    <section className="py-20 bg-white border-y border-border/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {statsData.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <Counter value={s.value} suffix={s.suffix} />
              <p className="text-muted-text text-sm mt-2">{t(s.key)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

**Step 2: `src/components/courses/CourseCard.tsx`**

```tsx
import { Link } from '@/i18n/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Clock, ArrowRight } from 'lucide-react'
import type { Course } from '@/types/database'

interface Props {
  course: Course
  locale: string
  requestLabel?: string
}

const moduleColors: Record<string, string> = {
  FI: 'bg-blue-100 text-blue-700',
  CO: 'bg-purple-100 text-purple-700',
  SCM: 'bg-green-100 text-green-700',
  ABAP: 'bg-orange-100 text-orange-700',
  FIORI: 'bg-pink-100 text-pink-700',
  S4HANA: 'bg-indigo-100 text-indigo-700',
  HANA: 'bg-cyan-100 text-cyan-700',
  OTHER: 'bg-gray-100 text-gray-700',
}

export default function CourseCard({ course, locale, requestLabel = 'Richiedi info' }: Props) {
  const title = (course.title as any)[locale] || (course.title as any).it
  const description = (course.description as any)[locale] || (course.description as any).it

  return (
    <div className="group flex flex-col rounded-2xl border border-border/50 bg-white hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 overflow-hidden">
      {/* Color bar */}
      <div className="h-1 bg-gradient-to-r from-primary to-cyan" />

      <div className="flex flex-col flex-1 p-6">
        <div className="flex items-start justify-between gap-3 mb-3">
          <Badge className={`text-xs ${moduleColors[course.module] ?? moduleColors.OTHER}`}>
            SAP {course.module}
          </Badge>
          <Badge variant="outline" className="text-xs capitalize text-muted-text">
            {course.level}
          </Badge>
        </div>

        <h3 className="font-display font-700 text-deep text-lg leading-snug mb-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-muted-text text-sm leading-relaxed flex-1 line-clamp-3">
          {description}
        </p>

        <div className="flex items-center justify-between mt-6">
          {course.duration_hours && (
            <span className="flex items-center gap-1.5 text-xs text-muted-text">
              <Clock size={14} /> {course.duration_hours}h
            </span>
          )}
          <Button asChild size="sm" className="ml-auto bg-primary hover:bg-primary-dark text-white">
            <Link href={`/corsi/${course.slug}`}>
              {requestLabel} <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
```

**Step 3: `src/components/home/FeaturedCourses.tsx`**

```tsx
import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'
import CourseCard from '@/components/courses/CourseCard'
import { createClient } from '@/lib/supabase/server'
import { ArrowRight } from 'lucide-react'

export default async function FeaturedCourses() {
  const t = useTranslations('featured')
  const locale = useLocale()

  const supabase = await createClient()
  const { data: courses } = await supabase
    .from('courses')
    .select('*')
    .eq('is_published', true)
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(3)

  if (!courses?.length) return null

  return (
    <section className="py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-display font-800 text-deep">{t('title')}</h2>
            <p className="mt-2 text-muted-text">{t('subtitle')}</p>
          </div>
          <Button asChild variant="outline" className="shrink-0">
            <Link href="/corsi">{t('cta')} <ArrowRight className="ml-2 w-4 h-4" /></Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} locale={locale} requestLabel={t('request')} />
          ))}
        </div>
      </div>
    </section>
  )
}
```

**Step 4: `src/components/home/CtaSection.tsx`**

```tsx
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'

export default function CtaSection() {
  const t = useTranslations('cta_section')

  return (
    <section className="py-24 mesh-bg relative overflow-hidden">
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #4F6EF7 0%, transparent 70%)' }}
      />
      <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-3xl sm:text-5xl font-display font-800 text-white leading-tight mb-6">
          {t('title')}
        </h2>
        <p className="text-white/60 text-lg mb-10 leading-relaxed">{t('subtitle')}</p>
        <Button asChild size="lg" className="bg-primary hover:bg-primary-dark glow-primary text-white px-10 py-6 text-base">
          <Link href="/contatti">{t('button')}</Link>
        </Button>
      </div>
    </section>
  )
}
```

**Step 5: Verify**

```bash
npm run dev
# Homepage should now be fully built with all sections
# FeaturedCourses renders empty gracefully if DB is not yet populated
npm run build
```

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: StatsSection with animated counters, FeaturedCourses (async RSC), CtaSection"
```

---

## Task 9: Courses Listing Page

**Files:**
- Create: `src/app/[locale]/corsi/page.tsx`
- Create: `src/components/courses/CourseGrid.tsx`
- Create: `src/components/courses/CourseFilters.tsx`

**Step 1: `src/app/[locale]/corsi/page.tsx`**

```tsx
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import CourseGrid from '@/components/courses/CourseGrid'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'courses' })
  return { title: t('title'), description: t('subtitle') }
}

export default async function CorsiPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'courses' })

  const supabase = await createClient()
  const { data: courses } = await supabase
    .from('courses')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen">
      {/* Page hero */}
      <section className="pt-32 pb-16 mesh-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-display font-800 text-white mb-4">{t('title')}</h1>
          <p className="text-white/60 text-lg max-w-xl mx-auto">{t('subtitle')}</p>
        </div>
      </section>

      <section className="py-16 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CourseGrid courses={courses ?? []} locale={locale} />
        </div>
      </section>
    </div>
  )
}
```

**Step 2: `src/components/courses/CourseFilters.tsx`**

```tsx
'use client'
import { useTranslations } from 'next-intl'

interface Props {
  selectedModule: string
  selectedLevel: string
  onModuleChange: (v: string) => void
  onLevelChange: (v: string) => void
}

const modules = ['FI', 'CO', 'SCM', 'ABAP', 'FIORI', 'S4HANA', 'HANA', 'OTHER']
const levels = ['express', 'base', 'completa', 'personalizzata']

export default function CourseFilters({ selectedModule, selectedLevel, onModuleChange, onLevelChange }: Props) {
  const t = useTranslations('courses')
  const tm = useTranslations('modules')
  const tl = useTranslations('levels_map')

  const pill = (active: boolean) =>
    `px-4 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer border ${
      active ? 'bg-primary text-white border-primary' : 'bg-white text-muted-text border-border hover:border-primary/40 hover:text-primary'
    }`

  return (
    <div className="flex flex-col gap-4 mb-10">
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-sm text-muted-text font-medium mr-1">{t('filter_module')}:</span>
        <button className={pill(selectedModule === '')} onClick={() => onModuleChange('')}>{t('all')}</button>
        {modules.map(m => (
          <button key={m} className={pill(selectedModule === m)} onClick={() => onModuleChange(m)}>
            SAP {m}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-sm text-muted-text font-medium mr-1">{t('filter_level')}:</span>
        <button className={pill(selectedLevel === '')} onClick={() => onLevelChange('')}>{t('all')}</button>
        {levels.map(l => (
          <button key={l} className={pill(selectedLevel === l)} onClick={() => onLevelChange(l)}>
            {tl(l)}
          </button>
        ))}
      </div>
    </div>
  )
}
```

**Step 3: `src/components/courses/CourseGrid.tsx`**

```tsx
'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import type { Course } from '@/types/database'
import CourseCard from './CourseCard'
import CourseFilters from './CourseFilters'

interface Props { courses: Course[]; locale: string }

export default function CourseGrid({ courses, locale }: Props) {
  const t = useTranslations('courses')
  const [module, setModule] = useState('')
  const [level, setLevel] = useState('')

  const filtered = courses.filter(c =>
    (!module || c.module === module) && (!level || c.level === level)
  )

  return (
    <>
      <CourseFilters selectedModule={module} selectedLevel={level} onModuleChange={setModule} onLevelChange={setLevel} />

      {filtered.length === 0 ? (
        <p className="text-muted-text text-center py-16">{t('no_results')}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="wait">
            {filtered.map((course, i) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <CourseCard course={course} locale={locale} requestLabel={t('request_info')} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </>
  )
}
```

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: courses listing page with client-side filters and animated grid"
```

---

## Task 10: Course Detail Page

**Files:**
- Create: `src/app/[locale]/corsi/[slug]/page.tsx`
- Create: `src/components/courses/ContactForm.tsx`

**Step 1: `src/app/[locale]/corsi/[slug]/page.tsx`**

```tsx
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import { Clock, BookOpen, Target } from 'lucide-react'
import ContactForm from '@/components/courses/ContactForm'
import CourseCard from '@/components/courses/CourseCard'
import type { Course, LocalizedString, LocalizedProgram, LocalizedStringArray } from '@/types/database'

export async function generateStaticParams() {
  const supabase = await createClient()
  const { data } = await supabase.from('courses').select('slug').eq('is_published', true)
  return (data ?? []).map(c => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('courses').select('title,description').eq('slug', slug).single()
  if (!data) return {}
  const title = (data.title as LocalizedString)[locale as 'it' | 'en'] ?? (data.title as LocalizedString).it
  return { title, description: (data.description as LocalizedString)[locale as 'it' | 'en'] }
}

export default async function CourseDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params
  const t = await getTranslations({ locale, namespace: 'course_detail' })
  const tc = await getTranslations({ locale, namespace: 'modules' })
  const tl = await getTranslations({ locale, namespace: 'levels_map' })

  const supabase = await createClient()
  const { data: course } = await supabase
    .from('courses').select('*').eq('slug', slug).eq('is_published', true).single()

  if (!course) notFound()

  const loc = locale as 'it' | 'en'
  const title = (course.title as LocalizedString)[loc] ?? (course.title as LocalizedString).it
  const description = (course.description as LocalizedString)[loc] ?? (course.description as LocalizedString).it
  const objectives = ((course.objectives as LocalizedStringArray)?.[loc] ?? (course.objectives as LocalizedStringArray)?.it ?? []) as string[]
  const program = ((course.program as LocalizedProgram)?.[loc] ?? (course.program as LocalizedProgram)?.it ?? []) as { title: string; items: string[] }[]
  const prerequisites = (course.prerequisites as LocalizedString)?.[loc] ?? (course.prerequisites as LocalizedString)?.it

  // Related courses (same module, different slug)
  const { data: related } = await supabase
    .from('courses').select('*').eq('module', course.module).eq('is_published', true).neq('id', course.id).limit(3)

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="pt-32 pb-16 mesh-bg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge className="bg-primary/20 text-white border-primary/30">SAP {course.module}</Badge>
            <Badge variant="outline" className="text-white/60 border-white/20 capitalize">{tl(course.level)}</Badge>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-800 text-white mb-4">{title}</h1>
          <p className="text-white/60 text-lg leading-relaxed">{description}</p>
          {course.duration_hours && (
            <div className="flex items-center gap-2 mt-4 text-white/50 text-sm">
              <Clock size={16} /> {course.duration_hours}h {t('duration')}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-10">
            {objectives.length > 0 && (
              <div>
                <h2 className="flex items-center gap-2 text-xl font-display font-700 text-deep mb-4">
                  <Target size={20} className="text-primary" /> {t('objectives')}
                </h2>
                <ul className="space-y-2">
                  {objectives.map((obj, i) => (
                    <li key={i} className="flex items-start gap-2 text-muted-text text-sm">
                      <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs shrink-0 mt-0.5">{i + 1}</span>
                      {obj}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {program.length > 0 && (
              <div>
                <h2 className="flex items-center gap-2 text-xl font-display font-700 text-deep mb-4">
                  <BookOpen size={20} className="text-primary" /> {t('program')}
                </h2>
                <div className="space-y-4">
                  {program.map((section, i) => (
                    <div key={i} className="border border-border/50 rounded-xl p-4">
                      <h3 className="font-semibold text-deep mb-2">{section.title}</h3>
                      <ul className="space-y-1 text-sm text-muted-text">
                        {section.items.map((item, j) => (
                          <li key={j} className="flex gap-2"><span className="text-primary">•</span>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {prerequisites && (
              <div>
                <h2 className="text-xl font-display font-700 text-deep mb-2">{t('prerequisites')}</h2>
                <p className="text-muted-text text-sm">{prerequisites}</p>
              </div>
            )}
          </div>

          {/* Sidebar: contact form */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-border/50 p-6 bg-surface">
              <h3 className="font-display font-700 text-deep text-lg mb-4">{t('register')}</h3>
              <ContactForm courseId={course.id} courseTitle={title} />
            </div>
          </div>
        </div>
      </section>

      {/* Related */}
      {related && related.length > 0 && (
        <section className="py-16 bg-surface">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-display font-700 text-deep mb-8">{t('related')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map(c => <CourseCard key={c.id} course={c} locale={locale} />)}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
```

**Step 2: `src/components/courses/ContactForm.tsx`** — client component, uses `/api/contact`

```tsx
'use client'
import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { CheckCircle2, Loader2 } from 'lucide-react'

interface Props { courseId?: string; courseTitle?: string }

export default function ContactForm({ courseId, courseTitle }: Props) {
  const t = useTranslations('contact')
  const locale = useLocale()
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    const fd = new FormData(e.currentTarget)
    const body = {
      name: fd.get('name'),
      email: fd.get('email'),
      company: fd.get('company'),
      phone: fd.get('phone'),
      message: fd.get('message'),
      course_id: courseId ?? null,
      course_title: courseTitle ?? null,
      type: courseId ? 'course_inquiry' : 'general',
      locale,
    }
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      if (!res.ok) throw new Error()
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center">
        <CheckCircle2 className="w-12 h-12 text-green-500" />
        <p className="font-medium text-deep">{t('success')}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">{t('name')} *</Label>
        <Input id="name" name="name" required className="mt-1" />
      </div>
      <div>
        <Label htmlFor="email">{t('email')} *</Label>
        <Input id="email" name="email" type="email" required className="mt-1" />
      </div>
      <div>
        <Label htmlFor="company">{t('company')}</Label>
        <Input id="company" name="company" className="mt-1" />
      </div>
      <div>
        <Label htmlFor="phone">{t('phone')}</Label>
        <Input id="phone" name="phone" type="tel" className="mt-1" />
      </div>
      <div>
        <Label htmlFor="message">{t('message')} *</Label>
        <Textarea id="message" name="message" required rows={4} className="mt-1" />
      </div>
      {status === 'error' && <p className="text-red-500 text-sm">{t('error')}</p>}
      <Button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white" disabled={status === 'loading'}>
        {status === 'loading' ? <Loader2 className="animate-spin mr-2 w-4 h-4" /> : null}
        {t('submit')}
      </Button>
    </form>
  )
}
```

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: course detail page with objectives, program, sidebar contact form"
```

---

## Task 11: Chi Siamo + Contatti Pages

**Files:**
- Create: `src/app/[locale]/chi-siamo/page.tsx`
- Create: `src/app/[locale]/contatti/page.tsx`

**Step 1: `src/app/[locale]/chi-siamo/page.tsx`**

```tsx
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Shield, Cpu, UserCheck, BarChart3 } from 'lucide-react'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'about' })
  return { title: t('title'), description: t('subtitle') }
}

const valueIcons = [Shield, Cpu, UserCheck, BarChart3]

export default async function ChiSiamoPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'about' })
  const values = t.raw('values') as { title: string; desc: string }[]

  return (
    <div className="min-h-screen">
      <section className="pt-32 pb-20 mesh-bg text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-4xl sm:text-5xl font-display font-800 text-white mb-4">{t('title')}</h1>
          <p className="text-white/60 text-lg">{t('subtitle')}</p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-display font-700 text-deep mb-4">{t('sigest_title')}</h2>
          <p className="text-muted-text leading-relaxed text-lg">{t('sigest_desc')}</p>
        </div>
      </section>

      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-display font-800 text-deep text-center mb-12">{t('values_title')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => {
              const Icon = valueIcons[i]
              return (
                <div key={i} className="bg-white rounded-2xl p-6 border border-border/50 text-center">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-display font-700 text-deep mb-2">{v.title}</h3>
                  <p className="text-muted-text text-sm">{v.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
```

**Step 2: `src/app/[locale]/contatti/page.tsx`**

```tsx
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import ContactForm from '@/components/courses/ContactForm'
import { Mail, Phone, Globe } from 'lucide-react'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'contact' })
  return { title: t('title') }
}

export default async function ContattiPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'contact' })

  return (
    <div className="min-h-screen">
      <section className="pt-32 pb-16 mesh-bg text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h1 className="text-4xl sm:text-5xl font-display font-800 text-white mb-4">{t('title')}</h1>
          <p className="text-white/60 text-lg">{t('subtitle')}</p>
        </div>
      </section>

      <section className="py-20 bg-surface">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Info */}
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-deep">Email</p>
                <p className="text-muted-text text-sm mt-1">info@tooskill.it</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Globe className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-deep">Web</p>
                <a href="https://sigestconsulting.com" target="_blank" rel="noopener noreferrer" className="text-primary text-sm hover:underline mt-1 block">
                  sigestconsulting.com
                </a>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl border border-border/50 p-8">
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  )
}
```

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: Chi Siamo and Contatti pages"
```

---

## Task 12: Contact API Route + Resend Emails

**Files:**
- Create: `src/app/api/contact/route.ts`
- Create: `src/lib/resend/templates.ts`

**Step 1: `src/lib/resend/templates.ts`**

```ts
export function userConfirmationEmail(name: string, courseTitle?: string): string {
  return `
<!DOCTYPE html>
<html lang="it">
<head><meta charset="UTF-8"><title>TooSkill — Richiesta ricevuta</title></head>
<body style="font-family:Inter,sans-serif;background:#F8FAFF;margin:0;padding:0;">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:40px auto;background:#fff;border-radius:16px;border:1px solid #E2E8F0;overflow:hidden;">
  <tr><td style="background:linear-gradient(135deg,#060B18 0%,#0D1B2A 100%);padding:32px 40px;">
    <h1 style="color:#fff;margin:0;font-size:24px;font-weight:800;">
      Too<span style="background:linear-gradient(135deg,#4F6EF7,#00C9FF);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">Skill</span>
    </h1>
  </td></tr>
  <tr><td style="padding:40px;">
    <h2 style="color:#0D1B2A;font-size:20px;margin-top:0;">Grazie, ${name}! 👋</h2>
    <p style="color:#8892A4;line-height:1.7;">
      Abbiamo ricevuto la tua richiesta${courseTitle ? ` per il corso <strong style="color:#4F6EF7">${courseTitle}</strong>` : ''} e ti risponderemo al più presto.
    </p>
    <p style="color:#8892A4;line-height:1.7;">Il nostro team ti contatterà entro 1-2 giorni lavorativi per fornirti tutte le informazioni necessarie.</p>
    <div style="margin:32px 0;padding:20px;background:#F8FAFF;border-radius:12px;border-left:4px solid #4F6EF7;">
      <p style="margin:0;color:#0D1B2A;font-weight:600;">Hai domande urgenti?</p>
      <p style="margin:4px 0 0;color:#8892A4;font-size:14px;">Scrivici direttamente a <a href="mailto:info@tooskill.it" style="color:#4F6EF7;">info@tooskill.it</a></p>
    </div>
    <p style="color:#0D1B2A;font-weight:600;margin-top:32px;">Il team TooSkill</p>
    <p style="color:#8892A4;font-size:12px;">Un brand Sigest Consulting</p>
  </td></tr>
</table>
</body></html>`
}

export function adminNotificationEmail(data: {
  name: string; email: string; company?: string; phone?: string;
  message: string; courseTitle?: string; type: string;
}): string {
  return `
<!DOCTYPE html><html><body style="font-family:Inter,sans-serif;background:#F8FAFF;padding:0;margin:0;">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:40px auto;background:#fff;border-radius:16px;border:1px solid #E2E8F0;">
  <tr><td style="background:#060B18;padding:24px 32px;">
    <p style="color:#4F6EF7;margin:0;font-size:14px;font-weight:600;">🔔 NUOVA RICHIESTA — TooSkill</p>
  </td></tr>
  <tr><td style="padding:32px;">
    <table width="100%" cellpadding="8" cellspacing="0">
      <tr><td style="color:#8892A4;font-size:13px;width:120px;">Nome</td><td style="color:#0D1B2A;font-weight:600;">${data.name}</td></tr>
      <tr><td style="color:#8892A4;font-size:13px;">Email</td><td><a href="mailto:${data.email}" style="color:#4F6EF7;">${data.email}</a></td></tr>
      ${data.company ? `<tr><td style="color:#8892A4;font-size:13px;">Azienda</td><td style="color:#0D1B2A;">${data.company}</td></tr>` : ''}
      ${data.phone ? `<tr><td style="color:#8892A4;font-size:13px;">Telefono</td><td style="color:#0D1B2A;">${data.phone}</td></tr>` : ''}
      ${data.courseTitle ? `<tr><td style="color:#8892A4;font-size:13px;">Corso</td><td style="color:#4F6EF7;font-weight:600;">${data.courseTitle}</td></tr>` : ''}
      <tr><td style="color:#8892A4;font-size:13px;">Tipo</td><td style="color:#0D1B2A;">${data.type}</td></tr>
    </table>
    <div style="margin-top:20px;padding:16px;background:#F8FAFF;border-radius:8px;">
      <p style="margin:0 0 8px;color:#8892A4;font-size:12px;font-weight:600;text-transform:uppercase;">Messaggio</p>
      <p style="margin:0;color:#0D1B2A;line-height:1.6;">${data.message}</p>
    </div>
  </td></tr>
</table>
</body></html>`
}
```

**Step 2: `src/app/api/contact/route.ts`**

```ts
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createAdminClient } from '@/lib/supabase/admin'
import { userConfirmationEmail, adminNotificationEmail } from '@/lib/resend/templates'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, company, phone, message, course_id, course_title, type, locale } = body

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    // Save to Supabase
    const supabase = createAdminClient()
    const { error: dbError } = await supabase.from('contact_requests').insert({
      name, email,
      company: company || null,
      phone: phone || null,
      message,
      course_id: course_id || null,
      course_title: course_title || null,
      type: type || 'general',
      locale: locale || 'it',
    })

    if (dbError) {
      console.error('DB error:', dbError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    // Send emails (don't fail the request if email fails)
    try {
      await Promise.all([
        // User confirmation
        resend.emails.send({
          from: 'TooSkill <noreply@tooskill.it>',
          to: email,
          subject: 'Abbiamo ricevuto la tua richiesta — TooSkill',
          html: userConfirmationEmail(name, course_title),
        }),
        // Admin notification
        resend.emails.send({
          from: 'TooSkill <noreply@tooskill.it>',
          to: process.env.ADMIN_EMAIL!,
          subject: `Nuova richiesta da ${name}${course_title ? ` — ${course_title}` : ''}`,
          html: adminNotificationEmail({ name, email, company, phone, message, courseTitle: course_title, type }),
        }),
      ])
    } catch (emailError) {
      console.error('Email error (non-fatal):', emailError)
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

**Step 3: Verify**

```bash
# With .env.local filled:
npm run dev
# Submit the contact form on /contatti
# Check Supabase: contact_requests table should have a new row
# Check email inbox: confirmation + admin notification
```

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: contact API route with Supabase insert + Resend branded emails"
```

---

## Task 13: Admin Auth — Middleware + Login Page

**Files:**
- Create: `src/lib/auth/admin.ts`
- Create: `src/app/admin/[guid]/login/page.tsx`
- Create: `src/app/api/admin/auth/route.ts`
- Modify: `src/middleware.ts`

**Step 1: `src/lib/auth/admin.ts`**

```ts
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

const COOKIE_NAME = 'ts_admin_session'
const JWT_SECRET = new TextEncoder().encode(process.env.ADMIN_JWT_SECRET ?? 'fallback-secret-change-me')

export async function createAdminSession(): Promise<string> {
  return new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('8h')
    .sign(JWT_SECRET)
}

export async function verifyAdminSession(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(COOKIE_NAME)?.value
  if (!token) return false
  try {
    await jwtVerify(token, JWT_SECRET)
    return true
  } catch {
    return false
  }
}

export async function setAdminCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 8, // 8 hours
    path: '/',
  })
}

export async function clearAdminCookie() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}
```

**Step 2: `src/app/api/admin/auth/route.ts`**

```ts
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { createAdminSession, setAdminCookie } from '@/lib/auth/admin'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()
    if (!password) return NextResponse.json({ error: 'Missing password' }, { status: 400 })

    const hash = process.env.ADMIN_PASSWORD_HASH
    if (!hash) return NextResponse.json({ error: 'Admin not configured' }, { status: 500 })

    const valid = await bcrypt.compare(password, hash)
    if (!valid) return NextResponse.json({ error: 'Invalid password' }, { status: 401 })

    const token = await createAdminSession()
    await setAdminCookie(token)

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

export async function DELETE() {
  const { clearAdminCookie } = await import('@/lib/auth/admin')
  await clearAdminCookie()
  return NextResponse.json({ success: true })
}
```

**Step 3: Update `src/middleware.ts`** — add admin auth check

```ts
import createIntlMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import { NextResponse, type NextRequest } from 'next/server'
import { verifyAdminSession } from './lib/auth/admin'

const intlMiddleware = createIntlMiddleware(routing)
const ADMIN_GUID = process.env.ADMIN_ROUTE_GUID

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Admin routes
  if (pathname.startsWith('/admin')) {
    // Reject if GUID doesn't match
    if (ADMIN_GUID && !pathname.includes(`/admin/${ADMIN_GUID}`)) {
      return NextResponse.notFound()
    }

    // Allow login page through
    if (pathname.endsWith('/login')) return NextResponse.next()

    // Check session
    const valid = await verifyAdminSession(request)
    if (!valid) {
      return NextResponse.redirect(new URL(`/admin/${ADMIN_GUID}/login`, request.url))
    }

    return NextResponse.next()
  }

  // API routes: skip i18n
  if (pathname.startsWith('/api')) return NextResponse.next()

  return intlMiddleware(request)
}

export const config = {
  matcher: ['/((?!_next|_vercel|.*\\..*).*)'],
}
```

**Step 4: `src/app/admin/[guid]/login/page.tsx`**

```tsx
'use client'
import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Lock } from 'lucide-react'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const params = useParams()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    setLoading(false)
    if (res.ok) {
      router.push(`/admin/${params.guid}`)
    } else {
      setError('Password non corretta')
    }
  }

  return (
    <div className="min-h-screen mesh-bg flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Lock className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-text">TooSkill</p>
            <h1 className="font-display font-700 text-deep">Admin Panel</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoFocus
              className="mt-1"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white" disabled={loading}>
            {loading ? <Loader2 className="animate-spin mr-2 w-4 h-4" /> : null}
            Accedi
          </Button>
        </form>
      </div>
    </div>
  )
}
```

**Step 5: Verify**

```bash
npm run dev
# Navigate to /admin/[your-guid]/
# Should redirect to /admin/[your-guid]/login
# Enter wrong password: should show error
# Enter correct password: should redirect to /admin/[your-guid]/
```

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: admin auth — JWT cookie, bcrypt password check, login page, middleware guard"
```

---

## Task 14: Admin Dashboard + Courses CRUD

**Files:**
- Create: `src/app/admin/[guid]/layout.tsx`
- Create: `src/app/admin/[guid]/page.tsx`
- Create: `src/app/admin/[guid]/corsi/page.tsx`
- Create: `src/app/api/admin/courses/route.ts`
- Create: `src/app/api/admin/courses/[id]/route.ts`
- Create: `src/components/admin/CourseModal.tsx`

**Step 1: `src/app/admin/[guid]/layout.tsx`**

```tsx
import { ReactNode } from 'react'
import Link from 'next/link'
import { LayoutDashboard, BookOpen, MessageSquare, LogOut } from 'lucide-react'

export default async function AdminLayout({ children, params }: { children: ReactNode; params: Promise<{ guid: string }> }) {
  const { guid } = await params
  const base = `/admin/${guid}`

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Sidebar */}
      <aside className="w-60 bg-midnight shrink-0 flex flex-col">
        <div className="px-6 py-5 border-b border-white/10">
          <span className="text-lg font-display font-800 text-white">
            Too<span className="gradient-text">Skill</span>
          </span>
          <p className="text-white/40 text-xs mt-0.5">Admin Panel</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {[
            { href: base, icon: LayoutDashboard, label: 'Dashboard' },
            { href: `${base}/corsi`, icon: BookOpen, label: 'Corsi' },
            { href: `${base}/richieste`, icon: MessageSquare, label: 'Richieste' },
          ].map(({ href, icon: Icon, label }) => (
            <Link key={href} href={href} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors text-sm">
              <Icon size={18} /> {label}
            </Link>
          ))}
        </nav>

        <form action="/api/admin/auth" method="DELETE" className="p-3">
          <button
            type="button"
            onClick={async () => {
              await fetch('/api/admin/auth', { method: 'DELETE' })
              window.location.href = `${base}/login`
            }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors text-sm w-full"
          >
            <LogOut size={18} /> Logout
          </button>
        </form>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
```

**Step 2: `src/app/admin/[guid]/page.tsx`** — dashboard with stats

```tsx
import { createAdminClient } from '@/lib/supabase/admin'
import { BookOpen, MessageSquare, Eye, Star } from 'lucide-react'

export default async function AdminDashboard() {
  const supabase = createAdminClient()
  const [
    { count: totalCourses },
    { count: publishedCourses },
    { count: totalRequests },
    { count: newRequests },
  ] = await Promise.all([
    supabase.from('courses').select('*', { count: 'exact', head: true }),
    supabase.from('courses').select('*', { count: 'exact', head: true }).eq('is_published', true),
    supabase.from('contact_requests').select('*', { count: 'exact', head: true }),
    supabase.from('contact_requests').select('*', { count: 'exact', head: true }).eq('status', 'new'),
  ])

  const stats = [
    { label: 'Corsi totali', value: totalCourses ?? 0, icon: BookOpen, color: 'text-blue-600' },
    { label: 'Corsi pubblicati', value: publishedCourses ?? 0, icon: Eye, color: 'text-green-600' },
    { label: 'Richieste totali', value: totalRequests ?? 0, icon: MessageSquare, color: 'text-purple-600' },
    { label: 'Nuove richieste', value: newRequests ?? 0, icon: Star, color: 'text-orange-500' },
  ]

  return (
    <div className="p-8">
      <h1 className="text-2xl font-display font-700 text-deep mb-8">Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon
          return (
            <div key={s.label} className="bg-white rounded-xl border border-border/50 p-6">
              <Icon className={`w-6 h-6 ${s.color} mb-3`} />
              <p className="text-3xl font-display font-800 text-deep">{s.value}</p>
              <p className="text-muted-text text-sm mt-1">{s.label}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
```

**Step 3: `src/app/api/admin/courses/route.ts`**

```ts
import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminSession } from '@/lib/auth/admin'
import { createAdminClient } from '@/lib/supabase/admin'

async function guard(request: NextRequest) {
  const valid = await verifyAdminSession(request)
  if (!valid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return null
}

export async function GET(request: NextRequest) {
  const deny = await guard(request)
  if (deny) return deny
  const supabase = createAdminClient()
  const { data, error } = await supabase.from('courses').select('*').order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  const deny = await guard(request)
  if (deny) return deny
  const body = await request.json()
  const supabase = createAdminClient()
  const { data, error } = await supabase.from('courses').insert(body).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
```

**Step 4: `src/app/api/admin/courses/[id]/route.ts`**

```ts
import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminSession } from '@/lib/auth/admin'
import { createAdminClient } from '@/lib/supabase/admin'

async function guard(req: NextRequest) {
  return (await verifyAdminSession(req)) ? null : NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const deny = await guard(request)
  if (deny) return deny
  const { id } = await params
  const body = await request.json()
  const supabase = createAdminClient()
  const { data, error } = await supabase.from('courses').update({ ...body, updated_at: new Date().toISOString() }).eq('id', id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const deny = await guard(request)
  if (deny) return deny
  const { id } = await params
  const supabase = createAdminClient()
  const { error } = await supabase.from('courses').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
```

**Step 5: `src/app/admin/[guid]/corsi/page.tsx`** — courses CRUD table

```tsx
'use client'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Pencil, Trash2, Eye, EyeOff, Star } from 'lucide-react'
import type { Course } from '@/types/database'
import CourseModal from '@/components/admin/CourseModal'

export default function AdminCorsiPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<{ open: boolean; course?: Course }>({ open: false })

  const fetchCourses = async () => {
    setLoading(true)
    const res = await fetch('/api/admin/courses')
    const data = await res.json()
    setCourses(data)
    setLoading(false)
  }

  useEffect(() => { fetchCourses() }, [])

  const toggle = async (course: Course, field: 'is_published' | 'is_featured') => {
    await fetch(`/api/admin/courses/${course.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: !course[field] }),
    })
    await fetchCourses()
  }

  const deleteCourse = async (id: string) => {
    if (!confirm('Eliminare questo corso?')) return
    await fetch(`/api/admin/courses/${id}`, { method: 'DELETE' })
    await fetchCourses()
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-display font-700 text-deep">Gestione Corsi</h1>
        <Button onClick={() => setModal({ open: true })} className="bg-primary hover:bg-primary-dark text-white">
          <Plus className="w-4 h-4 mr-2" /> Nuovo Corso
        </Button>
      </div>

      {loading ? (
        <div className="text-muted-text">Caricamento...</div>
      ) : (
        <div className="bg-white rounded-xl border border-border/50 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface border-b border-border/50">
              <tr>
                {['Titolo', 'Modulo', 'Livello', 'Pubblicato', 'In Evidenza', ''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-muted-text font-medium text-xs uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {courses.map(course => (
                <tr key={course.id} className="hover:bg-surface/50">
                  <td className="px-4 py-3 font-medium text-deep max-w-48 truncate">
                    {(course.title as any).it}
                  </td>
                  <td className="px-4 py-3"><Badge variant="outline" className="text-xs">SAP {course.module}</Badge></td>
                  <td className="px-4 py-3 capitalize text-muted-text text-xs">{course.level}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggle(course, 'is_published')} className={`p-1.5 rounded-lg transition-colors ${course.is_published ? 'text-green-600 bg-green-50' : 'text-muted-text bg-surface'}`}>
                      {course.is_published ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggle(course, 'is_featured')} className={`p-1.5 rounded-lg transition-colors ${course.is_featured ? 'text-yellow-500 bg-yellow-50' : 'text-muted-text bg-surface'}`}>
                      <Star size={16} />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setModal({ open: true, course })} className="p-1.5 rounded-lg text-primary hover:bg-primary/10 transition-colors">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => deleteCourse(course.id)} className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {courses.length === 0 && <p className="text-center text-muted-text py-12">Nessun corso. Aggiungine uno!</p>}
        </div>
      )}

      {modal.open && (
        <CourseModal
          course={modal.course}
          onClose={() => setModal({ open: false })}
          onSave={fetchCourses}
        />
      )}
    </div>
  )
}
```

**Step 6: `src/components/admin/CourseModal.tsx`** — Add/Edit modal form

```tsx
'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { X, Loader2 } from 'lucide-react'
import type { Course } from '@/types/database'

interface Props { course?: Course; onClose: () => void; onSave: () => void }

const modules = ['FI', 'CO', 'SCM', 'ABAP', 'FIORI', 'S4HANA', 'HANA', 'OTHER']
const levels = ['express', 'base', 'completa', 'personalizzata']

export default function CourseModal({ course, onClose, onSave }: Props) {
  const isEdit = !!course
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    slug: course?.slug ?? '',
    title_it: (course?.title as any)?.it ?? '',
    title_en: (course?.title as any)?.en ?? '',
    description_it: (course?.description as any)?.it ?? '',
    description_en: (course?.description as any)?.en ?? '',
    module: course?.module ?? 'FI',
    level: course?.level ?? 'base',
    duration_hours: course?.duration_hours?.toString() ?? '',
    price_info: course?.price_info ?? '',
  })

  const set = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const payload = {
      slug: form.slug,
      title: { it: form.title_it, en: form.title_en },
      description: { it: form.description_it, en: form.description_en },
      objectives: { it: [], en: [] },
      program: { it: [], en: [] },
      prerequisites: { it: '', en: '' },
      module: form.module,
      level: form.level,
      duration_hours: form.duration_hours ? parseInt(form.duration_hours) : null,
      price_info: form.price_info || null,
    }

    const url = isEdit ? `/api/admin/courses/${course!.id}` : '/api/admin/courses'
    const method = isEdit ? 'PUT' : 'POST'

    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    setLoading(false)
    onSave()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border/50">
          <h2 className="font-display font-700 text-deep text-lg">{isEdit ? 'Modifica Corso' : 'Nuovo Corso'}</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-surface transition-colors"><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label>Slug URL *</Label>
              <Input value={form.slug} onChange={e => set('slug', e.target.value)} placeholder="es. sap-fi-base" required className="mt-1" />
            </div>
            <div>
              <Label>Titolo (IT) *</Label>
              <Input value={form.title_it} onChange={e => set('title_it', e.target.value)} required className="mt-1" />
            </div>
            <div>
              <Label>Titolo (EN)</Label>
              <Input value={form.title_en} onChange={e => set('title_en', e.target.value)} className="mt-1" />
            </div>
            <div className="col-span-2">
              <Label>Descrizione (IT) *</Label>
              <Textarea value={form.description_it} onChange={e => set('description_it', e.target.value)} required rows={3} className="mt-1" />
            </div>
            <div className="col-span-2">
              <Label>Descrizione (EN)</Label>
              <Textarea value={form.description_en} onChange={e => set('description_en', e.target.value)} rows={3} className="mt-1" />
            </div>
            <div>
              <Label>Modulo SAP *</Label>
              <Select value={form.module} onValueChange={v => set('module', v)}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>{modules.map(m => <SelectItem key={m} value={m}>SAP {m}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Livello *</Label>
              <Select value={form.level} onValueChange={v => set('level', v)}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>{levels.map(l => <SelectItem key={l} value={l} className="capitalize">{l}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Durata (ore)</Label>
              <Input value={form.duration_hours} onChange={e => set('duration_hours', e.target.value)} type="number" placeholder="es. 16" className="mt-1" />
            </div>
            <div>
              <Label>Prezzo</Label>
              <Input value={form.price_info} onChange={e => set('price_info', e.target.value)} placeholder="Su richiesta" className="mt-1" />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">Annulla</Button>
            <Button type="submit" className="flex-1 bg-primary hover:bg-primary-dark text-white" disabled={loading}>
              {loading ? <Loader2 className="animate-spin mr-2 w-4 h-4" /> : null}
              {isEdit ? 'Salva modifiche' : 'Crea corso'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
```

**Step 7: Commit**

```bash
git add -A
git commit -m "feat: admin dashboard, courses CRUD table, add/edit modal, API routes"
```

---

## Task 15: Admin Contact Requests

**Files:**
- Create: `src/app/admin/[guid]/richieste/page.tsx`
- Create: `src/app/api/admin/requests/[id]/route.ts`

**Step 1: `src/app/api/admin/requests/[id]/route.ts`**

```ts
import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminSession } from '@/lib/auth/admin'
import { createAdminClient } from '@/lib/supabase/admin'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const valid = await verifyAdminSession(request)
  if (!valid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const { status } = await request.json()
  const supabase = createAdminClient()
  const { data, error } = await supabase.from('contact_requests').update({ status }).eq('id', id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
```

**Step 2: `src/app/admin/[guid]/richieste/page.tsx`**

```tsx
'use client'
import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { ContactRequest } from '@/types/database'

const statusColors = { new: 'bg-orange-100 text-orange-700', read: 'bg-blue-100 text-blue-700', replied: 'bg-green-100 text-green-700' }

export default function RichiestePage() {
  const [requests, setRequests] = useState<ContactRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<ContactRequest | null>(null)

  const fetchRequests = async () => {
    setLoading(true)
    // Use service role via a dedicated admin endpoint
    const res = await fetch('/api/admin/requests')
    const data = await res.json()
    setRequests(data)
    setLoading(false)
  }

  useEffect(() => { fetchRequests() }, [])

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/admin/requests/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    await fetchRequests()
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-display font-700 text-deep mb-8">Richieste di contatto</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* List */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-border/50 overflow-hidden">
          {loading ? <p className="p-6 text-muted-text">Caricamento...</p> : (
            <div className="divide-y divide-border/30">
              {requests.map(req => (
                <button
                  key={req.id}
                  onClick={() => setSelected(req)}
                  className={`w-full text-left px-5 py-4 hover:bg-surface/50 transition-colors ${selected?.id === req.id ? 'bg-primary/5 border-l-2 border-primary' : ''}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-deep text-sm">{req.name}</p>
                      <p className="text-muted-text text-xs mt-0.5">{req.email}</p>
                      {req.course_title && <p className="text-primary text-xs mt-0.5">{req.course_title}</p>}
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <Badge className={`text-xs ${statusColors[req.status]}`}>{req.status}</Badge>
                      <span className="text-muted-text text-xs">{new Date(req.created_at).toLocaleDateString('it-IT')}</span>
                    </div>
                  </div>
                </button>
              ))}
              {requests.length === 0 && <p className="text-center text-muted-text py-12">Nessuna richiesta</p>}
            </div>
          )}
        </div>

        {/* Detail */}
        <div className="bg-white rounded-xl border border-border/50 p-6">
          {selected ? (
            <div className="space-y-4">
              <div>
                <p className="text-xs text-muted-text uppercase font-medium mb-1">Nome</p>
                <p className="font-medium text-deep">{selected.name}</p>
              </div>
              <div>
                <p className="text-xs text-muted-text uppercase font-medium mb-1">Email</p>
                <a href={`mailto:${selected.email}`} className="text-primary text-sm hover:underline">{selected.email}</a>
              </div>
              {selected.company && <div><p className="text-xs text-muted-text uppercase font-medium mb-1">Azienda</p><p className="text-sm text-deep">{selected.company}</p></div>}
              {selected.phone && <div><p className="text-xs text-muted-text uppercase font-medium mb-1">Telefono</p><p className="text-sm text-deep">{selected.phone}</p></div>}
              {selected.course_title && <div><p className="text-xs text-muted-text uppercase font-medium mb-1">Corso</p><p className="text-sm text-primary">{selected.course_title}</p></div>}
              <div>
                <p className="text-xs text-muted-text uppercase font-medium mb-1">Messaggio</p>
                <p className="text-sm text-deep bg-surface rounded-lg p-3 leading-relaxed">{selected.message}</p>
              </div>
              <div>
                <p className="text-xs text-muted-text uppercase font-medium mb-2">Stato</p>
                <Select defaultValue={selected.status} onValueChange={v => updateStatus(selected.id, v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">Nuova</SelectItem>
                    <SelectItem value="read">Letta</SelectItem>
                    <SelectItem value="replied">Risposta inviata</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          ) : (
            <p className="text-muted-text text-sm text-center py-8">Seleziona una richiesta per vedere i dettagli</p>
          )}
        </div>
      </div>
    </div>
  )
}
```

**Step 3: Add GET route for requests — `src/app/api/admin/requests/route.ts`**

```ts
import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminSession } from '@/lib/auth/admin'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
  const valid = await verifyAdminSession(request)
  if (!valid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const supabase = createAdminClient()
  const { data, error } = await supabase.from('contact_requests').select('*').order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
```

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: admin contact requests list with detail panel and status management"
```

---

## Task 16: SEO — Sitemap, Robots, Metadata, JSON-LD, OG Image

**Files:**
- Create: `src/app/sitemap.ts`
- Create: `src/app/robots.ts`
- Create: `src/app/opengraph-image.tsx`
- Modify: `src/app/[locale]/layout.tsx` — add alternates/hreflang

**Step 1: `src/app/sitemap.ts`**

```ts
import { MetadataRoute } from 'next'
import { createAdminClient } from '@/lib/supabase/admin'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? 'https://tooskill.it'
  const locales = ['it', 'en']

  const staticPages = ['', '/corsi', '/chi-siamo', '/contatti']
  const staticEntries = staticPages.flatMap(page =>
    locales.map(locale => ({
      url: `${base}/${locale}${page}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: page === '' ? 1 : 0.8,
    }))
  )

  const supabase = createAdminClient()
  const { data: courses } = await supabase.from('courses').select('slug, updated_at').eq('is_published', true)

  const courseEntries = (courses ?? []).flatMap(course =>
    locales.map(locale => ({
      url: `${base}/${locale}/corsi/${course.slug}`,
      lastModified: new Date(course.updated_at),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  )

  return [...staticEntries, ...courseEntries]
}
```

**Step 2: `src/app/robots.ts`**

```ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? 'https://tooskill.it'
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/admin/', '/api/'] },
    ],
    sitemap: `${base}/sitemap.xml`,
  }
}
```

**Step 3: `src/app/opengraph-image.tsx`**

```tsx
import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'TooSkill — Formazione SAP Professionale'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #060B18 0%, #0D1B2A 50%, #111827 100%)',
          width: '100%', height: '100%',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Glow */}
        <div style={{ position: 'absolute', top: '20%', left: '20%', width: 400, height: 400, borderRadius: '50%', background: 'rgba(79,110,247,0.15)', filter: 'blur(80px)' }} />

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, position: 'relative' }}>
          <div style={{ fontSize: 72, fontWeight: 800, color: '#fff', letterSpacing: '-2px' }}>
            Too<span style={{ color: '#4F6EF7' }}>Skill</span>
          </div>
          <div style={{ fontSize: 28, color: 'rgba(255,255,255,0.6)', textAlign: 'center', maxWidth: 700 }}>
            Formazione SAP Professionale
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
            {['SAP FI', 'CO', 'S/4HANA', 'ABAP', 'Fiori'].map(m => (
              <div key={m} style={{ background: 'rgba(79,110,247,0.2)', border: '1px solid rgba(79,110,247,0.4)', borderRadius: 8, padding: '6px 14px', color: '#4F6EF7', fontSize: 16 }}>
                {m}
              </div>
            ))}
          </div>
          <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.3)', marginTop: 8 }}>Un brand Sigest Consulting</div>
        </div>
      </div>
    ),
    { ...size }
  )
}
```

**Step 4: Add JSON-LD to homepage — modify `src/app/[locale]/page.tsx`**

Add at the top of the page component:

```tsx
// Add to src/app/[locale]/page.tsx
import type { WithContext, Organization } from 'schema-dts'

// Inside the component (or exported from page):
const jsonLd: WithContext<Organization> = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'TooSkill',
  description: 'Formazione SAP professionale e personalizzata',
  url: process.env.NEXT_PUBLIC_APP_URL ?? 'https://tooskill.it',
  parentOrganization: { '@type': 'Organization', name: 'Sigest Consulting', url: 'https://sigestconsulting.com' },
}

// Add inside the JSX return:
// <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
```

Install schema-dts for types:
```bash
npm install schema-dts
```

**Step 5: Verify**

```bash
npm run build
# Check: /sitemap.xml accessible
# Check: /robots.txt accessible
# Check: OG image at /_next/image or /opengraph-image
```

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: SEO — sitemap, robots, OG image, JSON-LD Organization schema"
```

---

## Task 17: Final Polish — Responsive, Animations Config, .env.example, README, Build Verify

**Files:**
- Create: `README.md`
- Modify: Various — final responsive adjustments

**Step 1: Install tw-animate-css if not present**

```bash
npm install tw-animate-css
```

**Step 2: Ensure Framer Motion scroll animations are wrapped correctly**

Framer Motion `whileInView` animations require the component to be a Client Component (`'use client'`). Check every component that uses `motion` + `whileInView` is marked `'use client'`.

**Step 3: Create `.gitignore` entry for env**

```bash
# Ensure .env.local is gitignored (should be automatic from create-next-app)
grep ".env.local" .gitignore || echo ".env.local" >> .gitignore
```

**Step 4: `README.md`**

```markdown
# TooSkill Website

SAP Training platform for TooSkill (a Sigest Consulting brand).

## Stack
- Next.js 15 App Router + TypeScript
- Tailwind CSS v4 + shadcn/ui
- Framer Motion
- next-intl (IT/EN)
- Supabase (DB + Storage)
- Resend (Emails)
- Vercel (Deploy)

## Setup

1. Clone repo
2. `npm install`
3. Copy `.env.local.example` → `.env.local` and fill in values
4. Run Supabase schema: paste `supabase/schema.sql` into Supabase SQL Editor
5. Generate admin password hash:
   ```bash
   node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('yourpassword', 12))"
   ```
6. `npm run dev`

## Admin Panel
Navigate to `/admin/[ADMIN_ROUTE_GUID]` — set this in `.env.local`.

## Deploy (Vercel)
1. Connect GitHub repo to Vercel
2. Add all env vars from `.env.local.example`
3. Deploy — Vercel handles the build automatically
```

**Step 5: Final build verification**

```bash
npm run build
# Expected output:
# ✓ Compiled successfully
# ✓ Linting and checking validity of types
# Route (app) — all routes listed without errors
# No TypeScript errors

npm run lint
# Expected: no errors (warnings acceptable)
```

**Step 6: Final commit**

```bash
git add -A
git commit -m "feat: final polish, README, production build verified"
```

---

## Environment Variables Reference

Before testing any feature, create `.env.local`:

```bash
# 1. Supabase: get from https://app.supabase.com → project → Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# 2. Resend: get from https://resend.com → API Keys
RESEND_API_KEY=re_xxxx

# 3. Admin email (receives contact form notifications)
ADMIN_EMAIL=info@tooskill.it

# 4. Admin route: a random GUID (generate at https://uuid.dev or use node -e "require('crypto').randomUUID()" )
ADMIN_ROUTE_GUID=550e8400-e29b-41d4-a716-446655440000

# 5. Admin password hash (generate with: node -e "const b=require('bcryptjs');console.log(b.hashSync('yourpass',12))")
ADMIN_PASSWORD_HASH=$2b$12$...

# 6. JWT secret: any long random string
ADMIN_JWT_SECRET=your-super-secret-jwt-key-min-32-chars

# 7. App URL (use your Vercel URL in production)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Quick Verification Checklist

After completing all tasks, verify:

- [ ] `npm run build` passes with no errors
- [ ] Homepage loads: hero, all sections visible, Navbar transparent → scrolled
- [ ] Language switcher switches IT ↔ EN
- [ ] `/corsi` page shows courses from DB with working filters
- [ ] `/corsi/[slug]` shows course detail + contact form
- [ ] Submitting contact form saves to Supabase + sends two emails
- [ ] `/admin/[guid]` redirects to login when unauthenticated
- [ ] Admin login with correct password grants access
- [ ] Admin can create/edit/delete courses
- [ ] Admin can view and update contact request status
- [ ] `/sitemap.xml` and `/robots.txt` accessible
- [ ] Mobile responsive (test at 375px)
