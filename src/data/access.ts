import type { TripAccess } from '../types'

const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

export function generateJoinCode(length = 6) {
  return Array.from(
    { length },
    () => CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)],
  ).join('')
}

export function defaultTripAccess(): TripAccess {
  return {
    hostPersonId: null,
    joinCode: generateJoinCode(),
    allowNewTravelers: true,
  }
}

export function normalizeJoinCode(value: string) {
  return value.trim().toUpperCase().replace(/[^A-Z0-9]/g, '')
}
