import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Plugin } from 'vite'
import { runMapsApi } from './mapsApi.ts'

function send(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(body))
}

function readJson(req: IncomingMessage): Promise<Record<string, unknown>> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (chunk) => chunks.push(Buffer.from(chunk)))
    req.on('end', () => {
      try {
        const raw = Buffer.concat(chunks).toString('utf8')
        resolve(raw ? (JSON.parse(raw) as Record<string, unknown>) : {})
      } catch (error) {
        reject(error)
      }
    })
    req.on('error', reject)
  })
}

function routeFromPath(path: string) {
  if (path === '/api/maps/status') return 'status' as const
  if (path === '/api/maps/autocomplete') return 'autocomplete' as const
  if (path === '/api/maps/details') return 'details' as const
  if (path === '/api/maps/route') return 'route' as const
  return null
}

export function mapsDevPlugin(apiKey: string | undefined): Plugin {
  const handler = async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
    const path = req.url?.split('?')[0] ?? ''
    const route = routeFromPath(path)
    if (!route) {
      next()
      return
    }

    try {
      const body = req.method === 'POST' ? await readJson(req) : {}
      const result = await runMapsApi(req.method ?? 'GET', route, body, apiKey)
      send(res, result.status, result.body)
    } catch {
      send(res, 500, { error: 'Maps request failed.' })
    }
  }

  return {
    name: 'maps-dev-api',
    configureServer(server) {
      server.middlewares.use(handler)
    },
    configurePreviewServer(server) {
      server.middlewares.use(handler)
    },
  }
}
