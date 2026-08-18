import { useEffect, useRef } from 'react'
import { isMappedPlace } from '../maps/client'
import type { PlanDay, PlaceWeather } from '../types'
import { loadDayWeather, weatherIsFresh } from './client'

export function usePlaceWeather(
  days: PlanDay[],
  setPlaceWeather: (dayId: string, weather: Record<string, PlaceWeather | null>) => void,
) {
  const inFlight = useRef(new Set<string>())

  useEffect(() => {
    let cancelled = false

    async function sync() {
      for (const day of days) {
        if (!day.date) continue
        const updates: Record<string, PlaceWeather | null> = {}
        const waits: Array<Promise<void>> = []

        for (const place of day.places) {
          if (!isMappedPlace(place)) {
            if (place.weather) updates[place.id] = null
            continue
          }
          if (weatherIsFresh(place.weather, day.date)) continue

          const key = `${place.id}:${day.date}:${place.lat}:${place.lng}`
          if (inFlight.current.has(key)) continue
          inFlight.current.add(key)

          waits.push(
            loadDayWeather(place.lat as number, place.lng as number, day.date)
              .then((weather) => {
                updates[place.id] = weather
              })
              .catch(() => undefined)
              .finally(() => inFlight.current.delete(key)),
          )
        }

        if (waits.length > 0) await Promise.all(waits)
        if (!cancelled && Object.keys(updates).length > 0) {
          setPlaceWeather(day.id, updates)
        }
      }
    }

    void sync()
    return () => {
      cancelled = true
    }
  }, [days, setPlaceWeather])
}
