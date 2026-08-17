import type { TripData } from '../types'
import { getSupabase, isCloudConfigured } from './supabase'
import { EMPTY_TRIP, ensureShopCategories, normalizeTrip, sameTrip } from './tripShape'

const KEY = 'expedition.tripData'
const STATE_ID = 'main'

let snapshot: TripData = loadLocal()
const listeners = new Set<() => void>()
let writeTimer: number | undefined
let pushing = false

function loadLocal(): TripData {
  try {
    const raw = localStorage.getItem(KEY)
    const next = raw ? ensureShopCategories(normalizeTrip(JSON.parse(raw))) : EMPTY_TRIP
    localStorage.setItem(KEY, JSON.stringify(next))
    return next
  } catch {
    return EMPTY_TRIP
  }
}

function emit(next: TripData, persistCloud: boolean) {
  snapshot = next
  localStorage.setItem(KEY, JSON.stringify(next))
  listeners.forEach((listener) => listener())
  if (persistCloud) scheduleCloudWrite()
}

function scheduleCloudWrite() {
  if (!isCloudConfigured()) return
  window.clearTimeout(writeTimer)
  writeTimer = window.setTimeout(() => {
    void pushTrip(snapshot)
  }, 400)
}

async function pushTrip(data: TripData) {
  const supabase = getSupabase()
  if (!supabase || pushing) {
    if (pushing) scheduleCloudWrite()
    return
  }
  pushing = true
  try {
    const { error } = await supabase.from('trip_state').upsert({
      id: STATE_ID,
      data,
      updated_at: new Date().toISOString(),
    })
    if (error) console.error('Could not save trip', error.message)
  } finally {
    pushing = false
  }
}

export function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function getSnapshot() {
  return snapshot
}

export function updateTrip(mutator: (current: TripData) => TripData) {
  emit(mutator(snapshot), true)
}

export async function bootTrip() {
  const supabase = getSupabase()
  if (!supabase) return

  const { data, error } = await supabase
    .from('trip_state')
    .select('data')
    .eq('id', STATE_ID)
    .maybeSingle()

  if (error) {
    console.error('Could not load trip', error.message)
    return
  }

  const cloudParsed = data?.data ? normalizeTrip(data.data) : EMPTY_TRIP
  const cloud = data?.data ? ensureShopCategories(cloudParsed) : EMPTY_TRIP
  const cloudEmpty = sameTrip(cloud, EMPTY_TRIP)
  const localEmpty = sameTrip(snapshot, EMPTY_TRIP)
  const cloudNeedsSave = Boolean(data?.data) && !sameTrip(cloud, cloudParsed)

  if (cloudEmpty && !localEmpty) {
    await pushTrip(snapshot)
  } else if (!cloudEmpty && !sameTrip(cloud, snapshot)) {
    emit(cloud, cloudNeedsSave)
  } else if (cloudNeedsSave) {
    await pushTrip(cloud)
  }

  supabase
    .channel('trip-state')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'trip_state' },
      (payload) => {
        const row = payload.new as { data?: unknown } | null
        if (!row?.data) return
        const next = ensureShopCategories(normalizeTrip(row.data))
        if (!sameTrip(next, snapshot)) {
          const migrated = !sameTrip(next, normalizeTrip(row.data))
          emit(next, migrated)
        }
      },
    )
    .subscribe()
}

export { newId } from '../ids'
