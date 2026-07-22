import { NextRequest, NextResponse } from 'next/server'
import { requireFinance } from '@/lib/admin/auth'
import { getSetting, setSetting, audit } from '@/lib/admin/db'
import { CURRENCIES, DEFAULT_FX, FxRates } from '@/lib/admin/finance'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const auth = await requireFinance()
  if ('error' in auth) return auth.error
  const fx = (await getSetting<FxRates>('fx_rates')) || DEFAULT_FX
  return NextResponse.json({ fx })
}

export async function PUT(req: NextRequest) {
  const auth = await requireFinance()
  if ('error' in auth) return auth.error
  const b = await req.json().catch(() => ({}))
  const incoming = b.rates || {}
  const rates: Record<string, number> = { CAD: 1 }
  for (const c of CURRENCIES) {
    const v = Number(incoming[c])
    rates[c] = c === 'CAD' ? 1 : (isFinite(v) && v > 0 ? v : DEFAULT_FX.rates[c])
  }
  const fx: FxRates = { base: 'CAD', updatedAt: new Date().toISOString(), rates }
  await setSetting('fx_rates', fx)
  await audit(auth.user.email, 'fx_rates_update', JSON.stringify(rates))
  return NextResponse.json({ ok: true, fx })
}
