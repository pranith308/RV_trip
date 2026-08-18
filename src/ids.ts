export function newId() {
  try {
    if (typeof crypto.randomUUID === 'function') return crypto.randomUUID()
  } catch {
    /* HTTP on a phone is not a secure context. */
  }
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`
}
