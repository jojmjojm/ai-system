import type { ScanResult, LeadForm } from '@/types'

const API_BASE = import.meta.env.VITE_API_URL || ''

export async function scanWebsite(url: string): Promise<ScanResult> {
  const res = await fetch(`${API_BASE}/api/scan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url })
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Scanningen fejlede' }))
    throw new Error(err.error || 'Scanningen fejlede')
  }
  return res.json()
}

export async function submitLead(data: LeadForm): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/api/lead`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!res.ok) throw new Error('Kunne ikke sende besked')
  return res.json()
}
