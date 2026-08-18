import { runMapsApi } from './mapsApi.ts'

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

export function mapsHandler(route: 'status' | 'autocomplete' | 'details' | 'route') {
  return async function handler(req: VercelReq, res: VercelRes) {
    res.setHeader('Content-Type', 'application/json')
    const result = await runMapsApi(
      req.method ?? 'GET',
      route,
      asBody(req.body),
      process.env.GOOGLE_MAPS_API_KEY,
    )
    res.status(result.status).json(result.body)
  }
}
