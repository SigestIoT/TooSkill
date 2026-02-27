# TooSkill — Formazione SAP Professionale

Website for TooSkill, the SAP training brand by [Sigest Consulting](https://sigestconsulting.com/).

## Stack

- **Next.js 16** (App Router, RSC)
- **Tailwind CSS v4** with custom brand tokens
- **shadcn/ui** (New York style)
- **next-intl** — Italian (default) + English
- **Supabase** (PostgreSQL + RLS)
- **Resend** — transactional email
- **Framer Motion** — animations
- **Vercel** — deployment

## Getting Started

```bash
# Install dependencies
npm install

# Copy and fill in environment variables
cp .env.local.example .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

See `.env.local.example` for all required variables.

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key (public) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-only) |
| `RESEND_API_KEY` | Resend API key for emails |
| `ADMIN_GUID` | Secret path segment for admin panel |
| `ADMIN_PASSWORD` | Admin login password |
| `ADMIN_JWT_SECRET` | JWT signing secret (min 32 chars) |

## Database Setup

Run `supabase/schema.sql` in the Supabase SQL editor to create all tables, triggers, and RLS policies.

## Admin Panel

The admin panel is available at `/admin/[ADMIN_GUID]`.

Features:
- Course CRUD (create, edit, publish/unpublish, delete)
- Contact request management (view, change status)
- Dashboard with stats

## Project Structure

```
src/
├── app/
│   ├── [locale]/          # Public pages (IT/EN)
│   │   ├── page.tsx       # Homepage
│   │   ├── corsi/         # Course catalog + detail
│   │   ├── chi-siamo/     # About page
│   │   └── contatti/      # Contact page
│   ├── admin/[guid]/      # Admin panel (auth-protected)
│   └── api/               # API routes (contact + admin)
├── components/
│   ├── home/              # Homepage sections
│   ├── courses/           # CourseCard, CourseGrid, ContactForm
│   ├── admin/             # AdminLayout, CourseModal
│   └── layout/            # Navbar, Footer, LanguageSwitcher
├── lib/
│   ├── supabase/          # Browser, server, admin clients
│   ├── auth/              # JWT admin session
│   └── resend/            # Email HTML templates
└── types/
    └── database.ts        # TypeScript types for Supabase
```

## Deployment

Set all environment variables in the Vercel dashboard, then:

```bash
vercel --prod
```
