import { useEffect, useRef } from 'react'
import { isMappedPlace, loadDrive, mapsConfigured } from './client'
import type { PlanDay, PlanPlace } from '../types'

export function useDriveLegs(
  days: PlanDay[],
  setPlaceDrives: (
    dayId: string,
    drives: Record<string, PlanPlace['driveFromPrevious'] | null>,
  ) => void,
) {
  const inFlight = useRef(new Set<string>())

  useEffect(() => {
    let cancelled = false

    async function sync() {
      const configured = await mapsConfigured()
      if (!configured || cancelled) return

      for (const day of days) {
        const drives: Record<string, PlanPlace['driveFromPrevious'] | null> = {}
        const waits: Array<Promise<void>> = []

        for (let index = 1; index < day.places.length; index += 1) {
          const previous = day.places[index - 1]
          const current = day.places[index]
          if (!previous || !current) continue

          if (isMappedPlace(previous) && isMappedPlace(current) && previous.placeId) {
            if (current.driveFromPrevious?.fromPlaceId === previous.placeId) continue
            const key = `${day.id}:${previous.placeId}:${current.placeId}`
            if (inFlight.current.has(key)) continue
            inFlight.current.add(key)
            waits.push(
              loadDrive(
                { lat: previous.lat as number, lng: previous.lng as number },
                { lat: current.lat as number, lng: current.lng as number },
              )
                .then((route) => {
                  drives[current.id] = {
                    fromPlaceId: previous.placeId as string,
                    distanceMeters: route.distanceMeters,
                    durationSeconds: route.durationSeconds,
                  }
                })
                .catch(() => undefined)
                .finally(() => inFlight.current.delete(key)),
            )
          } else if (current.driveFromPrevious) {
            drives[current.id] = null
          }
        }

        if (waits.length > 0) await Promise.all(waits)
        if (!cancelled && Object.keys(drives).length > 0) setPlaceDrives(day.id, drives)
      }
    }

    void sync()
    return () => {
      cancelled = true
    }
  }, [days, setPlaceDrives])
}
