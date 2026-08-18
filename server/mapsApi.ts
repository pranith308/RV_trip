import {
  autocompletePlaces,
  driveRoute,
  MapsRequestError,
  MapsSetupError,
  placeDetails,
} from './mapsGoogle.js'

type MapsRoute = 'status' | 'autocomplete' | 'details' | 'route'

function asString(value: unknown) {
  return typeof value === 'string' ? value : ''
}

function asNumber(value: unknown) {
  return typeof value === 'number' ? value : Number.NaN
}

export async function runMapsApi(
  method: string,
  route: MapsRoute,
  body: Record<string, unknown>,
  apiKey: string | undefined,
): Promise<{ status: number; body: unknown }> {
  try {
    if (route === 'status') {
      if (method !== 'GET') return { status: 405, body: { error: 'Method not allowed.' } }
      return { status: 200, body: { configured: Boolean(apiKey) } }
    }

    if (method !== 'POST') return { status: 405, body: { error: 'Method not allowed.' } }

    if (route === 'autocomplete') {
      const suggestions = await autocompletePlaces(
        apiKey,
        asString(body.input),
        asString(body.sessionToken),
      )
      return { status: 200, body: { suggestions } }
    }

    if (route === 'details') {
      const place = await placeDetails(apiKey, asString(body.placeId), asString(body.sessionToken))
      return { status: 200, body: { place } }
    }

    const origin = body.origin as { lat?: unknown; lng?: unknown } | undefined
    const destination = body.destination as { lat?: unknown; lng?: unknown } | undefined
    const routeResult = await driveRoute(
      apiKey,
      { lat: asNumber(origin?.lat), lng: asNumber(origin?.lng) },
      { lat: asNumber(destination?.lat), lng: asNumber(destination?.lng) },
    )
    return { status: 200, body: { route: routeResult } }
  } catch (error) {
    if (error instanceof MapsSetupError || error instanceof MapsRequestError) {
      return { status: error.status, body: { error: error.message } }
    }
    return { status: 500, body: { error: 'Maps request failed.' } }
  }
}
