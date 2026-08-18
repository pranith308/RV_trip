import { useCallback, useSyncExternalStore } from 'react'
import type {
  BillExpense,
  Booking,
  ChecklistItem,
  HowToNote,
  PlacePatch,
  PlanDay,
  PlanPlace,
  PlaceDraft,
  ShopCategory,
  ShopGroup,
  ShopItem,
  ShopScope,
  TripData,
} from '../types'
import { getSnapshot, newId, subscribe, updateTrip } from './store'

function withoutDrive(place: PlanPlace): PlanPlace {
  const next = { ...place }
  delete next.driveFromPrevious
  return next
}

function withoutWeather(place: PlanPlace): PlanPlace {
  const next = { ...place }
  delete next.weather
  return next
}

function applyPlacePatch(place: PlanPlace, patch: PlacePatch, locationChanged: boolean): PlanPlace {
  const next: PlanPlace = { ...place }
  if (patch.name !== undefined) next.name = patch.name.trim()
  if (patch.notes !== undefined) next.notes = patch.notes
  if (patch.clearLocation) {
    delete next.placeId
    delete next.address
    delete next.lat
    delete next.lng
  } else {
    if (patch.placeId !== undefined) next.placeId = patch.placeId
    if (patch.address !== undefined) next.address = patch.address
    if (patch.lat !== undefined) next.lat = patch.lat
    if (patch.lng !== undefined) next.lng = patch.lng
  }
  if (patch.clearDrive || locationChanged) {
    delete next.driveFromPrevious
  } else if (patch.driveFromPrevious) {
    next.driveFromPrevious = patch.driveFromPrevious
  }
  if (locationChanged || patch.clearLocation) {
    delete next.weather
  }
  return next
}

function withShopItems(
  current: TripData,
  scope: ShopScope,
  mapper: (items: ShopItem[]) => ShopItem[],
): TripData {
  return withShopBoard(current, scope, (board) => ({
    ...board,
    items: mapper(board.items),
  }))
}

type ShopBoard = {
  items: ShopItem[]
  categories: ShopCategory[]
}

function boardForScope(data: TripData, scope: ShopScope): ShopBoard {
  if (scope.kind === 'everyone') {
    return {
      items: data.shopEveryone,
      categories: data.shopEveryoneCategories ?? [],
    }
  }
  if (scope.kind === 'me') {
    return {
      items: data.shopPersonal[scope.personId] ?? [],
      categories: data.shopPersonalCategories[scope.personId] ?? [],
    }
  }
  const group = data.shopGroups.find((item) => item.id === scope.groupId)
  return {
    items: group?.items ?? [],
    categories: group?.categories ?? [],
  }
}

function withShopBoard(
  current: TripData,
  scope: ShopScope,
  mapper: (board: ShopBoard) => ShopBoard,
): TripData {
  const next = mapper(boardForScope(current, scope))
  if (scope.kind === 'everyone') {
    return {
      ...current,
      shopEveryone: next.items,
      shopEveryoneCategories: next.categories,
    }
  }
  if (scope.kind === 'me') {
    return {
      ...current,
      shopPersonal: {
        ...current.shopPersonal,
        [scope.personId]: next.items,
      },
      shopPersonalCategories: {
        ...current.shopPersonalCategories,
        [scope.personId]: next.categories,
      },
    }
  }
  return {
    ...current,
    shopGroups: current.shopGroups.map((group) =>
      group.id === scope.groupId
        ? { ...group, items: next.items, categories: next.categories }
        : group,
    ),
  }
}

export function itemsForScope(data: TripData, scope: ShopScope): ShopItem[] {
  return boardForScope(data, scope).items
}

export function categoriesForScope(data: TripData, scope: ShopScope): ShopCategory[] {
  return sortCategories(boardForScope(data, scope).categories)
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
          : (() => {
              const items = list.items.map((item) =>
                item.id === itemId ? { ...item, done: !item.done } : item,
              )
              const hasProgress = items.some((item) => item.done)
              return {
                ...list,
                items,
                startedAt: hasProgress ? (list.startedAt ?? new Date().toISOString()) : undefined,
              }
            })(),
      ),
    }))
  }, [])

  const updateChecklist = useCallback((listId: string, title: string) => {
    const trimmed = title.trim()
    if (!trimmed) return
    updateTrip((current) => ({
      ...current,
      checklists: current.checklists.map((list) =>
        list.id === listId ? { ...list, title: trimmed } : list,
      ),
    }))
  }, [])

  const updateChecklistItem = useCallback((listId: string, itemId: string, text: string) => {
    const trimmed = text.trim()
    if (!trimmed) return
    updateTrip((current) => ({
      ...current,
      checklists: current.checklists.map((list) =>
        list.id !== listId
          ? list
          : {
              ...list,
              items: list.items.map((item) =>
                item.id === itemId ? { ...item, text: trimmed } : item,
              ),
            },
      ),
    }))
  }, [])

  const deleteChecklistItem = useCallback((listId: string, itemId: string) => {
    updateTrip((current) => ({
      ...current,
      checklists: current.checklists.map((list) => {
        if (list.id !== listId) return list
        const items = list.items.filter((item) => item.id !== itemId)
        return {
          ...list,
          items,
          startedAt: items.some((item) => item.done) ? list.startedAt : undefined,
        }
      }),
    }))
  }, [])

  const resetChecklist = useCallback((listId: string) => {
    updateTrip((current) => ({
      ...current,
      checklists: current.checklists.map((list) =>
        list.id === listId
          ? {
              ...list,
              startedAt: undefined,
              items: list.items.map((item) => ({ ...item, done: false })),
            }
          : list,
      ),
    }))
  }, [])

  const resetExpiredChecklists = useCallback((now = Date.now()) => {
    updateTrip((current) => ({
      ...current,
      checklists: current.checklists.map((list) => {
        const hasPartialProgress =
          list.items.some((item) => item.done) && list.items.some((item) => !item.done)
        const started = list.startedAt ? Date.parse(list.startedAt) : Number.NaN
        if (!hasPartialProgress || (Number.isFinite(started) && now - started < 15 * 60_000)) {
          return list
        }
        return {
          ...list,
          startedAt: undefined,
          items: list.items.map((item) => ({ ...item, done: false })),
        }
      }),
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

  const updateNote = useCallback(
    (noteId: string, patch: Omit<HowToNote, 'id' | 'createdAt'>) => {
      updateTrip((current) => ({
        ...current,
        notes: current.notes.map((note) =>
          note.id === noteId ? { ...note, ...patch } : note,
        ),
      }))
    },
    [],
  )

  const deleteNote = useCallback((noteId: string) => {
    updateTrip((current) => ({
      ...current,
      notes: current.notes.filter((note) => note.id !== noteId),
    }))
  }, [])

  const addShopItem = useCallback((scope: ShopScope, text: string, categoryId: string) => {
    const trimmed = text.trim()
    if (!trimmed || !categoryId) return
    updateTrip((current) =>
      withShopItems(current, scope, (items) => [
        {
          id: newId(),
          text: trimmed,
          done: false,
          createdAt: new Date().toISOString(),
          categoryId,
        },
        ...items,
      ]),
    )
  }, [])

  const addShopCategory = useCallback((scope: ShopScope, title: string) => {
    const trimmed = title.trim()
    if (!trimmed) return null
    const category: ShopCategory = {
      id: newId(),
      title: trimmed,
      createdAt: new Date().toISOString(),
    }
    updateTrip((current) =>
      withShopBoard(current, scope, (board) => ({
        ...board,
        categories: [...board.categories, category],
      })),
    )
    return category
  }, [])

  const deleteShopCategory = useCallback((scope: ShopScope, categoryId: string) => {
    updateTrip((current) =>
      withShopBoard(current, scope, (board) => ({
        categories: board.categories.filter((category) => category.id !== categoryId),
        items: board.items.filter((item) => item.categoryId !== categoryId),
      })),
    )
  }, [])

  const toggleShopItem = useCallback((scope: ShopScope, itemId: string, doneBy?: string) => {
    updateTrip((current) =>
      withShopItems(current, scope, (items) =>
        items.map((item) => {
          if (item.id !== itemId) return item
          if (item.done) return { ...item, done: false, doneBy: undefined }
          return { ...item, done: true, doneBy: doneBy?.trim() || undefined }
        }),
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
      categories: [],
      createdAt: new Date().toISOString(),
    }
    updateTrip((current) => ({
      ...current,
      shopGroups: [...current.shopGroups, group],
    }))
    return group
  }, [])

  const deleteGroup = useCallback((groupId: string) => {
    updateTrip((current) => ({
      ...current,
      shopGroups: current.shopGroups.filter((group) => group.id !== groupId),
    }))
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

  const addPlace = useCallback((dayId: string, draft: PlaceDraft) => {
    const trimmed = draft.name.trim()
    if (!trimmed) return
    const place: PlanPlace = {
      id: newId(),
      name: trimmed,
      ...(draft.notes ? { notes: draft.notes } : {}),
      ...(draft.placeId ? { placeId: draft.placeId } : {}),
      ...(draft.address ? { address: draft.address } : {}),
      ...(typeof draft.lat === 'number' ? { lat: draft.lat } : {}),
      ...(typeof draft.lng === 'number' ? { lng: draft.lng } : {}),
    }
    updateTrip((current) => ({
      ...current,
      days: current.days.map((day) =>
        day.id === dayId ? { ...day, places: [...day.places, place] } : day,
      ),
    }))
  }, [])

  const addBooking = useCallback((draft: Omit<Booking, 'id' | 'createdAt'>) => {
    if (!draft.title.trim() || (draft.dayIds ?? []).length === 0) return
    updateTrip((current) => ({
      ...current,
      bookings: [
        ...(current.bookings ?? []),
        { ...draft, id: newId(), createdAt: new Date().toISOString() },
      ],
    }))
  }, [])

  const updateBooking = useCallback(
    (bookingId: string, patch: Omit<Booking, 'id' | 'createdAt'>) => {
      if (!patch.title.trim() || (patch.dayIds ?? []).length === 0) return
      updateTrip((current) => ({
        ...current,
        bookings: (current.bookings ?? []).map((booking) =>
          booking.id === bookingId ? { ...booking, ...patch } : booking,
        ),
      }))
    },
    [],
  )

  const toggleBookingDay = useCallback((bookingId: string, dayId: string) => {
    updateTrip((current) => ({
      ...current,
      bookings: (current.bookings ?? []).map((booking) => {
        if (booking.id !== bookingId) return booking
        const ids = booking.dayIds ?? []
        const pinned = ids.includes(dayId)
        if (pinned && ids.length <= 1) return booking
        return {
          ...booking,
          dayIds: pinned ? ids.filter((id) => id !== dayId) : [...ids, dayId],
        }
      }),
    }))
  }, [])

  const deleteBooking = useCallback((bookingId: string) => {
    updateTrip((current) => ({
      ...current,
      bookings: (current.bookings ?? []).filter((booking) => booking.id !== bookingId),
    }))
  }, [])

  const deleteDay = useCallback((dayId: string) => {
    updateTrip((current) => ({
      ...current,
      days: current.days.filter((day) => day.id !== dayId),
      bookings: (current.bookings ?? []).map((booking) => ({
        ...booking,
        dayIds: (booking.dayIds ?? []).filter((id) => id !== dayId),
      })),
    }))
  }, [])

  const updatePlace = useCallback((dayId: string, placeId: string, patch: PlacePatch) => {
    if (patch.name !== undefined && !patch.name.trim()) return
    updateTrip((current) => ({
      ...current,
      days: current.days.map((day) => {
        if (day.id !== dayId) return day
        const currentPlace = day.places.find((place) => place.id === placeId)
        if (!currentPlace) return day
        const locationChanged =
          Boolean(patch.clearLocation) ||
          (patch.placeId !== undefined && patch.placeId !== currentPlace.placeId) ||
          (patch.lat !== undefined && patch.lat !== currentPlace.lat) ||
          (patch.lng !== undefined && patch.lng !== currentPlace.lng)

        return {
          ...day,
          places: day.places.map((place, index) => {
            if (place.id === placeId) {
              return applyPlacePatch(place, patch, locationChanged)
            }
            if (locationChanged && index > 0 && day.places[index - 1]?.id === placeId) {
              return withoutDrive(place)
            }
            return place
          }),
        }
      }),
    }))
  }, [])

  const setPlaceDrives = useCallback(
    (dayId: string, drives: Record<string, PlanPlace['driveFromPrevious'] | null>) => {
      updateTrip((current) => ({
        ...current,
        days: current.days.map((day) => {
          if (day.id !== dayId) return day
          return {
            ...day,
            places: day.places.map((place) => {
              if (!(place.id in drives)) return place
              const leg = drives[place.id]
              return leg ? { ...place, driveFromPrevious: leg } : withoutDrive(place)
            }),
          }
        }),
      }))
    },
    [],
  )

  const setPlaceWeather = useCallback(
    (dayId: string, weather: Record<string, PlanPlace['weather'] | null>) => {
      updateTrip((current) => ({
        ...current,
        days: current.days.map((day) => {
          if (day.id !== dayId) return day
          return {
            ...day,
            places: day.places.map((place) => {
              if (!(place.id in weather)) return place
              const snapshot = weather[place.id]
              return snapshot ? { ...place, weather: snapshot } : withoutWeather(place)
            }),
          }
        }),
      }))
    },
    [],
  )

  const movePlace = useCallback(
    (dayId: string, placeId: string, direction: 'up' | 'down') => {
      updateTrip((current) => ({
        ...current,
        days: current.days.map((day) => {
          if (day.id !== dayId) return day
          const index = day.places.findIndex((place) => place.id === placeId)
          const nextIndex = direction === 'up' ? index - 1 : index + 1
          if (index < 0 || nextIndex < 0 || nextIndex >= day.places.length) return day
          const places = [...day.places]
          const [place] = places.splice(index, 1)
          places.splice(nextIndex, 0, place)
          return { ...day, places }
        }),
      }))
    },
    [],
  )

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

  const addBill = useCallback((bill: Omit<BillExpense, 'id' | 'createdAt'>) => {
    updateTrip((current) => ({
      ...current,
      bills: [
        {
          ...bill,
          id: newId(),
          createdAt: new Date().toISOString(),
        },
        ...(current.bills ?? []),
      ],
    }))
  }, [])

  const deleteBill = useCallback((billId: string) => {
    updateTrip((current) => ({
      ...current,
      bills: (current.bills ?? []).filter((bill) => bill.id !== billId),
    }))
  }, [])

  return {
    ...data,
    addChecklist,
    toggleChecklistItem,
    updateChecklist,
    updateChecklistItem,
    deleteChecklistItem,
    resetChecklist,
    resetExpiredChecklists,
    addChecklistStep,
    deleteChecklist,
    addNote,
    updateNote,
    deleteNote,
    addShopItem,
    addShopCategory,
    deleteShopCategory,
    toggleShopItem,
    deleteShopItem,
    addGroup,
    deleteGroup,
    addDay,
    addPlace,
    updatePlace,
    setPlaceDrives,
    setPlaceWeather,
    movePlace,
    addBooking,
    updateBooking,
    toggleBookingDay,
    deleteBooking,
    deleteDay,
    deletePlace,
    addBill,
    deleteBill,
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
  const label = date.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
  return isoDate === todayInputValue() ? `${label} (TODAY)` : label
}

export function sortDays(days: PlanDay[]) {
  return [...days].sort((left, right) => {
    const byDate = left.date.localeCompare(right.date)
    if (byDate !== 0) return byDate
    return left.createdAt.localeCompare(right.createdAt)
  })
}

export function formatShortDate(isoDate: string) {
  if (!isoDate) return ''
  const [year, month, day] = isoDate.split('-').map(Number)
  const date = new Date(year, (month ?? 1) - 1, day ?? 1)
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  })
}

export function formatDateRange(startDate: string, endDate: string) {
  if (startDate && endDate && startDate !== endDate) {
    return `${formatShortDate(startDate)} – ${formatShortDate(endDate)}`
  }
  return formatShortDate(startDate || endDate)
}

export function bookingDayDates(booking: Booking, days: PlanDay[]) {
  const ids = new Set(booking.dayIds ?? [])
  return sortDays(days.filter((day) => ids.has(day.id))).map((day) => day.date)
}

export function formatBookingDays(booking: Booking, days: PlanDay[]) {
  const dates = bookingDayDates(booking, days)
  if (dates.length === 0) return formatDateRange(booking.startDate, booking.endDate)
  if (dates.length === 1) return formatShortDate(dates[0])
  if (dates.length === 2) return `${formatShortDate(dates[0])} · ${formatShortDate(dates[1])}`
  return `${formatShortDate(dates[0])} – ${formatShortDate(dates[dates.length - 1])}`
}

export function sortBookings(bookings: Booking[], days: PlanDay[] = []) {
  return [...bookings].sort((left, right) => {
    const leftDate = bookingDayDates(left, days)[0] || left.startDate || '9999'
    const rightDate = bookingDayDates(right, days)[0] || right.startDate || '9999'
    const byDate = leftDate.localeCompare(rightDate)
    if (byDate !== 0) return byDate
    return left.createdAt.localeCompare(right.createdAt)
  })
}

export function sortCategories(categories: ShopCategory[]) {
  return [...categories].sort((left, right) => left.createdAt.localeCompare(right.createdAt))
}

export function parseShopScope(sub: string, personId: string): ShopScope {
  if (sub === 'me') return { kind: 'me', personId }
  if (sub.startsWith('g-')) return { kind: 'group', groupId: sub.slice(2) }
  return { kind: 'everyone' }
}

export function groupSubId(groupId: string) {
  return `g-${groupId}`
}
