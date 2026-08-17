import { useCallback, useSyncExternalStore } from 'react'
import type {
  ChecklistItem,
  HowToNote,
  PlanDay,
  PlanPlace,
  ShopGroup,
  ShopItem,
  ShopScope,
  TripData,
} from '../types'
import { getSnapshot, newId, subscribe, updateTrip } from './store'

function mapList(items: ShopItem[], mapper: (items: ShopItem[]) => ShopItem[]) {
  return mapper(items)
}

function withShopItems(
  current: TripData,
  scope: ShopScope,
  mapper: (items: ShopItem[]) => ShopItem[],
): TripData {
  if (scope.kind === 'everyone') {
    return { ...current, shopEveryone: mapList(current.shopEveryone, mapper) }
  }
  if (scope.kind === 'me') {
    const list = current.shopPersonal[scope.personId] ?? []
    return {
      ...current,
      shopPersonal: {
        ...current.shopPersonal,
        [scope.personId]: mapList(list, mapper),
      },
    }
  }
  return {
    ...current,
    shopGroups: current.shopGroups.map((group) =>
      group.id === scope.groupId ? { ...group, items: mapList(group.items, mapper) } : group,
    ),
  }
}

export function itemsForScope(data: TripData, scope: ShopScope): ShopItem[] {
  if (scope.kind === 'everyone') return data.shopEveryone
  if (scope.kind === 'me') return data.shopPersonal[scope.personId] ?? []
  return data.shopGroups.find((group) => group.id === scope.groupId)?.items ?? []
}

export function useTripData() {
  const data = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)

  const addChecklist = useCallback((title: string, steps: string[]) => {
    const items: ChecklistItem[] = steps
      .map((text) => text.trim())
      .filter(Boolean)
      .map((text) => ({ id: newId(), text, done: false }))
    updateTrip((current) => ({
      ...current,
      checklists: [
        ...current.checklists,
        { id: newId(), title: title.trim(), items, createdAt: new Date().toISOString() },
      ],
    }))
  }, [])

  const toggleChecklistItem = useCallback((listId: string, itemId: string) => {
    updateTrip((current) => ({
      ...current,
      checklists: current.checklists.map((list) =>
        list.id !== listId
          ? list
          : {
              ...list,
              items: list.items.map((item) =>
                item.id === itemId ? { ...item, done: !item.done } : item,
              ),
            },
      ),
    }))
  }, [])

  const addChecklistStep = useCallback((listId: string, text: string) => {
    const trimmed = text.trim()
    if (!trimmed) return
    updateTrip((current) => ({
      ...current,
      checklists: current.checklists.map((list) =>
        list.id !== listId
          ? list
          : {
              ...list,
              items: [...list.items, { id: newId(), text: trimmed, done: false }],
            },
      ),
    }))
  }, [])

  const deleteChecklist = useCallback((listId: string) => {
    updateTrip((current) => ({
      ...current,
      checklists: current.checklists.filter((list) => list.id !== listId),
    }))
  }, [])

  const addNote = useCallback((note: Omit<HowToNote, 'id' | 'createdAt'>) => {
    updateTrip((current) => ({
      ...current,
      notes: [
        ...current.notes,
        { ...note, id: newId(), createdAt: new Date().toISOString() },
      ],
    }))
  }, [])

  const deleteNote = useCallback((noteId: string) => {
    updateTrip((current) => ({
      ...current,
      notes: current.notes.filter((note) => note.id !== noteId),
    }))
  }, [])

  const addShopItem = useCallback((scope: ShopScope, text: string) => {
    const trimmed = text.trim()
    if (!trimmed) return
    updateTrip((current) =>
      withShopItems(current, scope, (items) => [
        ...items,
        { id: newId(), text: trimmed, done: false, createdAt: new Date().toISOString() },
      ]),
    )
  }, [])

  const toggleShopItem = useCallback((scope: ShopScope, itemId: string) => {
    updateTrip((current) =>
      withShopItems(current, scope, (items) =>
        items.map((item) => (item.id === itemId ? { ...item, done: !item.done } : item)),
      ),
    )
  }, [])

  const deleteShopItem = useCallback((scope: ShopScope, itemId: string) => {
    updateTrip((current) =>
      withShopItems(current, scope, (items) => items.filter((item) => item.id !== itemId)),
    )
  }, [])

  const addGroup = useCallback((title: string, memberIds: string[]) => {
    const group: ShopGroup = {
      id: newId(),
      title: title.trim(),
      memberIds: [...new Set(memberIds)],
      items: [],
      createdAt: new Date().toISOString(),
    }
    updateTrip((current) => ({
      ...current,
      shopGroups: [...current.shopGroups, group],
    }))
    return group
  }, [])

  const addDay = useCallback((date: string) => {
    updateTrip((current) => ({
      ...current,
      days: [
        ...current.days,
        {
          id: newId(),
          title: '',
          date,
          places: [],
          createdAt: new Date().toISOString(),
        },
      ],
    }))
  }, [])

  const addPlace = useCallback((dayId: string, name: string) => {
    const trimmed = name.trim()
    if (!trimmed) return
    const place: PlanPlace = { id: newId(), name: trimmed }
    updateTrip((current) => ({
      ...current,
      days: current.days.map((day) =>
        day.id === dayId ? { ...day, places: [...day.places, place] } : day,
      ),
    }))
  }, [])

  const deleteDay = useCallback((dayId: string) => {
    updateTrip((current) => ({
      ...current,
      days: current.days.filter((day) => day.id !== dayId),
    }))
  }, [])

  const deletePlace = useCallback((dayId: string, placeId: string) => {
    updateTrip((current) => ({
      ...current,
      days: current.days.map((day) =>
        day.id !== dayId
          ? day
          : { ...day, places: day.places.filter((place) => place.id !== placeId) },
      ),
    }))
  }, [])

  return {
    ...data,
    addChecklist,
    toggleChecklistItem,
    addChecklistStep,
    deleteChecklist,
    addNote,
    deleteNote,
    addShopItem,
    toggleShopItem,
    deleteShopItem,
    addGroup,
    addDay,
    addPlace,
    deleteDay,
    deletePlace,
  }
}

export function todayInputValue() {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}

export function formatDayDate(isoDate: string) {
  if (!isoDate) return ''
  const [year, month, day] = isoDate.split('-').map(Number)
  const date = new Date(year, (month ?? 1) - 1, day ?? 1)
  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

export function sortDays(days: PlanDay[]) {
  return [...days].sort((left, right) => {
    const byDate = left.date.localeCompare(right.date)
    if (byDate !== 0) return byDate
    return left.createdAt.localeCompare(right.createdAt)
  })
}

export function parseShopScope(sub: string, personId: string): ShopScope {
  if (sub === 'me') return { kind: 'me', personId }
  if (sub.startsWith('g-')) return { kind: 'group', groupId: sub.slice(2) }
  return { kind: 'everyone' }
}

export function groupSubId(groupId: string) {
  return `g-${groupId}`
}
