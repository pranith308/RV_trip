import { runMapsApi } from './mapsApi'

type VercelRes = {
  status: (code: number) => VercelRes
  json: (body: unknown) => void
  setHeader: (name: string, value: string) => void
}

type VercelReq = {
  method?: string
  body?: unknown
}

function asBody(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {}
}

function mapsKey() {
  const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process
    ?.env
  return env?.GOOGLE_MAPS_API_KEY
}

export function mapsHandler(route: 'status' | 'autocomplete' | 'details' | 'route') {
  return async function handler(req: VercelReq, res: VercelRes) {
    res.setHeader('Content-Type', 'application/json')
    const result = await runMapsApi(req.method ?? 'GET', route, asBody(req.body), mapsKey())
    res.status(result.status).json(result.body)
  }
}
