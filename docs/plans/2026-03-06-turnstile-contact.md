# Turnstile Contact Protection Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add Cloudflare Turnstile protection to the shared contact form and verify tokens in the contact API.

**Architecture:** The shared `ContactForm` client component will render a managed Turnstile widget when the public site key is configured and include the returned token in the existing JSON request body. The `/api/contact` route will verify the token with Cloudflare before saving the request to Supabase or sending emails, while skipping verification when Turnstile environment variables are not configured.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Cloudflare Turnstile, native `fetch`

---

### Task 1: Add Turnstile configuration placeholders

**Files:**
- Modify: `.env.local`

**Step 1: Add placeholder public and secret Turnstile variables**

Add:

```env
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_turnstile_site_key_here
TURNSTILE_SECRET_KEY=your_turnstile_secret_key_here
```

**Step 2: Verify naming matches client/server usage**

Client uses `NEXT_PUBLIC_TURNSTILE_SITE_KEY`; server uses `TURNSTILE_SECRET_KEY`.

### Task 2: Render Turnstile in the shared contact form

**Files:**
- Modify: `src/components/courses/ContactForm.tsx`

**Step 1: Load the Turnstile script in the client component**

Use `next/script` with the Cloudflare Turnstile API URL and render only when the site key is configured.

**Step 2: Store and refresh the Turnstile token**

Track the token in component state and update it from Turnstile success and expiry callbacks.

**Step 3: Include the token in the existing `/api/contact` request**

Add `turnstileToken` to the JSON body.

**Step 4: Block empty-token submits only when Turnstile is enabled**

If the widget is enabled but no token is present, reuse the existing error state and do not submit.

### Task 3: Verify Turnstile server-side before processing contact requests

**Files:**
- Modify: `src/app/api/contact/route.ts`

**Step 1: Extract the Turnstile token from the request body**

Read `turnstileToken` alongside the existing fields.

**Step 2: Add a small verification helper**

POST the token, secret, and optional remote IP to `https://challenges.cloudflare.com/turnstile/v0/siteverify`.

**Step 3: Enforce verification only when Turnstile is configured**

If both env vars exist, reject invalid or missing tokens with HTTP 400 before DB and email work.

**Step 4: Preserve current behavior otherwise**

If env vars are absent, continue with the current contact flow.

### Task 4: Validate the integration

**Files:**
- Verify: `src/components/courses/ContactForm.tsx`
- Verify: `src/app/api/contact/route.ts`
- Verify: `.env.local`

**Step 1: Run lint**

Run: `npm run lint`

**Step 2: Review for regressions**

Confirm that both public forms still use the same component and that error handling remains coherent.
