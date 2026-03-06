import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import {
  confirmationEmail,
  confirmationSubject,
  adminNotificationEmail,
} from '@/lib/resend/templates'

type TurnstileVerificationResponse = {
  success: boolean
}

type ResendSendResponse = {
  data: { id: string } | null
  error: { message: string; name?: string } | null
}

async function verifyTurnstile(token: string, secret: string, remoteIp?: string | null) {
  const body = new URLSearchParams({
    secret,
    response: token,
  })

  if (remoteIp) {
    body.set('remoteip', remoteIp)
  }

  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  })

  if (!response.ok) {
    return false
  }

  const result = (await response.json()) as TurnstileVerificationResponse
  return result.success
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, company, phone, message, course_id, course_title, type, locale, turnstileToken } = body

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
    const turnstileSecretKey = process.env.TURNSTILE_SECRET_KEY
    const turnstileConfigured =
      Boolean(turnstileSiteKey) &&
      Boolean(turnstileSecretKey) &&
      turnstileSiteKey !== 'your_turnstile_site_key_here' &&
      turnstileSecretKey !== 'your_turnstile_secret_key_here'

    if (turnstileConfigured) {
      if (typeof turnstileToken !== 'string' || !turnstileToken) {
        return NextResponse.json({ error: 'Turnstile verification failed' }, { status: 400 })
      }

      const forwardedFor = request.headers.get('x-forwarded-for')
      const remoteIp = forwardedFor?.split(',')[0]?.trim() ?? null
      const isValidTurnstileToken = await verifyTurnstile(turnstileToken, turnstileSecretKey!, remoteIp)

      if (!isValidTurnstileToken) {
        return NextResponse.json({ error: 'Turnstile verification failed' }, { status: 400 })
      }
    }

    // Save to Supabase
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const supabase = createAdminClient()
      const { error: dbError } = await supabase.from('contact_requests').insert({
        name,
        email,
        company: company ?? null,
        phone: phone ?? null,
        message,
        course_id: course_id ?? null,
        course_title: course_title ?? null,
        type: type ?? 'general',
        locale: locale ?? 'it',
      })

      if (dbError) {
        console.error('[contact/route] Supabase insert failed', dbError)
        return NextResponse.json({ error: 'Unable to save contact request' }, { status: 500 })
      }
    }

    // Send emails via Resend
    const resendApiKey = process.env.RESEND_API_KEY
    console.info('[contact/route] email config check', {
      hasResendApiKey: Boolean(resendApiKey),
      hasResendFrom: Boolean(process.env.RESEND_FROM),
      hasAdminEmail: Boolean(process.env.ADMIN_EMAIL),
    })
    if (!resendApiKey) {
      console.error('[contact/route] Missing RESEND_API_KEY in runtime environment')
      return NextResponse.json({ error: 'Email service is not configured' }, { status: 503 })
    }

    const { Resend } = await import('resend')
    const resend = new Resend(resendApiKey)
    const fromAddress = process.env.RESEND_FROM ?? 'TooSkill <noreply@tooskill.it>'
    const adminEmail = process.env.ADMIN_EMAIL ?? 'info@tooskill.it'

    const [confirmationResult, adminResult] = (await Promise.all([
      resend.emails.send({
        from: fromAddress,
        to: email,
        subject: confirmationSubject(locale),
        html: confirmationEmail(name, locale),
      }),
      resend.emails.send({
        from: fromAddress,
        to: adminEmail,
        subject: `Nuova richiesta da ${name}${course_title ? ` — ${course_title}` : ''}`,
        replyTo: email,
        html: adminNotificationEmail({ name, email, company, phone, message, course_title, type }),
      }),
    ])) as [ResendSendResponse, ResendSendResponse]

    const resendFailures = [
      confirmationResult.error
        ? {
            emailType: 'confirmation',
            recipient: email,
            error: confirmationResult.error,
          }
        : null,
      adminResult.error
        ? {
            emailType: 'admin_notification',
            recipient: adminEmail,
            error: adminResult.error,
          }
        : null,
    ].filter(Boolean)

    if (resendFailures.length > 0) {
      console.error('[contact/route] Resend send failed', resendFailures)
      return NextResponse.json({ error: 'Unable to send notification emails' }, { status: 502 })
    }

    console.info('[contact/route] Resend send success', {
      confirmationId: confirmationResult.data?.id ?? null,
      adminNotificationId: adminResult.data?.id ?? null,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[contact/route]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
