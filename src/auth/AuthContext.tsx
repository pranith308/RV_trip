import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Person } from '../types'
import { newId } from '../ids'
import { fetchPeople, insertPerson, subscribePeople, uploadPeople } from '../data/peopleCloud'
import { isCloudConfigured } from '../data/supabase'
import {
  getDeviceId,
  hashPin,
  isDeviceTrusted,
  loadPeople,
  loadSessionPersonId,
  rememberDevice,
  savePeople,
  saveSessionPersonId,
  trustPerson,
} from './storage'

type AuthContextValue = {
  ready: boolean
  cloud: boolean
  error: string | null
  people: Person[]
  current: Person | null
  createPerson: (name: string, pin: string) => Promise<string | null>
  unlock: (personId: string, pin: string) => Promise<boolean>
  enterIfTrusted: (personId: string) => boolean
  isTrusted: (personId: string) => boolean
  switchTraveler: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function restoreCurrent(people: Person[]): Person | null {
  const sessionId = loadSessionPersonId()
  if (!sessionId) return null
  const person = people.find((item) => item.id === sessionId)
  if (!person || !isDeviceTrusted(person)) return null
  return person
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(!isCloudConfigured())
  const [error, setError] = useState<string | null>(null)
  const [people, setPeople] = useState<Person[]>(() => loadPeople())
  const [current, setCurrent] = useState<Person | null>(() =>
    restoreCurrent(loadPeople()),
  )

  const persist = useCallback((nextPeople: Person[], nextCurrent: Person | null) => {
    setPeople(nextPeople)
    setCurrent(nextCurrent)
    savePeople(nextPeople)
    saveSessionPersonId(nextCurrent?.id ?? null)
  }, [])

  useEffect(() => {
    let stop = () => {}
    async function boot() {
      if (!isCloudConfigured()) {
        setReady(true)
        return
      }
      const cloudPeople = await fetchPeople()
      if (cloudPeople === null) {
        setError('Could not reach the shared trip. Check your connection and try again.')
        setReady(true)
        return
      }
      const localPeople = loadPeople()
      if (cloudPeople.length === 0 && localPeople.length > 0) {
        await uploadPeople(localPeople)
        persist(localPeople, restoreCurrent(localPeople))
      } else {
        persist(cloudPeople, restoreCurrent(cloudPeople))
      }
      stop = subscribePeople((next) => {
        setPeople(next)
        savePeople(next)
        setCurrent((who) => (who ? (next.find((person) => person.id === who.id) ?? who) : who))
      })
      setReady(true)
    }
    void boot()
    return () => stop()
  }, [persist])

  const createPerson = useCallback(
    async (name: string, pin: string) => {
      const trimmed = name.trim()
      if (!trimmed) return 'Please enter a name.'
      if (!/^\d{4}$/.test(pin)) return 'PIN must be 4 digits.'
      const taken = people.some(
        (person) => person.name.toLowerCase() === trimmed.toLowerCase(),
      )
      if (taken) return 'That name is already on the trail.'

      const id = newId()
      const person: Person = {
        id,
        name: trimmed,
        pinHash: await hashPin(id, pin),
        deviceTokens: [getDeviceId()],
        createdAt: new Date().toISOString(),
      }
      const cloudError = await insertPerson(person)
      if (cloudError) return 'Could not save that traveler. Try again.'
      trustPerson(id)
      persist([...people, person], person)
      return null
    },
    [people, persist],
  )

  const unlock = useCallback(
    async (personId: string, pin: string) => {
      const person = people.find((item) => item.id === personId)
      if (!person) return false
      const pinHash = await hashPin(personId, pin)
      if (pinHash !== person.pinHash) return false
      const nextPeople = rememberDevice(people, personId)
      const nextCurrent = nextPeople.find((item) => item.id === personId) ?? person
      persist(nextPeople, nextCurrent)
      return true
    },
    [people, persist],
  )

  const enterIfTrusted = useCallback(
    (personId: string) => {
      const person = people.find((item) => item.id === personId)
      if (!person || !isDeviceTrusted(person)) return false
      persist(people, person)
      return true
    },
    [people, persist],
  )

  const isTrusted = useCallback(
    (personId: string) => {
      const person = people.find((item) => item.id === personId)
      return person ? isDeviceTrusted(person) : false
    },
    [people],
  )

  const switchTraveler = useCallback(() => {
    saveSessionPersonId(null)
    setCurrent(null)
  }, [])

  const value = useMemo(
    () => ({
      ready,
      cloud: isCloudConfigured(),
      error,
      people,
      current,
      createPerson,
      unlock,
      enterIfTrusted,
      isTrusted,
      switchTraveler,
    }),
    [ready, error, people, current, createPerson, unlock, enterIfTrusted, isTrusted, switchTraveler],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth must be used inside AuthProvider')
  return value
}
