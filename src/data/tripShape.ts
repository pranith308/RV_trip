import type { ShopItem, TripData } from '../types'

export const EMPTY_TRIP: TripData = {
  checklists: [],
  notes: [],
  shopEveryone: [],
  shopPersonal: {},
  shopGroups: [],
  days: [],
}

export function normalizeTrip(raw: unknown): TripData {
  const parsed = (raw ?? {}) as Partial<TripData> & { shopItems?: ShopItem[] }
  return {
    checklists: parsed.checklists ?? [],
    notes: parsed.notes ?? [],
    shopEveryone: parsed.shopEveryone ?? parsed.shopItems ?? [],
    shopPersonal: parsed.shopPersonal ?? {},
    shopGroups: parsed.shopGroups ?? [],
    days: parsed.days ?? [],
  }
}

export function sameTrip(left: TripData, right: TripData) {
  return JSON.stringify(left) === JSON.stringify(right)
}
