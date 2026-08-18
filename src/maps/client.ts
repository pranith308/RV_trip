import type { DriveResult, MappedPlace, PlaceSuggestion } from './types'

async function readJson<T>(response: Response): Promise<T> {
  const data = (await response.json()) as T & { error?: string }
  if (!response.ok) {
    throw new Error(data.error || 'Maps request failed.')
  }
  return data
}

export async function mapsConfigured() {
  try {
    const data = await readJson<{ configured: boolean }>(await fetch('/api/maps/status'))
    return Boolean(data.configured)
  } catch {
    return false
  }
}

export async function searchPlaces(input: string, sessionToken: string) {
  const data = await readJson<{ suggestions: PlaceSuggestion[] }>(
    await fetch('/api/maps/autocomplete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input, sessionToken }),
    }),
  )
  return data.suggestions ?? []
}

export async function loadPlace(placeId: string, sessionToken: string) {
  const data = await readJson<{ place: MappedPlace }>(
    await fetch('/api/maps/details', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ placeId, sessionToken }),
    }),
  )
  return data.place
}

export async function loadDrive(
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number },
) {
  const data = await readJson<{ route: DriveResult }>(
    await fetch('/api/maps/route', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ origin, destination }),
    }),
  )
  return data.route
}

export function isMappedPlace(place: {
  placeId?: string
  lat?: number
  lng?: number
}) {
  return Boolean(
    place.placeId && typeof place.lat === 'number' && typeof place.lng === 'number',
  )
}

export function mapsSearchUrl(lat: number, lng: number) {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
}

export function mapsDirectionsUrl(
  destination: { lat: number; lng: number },
  origin?: { lat: number; lng: number },
) {
  const params = new URLSearchParams({
    api: '1',
    destination: `${destination.lat},${destination.lng}`,
    travelmode: 'driving',
  })
  if (origin) params.set('origin', `${origin.lat},${origin.lng}`)
  return `https://www.google.com/maps/dir/?${params.toString()}`
}

export function formatDriveTime(durationSeconds: number) {
  const minutes = Math.max(1, Math.round(durationSeconds / 60))
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  return hours === 0 ? `${minutes} min` : rest === 0 ? `${hours}h` : `${hours}h ${rest}m`
}

export function formatDriveDistance(distanceMeters: number) {
  const miles = distanceMeters / 1609.344
  return miles < 10 ? `${miles.toFixed(1)} mi` : `${Math.round(miles)} mi`
}
