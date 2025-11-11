// Prefer explicit env override; otherwise use backend in dev, relative in prod
const BASE = (
  (import.meta?.env?.VITE_API_BASE) ||
  (import.meta?.env?.DEV ? 'http://localhost:4000/api' : '/api')
)

export async function listUsages() {
  const res = await fetch(`${BASE}/usages`)
  if (!res.ok) throw new Error('Failed to load usages')
  return res.json()
}

export async function createUsage(payload) {
  const res = await fetch(`${BASE}/usages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Failed to create usage')
  return res.json()
}

export async function deleteUsage(id) {
  const res = await fetch(`${BASE}/usages/${encodeURIComponent(id)}`, { method: 'DELETE' })
  if (!res.ok && res.status !== 204) throw new Error('Failed to delete usage')
}

export async function clearAllUsages() {
  const res = await fetch(`${BASE}/usages`, { method: 'DELETE' })
  if (!res.ok && res.status !== 204) throw new Error('Failed to clear usages')
}

// Proposal API functions
export async function listProposals() {
  const res = await fetch(`${BASE}/proposals`)
  if (!res.ok) throw new Error('Failed to load proposals')
  return res.json()
}

export async function createProposal(payload) {
  const res = await fetch(`${BASE}/proposals`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Failed to create proposal')
  return res.json()
}

export async function updateProposal(id, payload) {
  const res = await fetch(`${BASE}/proposals/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Failed to update proposal')
  return res.json()
}

export async function deleteProposal(id) {
  const res = await fetch(`${BASE}/proposals/${encodeURIComponent(id)}`, { method: 'DELETE' })
  if (!res.ok && res.status !== 204) throw new Error('Failed to delete proposal')
}

export async function clearAllProposals() {
  const res = await fetch(`${BASE}/proposals`, { method: 'DELETE' })
  if (!res.ok && res.status !== 204) throw new Error('Failed to clear proposals')
}
