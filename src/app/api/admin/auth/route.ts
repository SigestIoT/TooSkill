import { NextRequest, NextResponse } from 'next/server'
import { createAdminSession, setAdminCookie, clearAdminCookie } from '@/lib/auth/admin'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()
    const adminPassword = process.env.ADMIN_PASSWORD
    if (!adminPassword || password !== adminPassword) {
      return NextResponse.json({ error: 'Password non corretta' }, { status: 401 })
    }
    const token = await createAdminSession()
    await setAdminCookie(token)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE() {
  await clearAdminCookie()
  return NextResponse.json({ ok: true })
}
