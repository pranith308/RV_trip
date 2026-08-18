import type { DriveResult, MappedPlace, PlaceSuggestion } from '../src/maps/types.js'

type AutocompleteResponse = {
  error?: { message?: string }
  suggestions?: Array<{
    placePrediction?: {
      placeId?: string
      structuredFormat?: {
        mainText?: { text?: string }
        secondaryText?: { text?: string }
      }
    }
  }>
}

type DetailsResponse = {
  error?: { message?: string }
  id?: string
  displayName?: { text?: string }
  formattedAddress?: string
  location?: { latitude?: number; longitude?: number }
}

type RoutesResponse = {
  error?: { message?: string }
  routes?: Array<{
    distanceMeters?: number
    duration?: string
  }>
}

function requireKey(apiKey: string | undefined) {
  if (!apiKey) {
    throw new MapsSetupError('Google Maps is not configured on this machine.')
  }
  return apiKey
}

export class MapsSetupError extends Error {
  status = 503
}

export class MapsRequestError extends Error {
  status = 502
}

export async function autocompletePlaces(
  apiKey: string | undefined,
  input: string,
  sessionToken: string,
): Promise<PlaceSuggestion[]> {
  const key = requireKey(apiKey)
  const query = input.trim()
  if (query.length < 2) return []

  const response = await fetch('https://places.googleapis.com/v1/places:autocomplete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': key,
    },
    body: JSON.stringify({
      input: query,
      sessionToken,
      includedRegionCodes: ['us'],
    }),
  })
  const data = (await response.json()) as AutocompleteResponse
  if (!response.ok) {
    throw new MapsRequestError(data.error?.message ?? 'Place search failed.')
  }

  return (data.suggestions ?? [])
    .map((item) => {
      const prediction = item.placePrediction
      if (!prediction?.placeId) return null
      return {
        placeId: prediction.placeId,
        name: prediction.structuredFormat?.mainText?.text?.trim() || query,
        subtitle: prediction.structuredFormat?.secondaryText?.text?.trim() || '',
      }
    })
    .filter((item): item is PlaceSuggestion => Boolean(item))
}

export async function placeDetails(
  apiKey: string | undefined,
  placeId: string,
  sessionToken: string,
): Promise<MappedPlace> {
  const key = requireKey(apiKey)
  const id = placeId.trim().replace(/^places\//, '')
  if (!id) throw new MapsRequestError('Missing place.')

  const url = new URL(`https://places.googleapis.com/v1/places/${encodeURIComponent(id)}`)
  if (sessionToken) url.searchParams.set('sessionToken', sessionToken)

  const response = await fetch(url, {
    headers: {
      'X-Goog-Api-Key': key,
      'X-Goog-FieldMask': 'id,displayName,formattedAddress,location',
    },
  })
  const data = (await response.json()) as DetailsResponse
  if (!response.ok) {
    throw new MapsRequestError(data.error?.message ?? 'Could not load that place.')
  }

  const lat = data.location?.latitude
  const lng = data.location?.longitude
  if (typeof lat !== 'number' || typeof lng !== 'number') {
    throw new MapsRequestError('That place has no map pin.')
  }

  return {
    placeId: data.id || id,
    name: data.displayName?.text?.trim() || 'Place',
    address: data.formattedAddress?.trim() || '',
    lat,
    lng,
  }
}

export async function driveRoute(
  apiKey: string | undefined,
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number },
): Promise<DriveResult> {
  const key = requireKey(apiKey)
  const response = await fetch('https://routes.googleapis.com/directions/v2:computeRoutes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': key,
      'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters',
    },
    body: JSON.stringify({
      origin: { location: { latLng: { latitude: origin.lat, longitude: origin.lng } } },
      destination: {
        location: { latLng: { latitude: destination.lat, longitude: destination.lng } },
      },
      travelMode: 'DRIVE',
      routingPreference: 'TRAFFIC_UNAWARE',
      units: 'IMPERIAL',
    }),
  })
  const data = (await response.json()) as RoutesResponse
  if (!response.ok) {
    throw new MapsRequestError(data.error?.message ?? 'Could not get drive time.')
  }

  const route = data.routes?.[0]
  const duration = Number.parseInt(String(route?.duration ?? '').replace(/s$/i, ''), 10)
  const distanceMeters = route?.distanceMeters
  if (!Number.isFinite(duration) || typeof distanceMeters !== 'number') {
    throw new MapsRequestError('No driving route between those places.')
  }

  return { distanceMeters, durationSeconds: duration }
}
