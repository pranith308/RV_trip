import type { Person } from '../types'
import { newId } from '../ids'

const PEOPLE_KEY = 'expedition.people'
const DEVICE_KEY = 'expedition.deviceId'
const SESSION_KEY = 'expedition.sessionPersonId'
const TRUSTED_KEY = 'expedition.trustedPersonIds'

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export function getDeviceId(): string {
  let id = localStorage.getItem(DEVICE_KEY)
  if (!id) {
    id = newId()
    localStorage.setItem(DEVICE_KEY, id)
  }
  return id
}

export function loadPeople(): Person[] {
  return readJson<Person[]>(PEOPLE_KEY, [])
}

export function savePeople(people: Person[]): void {
  localStorage.setItem(PEOPLE_KEY, JSON.stringify(people))
}

export function loadSessionPersonId(): string | null {
  return localStorage.getItem(SESSION_KEY)
}

export function saveSessionPersonId(id: string | null): void {
  if (id) localStorage.setItem(SESSION_KEY, id)
  else localStorage.removeItem(SESSION_KEY)
}

export async function hashPin(personId: string, pin: string): Promise<string> {
  const payload = new TextEncoder().encode(`${personId}:${pin}`)
  const digest = await crypto.subtle.digest('SHA-256', payload)
  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, '0'),
  ).join('')
}

function loadTrusted(): string[] {
  const stored = readJson<string[]>(TRUSTED_KEY, [])
  if (stored.length) return stored
  const deviceId = getDeviceId()
  const fromPeople = loadPeople()
    .filter((person) => person.deviceTokens?.includes(deviceId))
    .map((person) => person.id)
  if (fromPeople.length) localStorage.setItem(TRUSTED_KEY, JSON.stringify(fromPeople))
  return fromPeople
}

export function isPersonTrusted(personId: string): boolean {
  return loadTrusted().includes(personId)
}

export function trustPerson(personId: string): void {
  const ids = loadTrusted()
  if (ids.includes(personId)) return
  localStorage.setItem(TRUSTED_KEY, JSON.stringify([...ids, personId]))
}

export function isDeviceTrusted(person: Person): boolean {
  return isPersonTrusted(person.id) || person.deviceTokens.includes(getDeviceId())
}

export function rememberDevice(people: Person[], personId: string): Person[] {
  trustPerson(personId)
  const deviceId = getDeviceId()
  return people.map((person) => {
    if (person.id !== personId) return person
    if (person.deviceTokens.includes(deviceId)) return person
    return { ...person, deviceTokens: [...person.deviceTokens, deviceId] }
  })
}
