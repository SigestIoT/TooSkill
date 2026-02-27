# TooSkill Website — Design Document
**Date:** 2026-02-27
**Status:** Approved
**Author:** Design session with Claude

---

## 1. Project Overview

**TooSkill** è un nuovo brand di formazione SAP lanciato da **Sigest** (sigestconsulting.com).
Il sito è una "vetrina" B2B che:
- Presenta TooSkill, i servizi e i percorsi formativi
- Mostra un catalogo corsi dinamico gestito da un admin
- Raccoglie lead (richieste di iscrizione/contatto) e le invia via email
- Supporta italiano (default) con scaffold inglese pronto

**Deploy:** Vercel (piano gratuito)
**Repository:** TooSkill_v2

---

## 2. Brand Identity

### Palette colori
| Token       | Hex       | Uso                                      |
|-------------|-----------|------------------------------------------|
| `midnight`  | `#060B18` | Hero, sezioni dark                       |
| `deep`      | `#0D1B2A` | Card dark, navbar scrolled               |
| `primary`   | `#4F6EF7` | CTA, link, bordi attivi                  |
| `cyan`      | `#00C9FF` | Accenti, glow, underline animato          |
| `surface`   | `#F8FAFF` | Sezioni chiare                           |
| `muted`     | `#8892A4` | Testo secondario                         |
| `white`     | `#FFFFFF` | Testo su dark, sfondi card               |

### Tipografia
- **Headings:** Plus Jakarta Sans (700, 800)
- **Body:** Inter (400, 500, 600)

### Stile visivo
- Dark hero con mesh gradient animato + glow ciano/blu
- Sezioni chiare (`#F8FAFF`) alternate
- Glassmorphism sulle card dark
- Animazioni scroll con Framer Motion
- Counter animati per i numeri

---

## 3. Struttura pagine

```
/[locale]/                    → Homepage
/[locale]/corsi               → Catalogo corsi (filtri per modulo e livello)
/[locale]/corsi/[slug]        → Dettaglio corso + form iscrizione
/[locale]/chi-siamo           → About TooSkill + Sigest
/[locale]/contatti            → Form contatto generico

/admin/[ADMIN_ROUTE_GUID]/    → Admin dashboard (protetto JWT)
/admin/[ADMIN_ROUTE_GUID]/login
/admin/[ADMIN_ROUTE_GUID]/corsi
/admin/[ADMIN_ROUTE_GUID]/richieste
```

### Homepage — sezioni in ordine
1. **Navbar** — logo + nav links + language switcher IT/EN + CTA "Esplora i Corsi"
2. **Hero** — full-screen dark, headline bold, subtitle, 2 CTA, chip stats animati
3. **Trust bar** — moduli SAP coperti (FI, CO, SCM, ABAP, S/4HANA, HANA, Fiori)
4. **Perché TooSkill** — 4 value prop con icone animate
5. **Come funziona** — timeline 3 step: Analisi → Formazione → Risultati
6. **I nostri percorsi** — 4 card livelli: Express / Base / Completa / Personalizzata
7. **I nostri numeri** — counter animato: 20+ anni, 100+ progetti, 10+ paesi
8. **Corsi in evidenza** — grid dinamica da DB (is_featured = true)
9. **CTA finale** — sezione dark con call to action
10. **Footer**

---

## 4. Stack tecnico

```
Next.js 15 (App Router) + TypeScript
Tailwind CSS 4
shadcn/ui (componenti base)
Framer Motion (animazioni)
next-intl (i18n: IT default + EN scaffold)
Supabase (PostgreSQL + storage immagini)
Resend (email transazionali)
jose (JWT per auth admin)
bcryptjs (hash password admin)
Vercel (deploy)
```

---

## 5. Database Schema (Supabase)

### Tabella `courses`
```sql
id            uuid PRIMARY KEY DEFAULT gen_random_uuid()
slug          text UNIQUE NOT NULL
title         jsonb NOT NULL  -- { it: string, en: string }
description   jsonb NOT NULL  -- { it: string, en: string }
objectives    jsonb           -- { it: string[], en: string[] }
program       jsonb           -- { it: [{title, items[]}], en: ... }
prerequisites jsonb           -- { it: string, en: string }
module        text NOT NULL   -- FI|CO|SCM|ABAP|FIORI|S4HANA|HANA|OTHER
level         text NOT NULL   -- express|base|completa|personalizzata
duration_hours int
price_info    text            -- "Su richiesta" | "€ 1.200" | null
image_url     text
is_published  boolean DEFAULT false
is_featured   boolean DEFAULT false
created_at    timestamptz DEFAULT now()
updated_at    timestamptz DEFAULT now()
```

### Tabella `contact_requests`
```sql
id            uuid PRIMARY KEY DEFAULT gen_random_uuid()
name          text NOT NULL
email         text NOT NULL
company       text
phone         text
course_id     uuid REFERENCES courses(id) ON DELETE SET NULL
course_title  text            -- denormalizzato per display
message       text NOT NULL
type          text NOT NULL   -- course_inquiry|general|custom_training
status        text DEFAULT 'new'  -- new|read|replied
locale        text DEFAULT 'it'
created_at    timestamptz DEFAULT now()
```

---

## 6. Admin Panel

- **URL:** `/admin/[ADMIN_ROUTE_GUID]` (GUID in env, non indovinabile)
- **Auth:** cookie JWT httpOnly firmato con `ADMIN_JWT_SECRET`
- **Password:** confronto bcrypt con `ADMIN_PASSWORD_HASH` in env
- **Middleware:** protegge tutte le route `/admin/[guid]/*` tranne `/login`

### Funzionalità admin
- Dashboard: contatori (corsi pubblicati, richieste nuove)
- Corsi: tabella + modal Add/Edit + toggle published/featured + delete
- Richieste: tabella con filtri status, click per dettaglio, cambio status

---

## 7. Flussi Email (Resend)

### Form contatto / iscrizione
1. Dati salvati in `contact_requests` con `status = 'new'`
2. Email all'utente: branded, "Grazie [Nome], ti ricontatteremo presto"
3. Email all'admin (`ADMIN_EMAIL`): "Nuova richiesta da [Nome] — [email] — Corso: [titolo]"

---

## 8. SEO

- `generateMetadata()` su ogni pagina (title, description, OG tags)
- `app/sitemap.ts` — dinamico: pagine statiche + tutti i corsi `is_published=true`
- `app/robots.ts` — `/admin/*` escluso
- JSON-LD: `Organization` in homepage, `Course` su ogni corso
- `hreflang` IT / EN
- OG image auto-generata (`app/opengraph-image.tsx`)
- Canonical URL su ogni pagina

---

## 9. Internazionalizzazione (next-intl)

- Locali: `['it', 'en']`, default `it`
- Struttura routing: `app/[locale]/...`
- Testi UI: `messages/it.json` + `messages/en.json`
- Contenuti corsi: campi `jsonb {it, en}` — admin scrive in entrambe le lingue
- Language switcher in navbar
- Middleware: redirect automatico alla locale corretta

---

## 10. Variabili d'ambiente

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Resend
RESEND_API_KEY=
ADMIN_EMAIL=

# Admin auth
ADMIN_ROUTE_GUID=        # parte segreta dell'URL admin
ADMIN_PASSWORD_HASH=     # bcrypt hash della password
ADMIN_JWT_SECRET=        # stringa random per firmare il JWT

# App
NEXT_PUBLIC_APP_URL=     # es. https://tooskill.it
```

---

## 11. Struttura directory

```
src/
├── app/
│   ├── [locale]/
│   │   ├── page.tsx              # Homepage
│   │   ├── layout.tsx
│   │   ├── corsi/
│   │   │   ├── page.tsx          # Catalogo
│   │   │   └── [slug]/page.tsx   # Dettaglio corso
│   │   ├── chi-siamo/page.tsx
│   │   └── contatti/page.tsx
│   ├── admin/
│   │   └── [guid]/
│   │       ├── layout.tsx        # Auth guard
│   │       ├── page.tsx          # Dashboard
│   │       ├── login/page.tsx
│   │       ├── corsi/page.tsx
│   │       └── richieste/page.tsx
│   ├── api/
│   │   ├── contact/route.ts      # POST → DB + Resend
│   │   └── admin/
│   │       ├── auth/route.ts
│   │       └── courses/route.ts  # CRUD
│   ├── sitemap.ts
│   ├── robots.ts
│   └── opengraph-image.tsx
├── components/
│   ├── ui/                       # shadcn/ui base
│   ├── layout/                   # Navbar, Footer
│   ├── home/                     # Hero, Features, HowItWorks, Stats, etc.
│   ├── courses/                  # CourseCard, CourseGrid, CourseFilters
│   └── admin/                    # AdminTable, CourseModal, etc.
├── lib/
│   ├── supabase/                 # client + server client
│   ├── resend/                   # email templates
│   └── auth/                     # JWT helpers
├── messages/
│   ├── it.json
│   └── en.json
└── middleware.ts                  # i18n + admin auth
```

---

## 12. Immagini

- Placeholder: gradienti CSS + pattern SVG
- Futuro: NanoBanana API (API key da fornire separatamente)
- Storage: Supabase Storage per immagini corsi caricate dall'admin
- Ottimizzazione: `next/image` ovunque
