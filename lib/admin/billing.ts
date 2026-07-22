/**
 * Client billing domain: id/number generation, invoice status model, and the
 * discount + tax + total math. Isomorphic (no node-only imports) so client
 * pages can share it. Money is per-invoice currency; the revenue dashboard
 * converts to CAD via the shared FX rates.
 */

function randInt(max: number): number {
  const g: any = typeof globalThis !== 'undefined' ? (globalThis as any).crypto : null
  if (g && g.getRandomValues) { const a = new Uint32Array(1); g.getRandomValues(a); return a[0] % max }
  return Math.floor(Math.random() * max)
}
const CH = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
const code = (n: number) => Array.from({ length: n }, () => CH[randInt(CH.length)]).join('')

export function generateClientId() { return 'CL-' + code(5) }
export function generateProjectId() { return 'PRJ-' + code(5) }
export function generateInvoiceNumber() {
  const y = new Date().getFullYear()
  return `INV-${y}-${code(5)}`
}

export const PROJECT_STATUSES = ['active', 'completed', 'on_hold', 'cancelled'] as const
export const PROJECT_STATUS_LABELS: Record<string, string> = {
  active: 'Active', completed: 'Completed', on_hold: 'On hold', cancelled: 'Cancelled',
}

export const INVOICE_STATUSES = ['draft', 'sent', 'partial', 'paid', 'overdue', 'void'] as const
export const INVOICE_STATUS_LABELS: Record<string, string> = {
  draft: 'Draft', sent: 'Sent', partial: 'Partially paid', paid: 'Paid', overdue: 'Overdue', void: 'Void',
}
export const DISCOUNT_TYPES = ['none', 'percent', 'fixed'] as const
export const DEFAULT_TAX_RATE = 13 // Ontario HST

export type InvoiceItem = { description: string; quantity: number; unit_price: number }

/** Compute all money figures for an invoice from its inputs. */
export function computeTotals(
  items: InvoiceItem[],
  discountType: string,
  discountValue: number,
  taxRate: number
) {
  const round = (n: number) => Math.round((Number(n) || 0) * 100) / 100
  const subtotal = round((items || []).reduce((s, it) => s + (Number(it.quantity) || 0) * (Number(it.unit_price) || 0), 0))
  let discount = 0
  if (discountType === 'percent') discount = round(subtotal * (Number(discountValue) || 0) / 100)
  else if (discountType === 'fixed') discount = round(Math.min(Number(discountValue) || 0, subtotal))
  const taxable = round(subtotal - discount)
  const tax = round(taxable * (Number(taxRate) || 0) / 100)
  const total = round(taxable + tax)
  return { subtotal, discount, taxable, tax, total }
}

/**
 * Effective payment state for display/reporting, derived from amounts + status.
 * Void stays void; otherwise fully-paid = paid, some = partial, past due = overdue.
 */
export function paymentState(inv: { status?: string; total: number; amount_paid: number; due_date?: string | null }): string {
  if (inv.status === 'void') return 'void'
  if (inv.status === 'draft') return 'draft'
  const total = Number(inv.total) || 0
  const paid = Number(inv.amount_paid) || 0
  if (paid >= total && total > 0) return 'paid'
  if (paid > 0) return 'partial'
  if (inv.due_date && new Date(inv.due_date) < new Date()) return 'overdue'
  return inv.status || 'sent'
}

export const INVOICE_STATUS_COLOR: Record<string, string> = {
  draft: 'grey', sent: 'blue', partial: 'amber', paid: 'green', overdue: 'red', void: 'grey',
}
