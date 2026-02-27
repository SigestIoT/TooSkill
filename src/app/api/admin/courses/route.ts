import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminSession } from '@/lib/auth/admin'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
  if (!(await verifyAdminSession(request)))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  if (!(await verifyAdminSession(request)))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const supabase = createAdminClient()
  const { data, error } = await supabase.from('courses').insert(body).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data, { status: 201 })
}
