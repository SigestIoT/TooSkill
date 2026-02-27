import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminSession } from '@/lib/auth/admin'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
  if (!(await verifyAdminSession(request)))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('contact_requests')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
