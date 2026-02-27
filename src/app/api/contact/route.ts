import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import {
  confirmationEmail,
  confirmationSubject,
  adminNotificationEmail,
} from '@/lib/resend/templates'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, company, phone, message, course_id, course_title, type, locale } = body

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    // Save to Supabase
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const supabase = createAdminClient()
      await supabase.from('contact_requests').insert({
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
    }

    // Send emails via Resend
    if (process.env.RESEND_API_KEY) {
      const { Resend } = await import('resend')
      const resend = new Resend(process.env.RESEND_API_KEY)
      const fromAddress = process.env.RESEND_FROM ?? 'TooSkill <noreply@tooskill.it>'
      const adminEmail = process.env.ADMIN_EMAIL ?? 'info@tooskill.it'

      await Promise.all([
        // Confirmation to user
        resend.emails.send({
          from: fromAddress,
          to: email,
          subject: confirmationSubject(locale),
          html: confirmationEmail(name, locale),
        }),
        // Notification to admin
        resend.emails.send({
          from: fromAddress,
          to: adminEmail,
          subject: `Nuova richiesta da ${name}${course_title ? ` — ${course_title}` : ''}`,
          html: adminNotificationEmail({ name, email, company, phone, message, course_title, type }),
        }),
      ])
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[contact/route]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
