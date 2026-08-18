import type { PlaceWeather } from '../types'
import { todayInputValue } from '../data/trip'

const REFRESH_MS = 3 * 60 * 60 * 1000

type DailyResponse = {
  daily?: {
    temperature_2m_max?: number[]
    temperature_2m_min?: number[]
    windspeed_10m_max?: number[]
  }
}

export function weatherIsFresh(weather: PlaceWeather | undefined, date: string) {
  if (!weather || weather.date !== date) return false
  return Date.now() - Date.parse(weather.fetchedAt) < REFRESH_MS
}

export async function loadDayWeather(
  lat: number,
  lng: number,
  date: string,
): Promise<PlaceWeather> {
  const past = date < todayInputValue()
  const base = past
    ? 'https://archive-api.open-meteo.com/v1/archive'
    : 'https://api.open-meteo.com/v1/forecast'
  const url = new URL(base)
  url.searchParams.set('latitude', String(lat))
  url.searchParams.set('longitude', String(lng))
  url.searchParams.set('daily', 'temperature_2m_max,temperature_2m_min,windspeed_10m_max')
  url.searchParams.set('temperature_unit', 'fahrenheit')
  url.searchParams.set('windspeed_unit', 'mph')
  url.searchParams.set('timezone', 'auto')
  url.searchParams.set('start_date', date)
  url.searchParams.set('end_date', date)

  const response = await fetch(url)
  const data = (await response.json()) as DailyResponse
  if (!response.ok) throw new Error('Weather lookup failed.')

  const highF = data.daily?.temperature_2m_max?.[0]
  const lowF = data.daily?.temperature_2m_min?.[0]
  const windMph = data.daily?.windspeed_10m_max?.[0]
  if (
    typeof highF !== 'number' ||
    typeof lowF !== 'number' ||
    typeof windMph !== 'number'
  ) {
    throw new Error('No weather for that day.')
  }

  return {
    date,
    highF,
    lowF,
    windMph,
    fetchedAt: new Date().toISOString(),
  }
}
