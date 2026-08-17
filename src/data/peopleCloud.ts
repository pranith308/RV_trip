import type { Person } from '../types'
import { getSupabase } from './supabase'

type PersonRow = {
  id: string
  name: string
  pin_hash: string
  created_at: string
}

function fromRow(row: PersonRow): Person {
  return {
    id: row.id,
    name: row.name,
    pinHash: row.pin_hash,
    deviceTokens: [],
    createdAt: row.created_at,
  }
}

export async function fetchPeople(): Promise<Person[] | null> {
  const supabase = getSupabase()
  if (!supabase) return null
  const { data, error } = await supabase
    .from('people')
    .select('id, name, pin_hash, created_at')
    .order('created_at', { ascending: true })
  if (error) {
    console.error('Could not load people', error.message)
    return null
  }
  return (data as PersonRow[]).map(fromRow)
}

export async function insertPerson(person: Person) {
  const supabase = getSupabase()
  if (!supabase) return null
  const { error } = await supabase.from('people').insert({
    id: person.id,
    name: person.name,
    pin_hash: person.pinHash,
    created_at: person.createdAt,
  })
  if (error) return error.message
  return null
}

export async function uploadPeople(people: Person[]) {
  const supabase = getSupabase()
  if (!supabase || people.length === 0) return
  const { error } = await supabase.from('people').upsert(
    people.map((person) => ({
      id: person.id,
      name: person.name,
      pin_hash: person.pinHash,
      created_at: person.createdAt,
    })),
  )
  if (error) console.error('Could not upload people', error.message)
}

export function subscribePeople(onChange: (people: Person[]) => void) {
  const supabase = getSupabase()
  if (!supabase) return () => {}
  const channel = supabase
    .channel('people-rows')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'people' },
      () => {
        void fetchPeople().then((people) => {
          if (people) onChange(people)
        })
      },
    )
    .subscribe()
  return () => {
    void supabase.removeChannel(channel)
  }
}
