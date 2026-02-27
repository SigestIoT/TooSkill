export function confirmationEmail(name: string, locale: string = 'it'): string {
  const it = {
    subject: 'Abbiamo ricevuto la tua richiesta — TooSkill',
    greeting: `Ciao ${name},`,
    body: 'Grazie per averci contattato! Abbiamo ricevuto la tua richiesta e ti risponderemo entro 24 ore lavorative.',
    closing: 'A presto,',
    team: 'Il team TooSkill',
  }
  const en = {
    subject: 'We received your request — TooSkill',
    greeting: `Hi ${name},`,
    body: 'Thank you for reaching out! We received your request and will get back to you within 24 business hours.',
    closing: 'Best,',
    team: 'The TooSkill team',
  }
  const c = locale === 'en' ? en : it
  return html(c.greeting, c.body, c.closing, c.team)
}

export function confirmationSubject(locale: string = 'it'): string {
  return locale === 'en'
    ? 'We received your request — TooSkill'
    : 'Abbiamo ricevuto la tua richiesta — TooSkill'
}

export function adminNotificationEmail(data: {
  name: string
  email: string
  company?: string | null
  phone?: string | null
  message: string
  course_title?: string | null
  type: string
}): string {
  const rows = [
    ['Nome', data.name],
    ['Email', data.email],
    data.company ? ['Azienda', data.company] : null,
    data.phone ? ['Telefono', data.phone] : null,
    data.course_title ? ['Corso', data.course_title] : null,
    ['Tipo', data.type],
  ]
    .filter(Boolean)
    .map(
      (r) =>
        `<tr><td style="padding:6px 12px;font-weight:600;color:#0D1B2A;width:120px;border-bottom:1px solid #E5E7EB">${r![0]}</td><td style="padding:6px 12px;color:#4B5563;border-bottom:1px solid #E5E7EB">${r![1]}</td></tr>`
    )
    .join('')

  return `<!DOCTYPE html><html><body style="font-family:Inter,sans-serif;background:#F8FAFF;padding:32px">
<div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;border:1px solid #E5E7EB;overflow:hidden">
  <div style="background:linear-gradient(135deg,#060B18,#0D1B2A);padding:24px 32px">
    <span style="color:#fff;font-size:18px;font-weight:700">Too<span style="color:#4F6EF7">Skill</span></span>
    <p style="color:#fff;opacity:.6;margin:4px 0 0;font-size:13px">Nuova richiesta di contatto</p>
  </div>
  <div style="padding:24px 32px">
    <table style="width:100%;border-collapse:collapse">${rows}</table>
    <div style="margin-top:20px;padding:16px;background:#F8FAFF;border-radius:8px;border:1px solid #E5E7EB">
      <p style="margin:0;font-size:13px;color:#4B5563;line-height:1.6">${data.message.replace(/\n/g, '<br>')}</p>
    </div>
  </div>
</div></body></html>`
}

function html(greeting: string, body: string, closing: string, team: string): string {
  return `<!DOCTYPE html><html><body style="font-family:Inter,sans-serif;background:#F8FAFF;padding:32px">
<div style="max-width:520px;margin:0 auto;background:#fff;border-radius:12px;border:1px solid #E5E7EB;overflow:hidden">
  <div style="background:linear-gradient(135deg,#060B18,#0D1B2A);padding:24px 32px">
    <span style="color:#fff;font-size:20px;font-weight:700">Too<span style="color:#4F6EF7">Skill</span></span>
  </div>
  <div style="padding:32px">
    <p style="color:#0D1B2A;font-size:15px;margin:0 0 12px">${greeting}</p>
    <p style="color:#4B5563;font-size:14px;line-height:1.7;margin:0 0 24px">${body}</p>
    <p style="color:#6B7280;font-size:13px;margin:0">${closing}<br><strong style="color:#0D1B2A">${team}</strong></p>
  </div>
  <div style="background:#F8FAFF;padding:16px 32px;border-top:1px solid #E5E7EB">
    <p style="color:#9CA3AF;font-size:11px;margin:0">TooSkill by Sigest — info@tooskill.it</p>
  </div>
</div></body></html>`
}
