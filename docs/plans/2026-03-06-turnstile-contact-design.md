# Turnstile Contact Form Design

**Goal:** Protect the public contact form flow from bot spam using Cloudflare Turnstile with minimal UX friction.

**Scope:** The existing `ContactForm` component is reused on the contact page and the course detail page, so one integration point covers both surfaces.

## Chosen Approach

Use Cloudflare Turnstile in managed mode inside the shared `ContactForm` component and verify the returned token server-side in `src/app/api/contact/route.ts`.

## Why This Approach

- It protects both public form entry points without duplicating code.
- Managed mode keeps the form low-friction and avoids a visible checkbox flow.
- Server-side verification is required to make the protection meaningful.
- The local development experience remains unblocked when keys are not configured.

## Behavior

- The client renders Turnstile only when `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is present.
- The form submit includes the Turnstile token under a dedicated field in the API payload.
- The contact API verifies the token with Cloudflare using `TURNSTILE_SECRET_KEY`.
- If verification fails, the API returns a 400 response and no database write or email send occurs.
- If the Turnstile environment variables are missing, verification is skipped so local development and preview work can continue until production keys are added.

## Error Handling

- Client: show the existing generic error state when the token is missing or the API rejects the request.
- Server: treat missing or invalid tokens as validation failures only when Turnstile is configured.
- Server: keep current behavior for DB insert and Resend after Turnstile passes.

## Configuration

Add placeholders in `.env.local`:

- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
- `TURNSTILE_SECRET_KEY`

## Testing

- Confirm the form still submits locally when Turnstile keys are not set.
- Confirm the form blocks invalid or missing tokens when keys are set.
- Confirm `/contatti` and course detail pages both render the widget through the shared component.
