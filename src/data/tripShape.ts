import { newId } from '../ids'
import type { ShopCategory, ShopGroup, ShopItem, TripData } from '../types'

export const EMPTY_TRIP: TripData = {
  checklists: [],
  notes: [],
  shopEveryone: [],
  shopEveryoneCategories: [],
  shopPersonal: {},
  shopPersonalCategories: {},
  shopGroups: [],
  days: [],
  bookings: [],
}

export function normalizeTrip(raw: unknown): TripData {
  const parsed = (raw ?? {}) as Partial<TripData> & { shopItems?: ShopItem[] }
  return {
    checklists: parsed.checklists ?? [],
    notes: parsed.notes ?? [],
    shopEveryone: parsed.shopEveryone ?? parsed.shopItems ?? [],
    shopEveryoneCategories: parsed.shopEveryoneCategories ?? [],
    shopPersonal: parsed.shopPersonal ?? {},
    shopPersonalCategories: parsed.shopPersonalCategories ?? {},
    shopGroups: (parsed.shopGroups ?? []).map(normalizeGroup),
    days: parsed.days ?? [],
    bookings: parsed.bookings ?? [],
  }
}

export function ensureShopCategories(data: TripData): TripData {
  const everyone = migrateList(data.shopEveryone, data.shopEveryoneCategories)
  const personIds = new Set([
    ...Object.keys(data.shopPersonal),
    ...Object.keys(data.shopPersonalCategories),
  ])
  const shopPersonal: Record<string, ShopItem[]> = { ...data.shopPersonal }
  const shopPersonalCategories: Record<string, ShopCategory[]> = {
    ...data.shopPersonalCategories,
  }
  for (const personId of personIds) {
    const migrated = migrateList(
      data.shopPersonal[personId] ?? [],
      data.shopPersonalCategories[personId] ?? [],
    )
    shopPersonal[personId] = migrated.items
    shopPersonalCategories[personId] = migrated.categories
  }

  return {
    ...data,
    shopEveryone: everyone.items,
    shopEveryoneCategories: everyone.categories,
    shopPersonal,
    shopPersonalCategories,
    shopGroups: data.shopGroups.map((group) => {
      const migrated = migrateList(group.items, group.categories ?? [])
      return { ...group, items: migrated.items, categories: migrated.categories }
    }),
  }
}

export function sameTrip(left: TripData, right: TripData) {
  return JSON.stringify(left) === JSON.stringify(right)
}

function normalizeGroup(group: ShopGroup): ShopGroup {
  return {
    ...group,
    items: group.items ?? [],
    categories: group.categories ?? [],
  }
}

function migrateList(items: ShopItem[], categories: ShopCategory[]) {
  if (categories.length > 0) {
    if (!items.some((item) => !item.categoryId)) {
      return { items, categories }
    }
    const fallbackId = categories[0].id
    return {
      categories,
      items: items.map((item) => ({ ...item, categoryId: item.categoryId ?? fallbackId })),
    }
  }
  if (items.length === 0) return { items, categories }
  const food: ShopCategory = {
    id: newId(),
    title: 'Food',
    createdAt: new Date().toISOString(),
  }
  return {
    categories: [food],
    items: items.map((item) => ({ ...item, categoryId: item.categoryId ?? food.id })),
  }
}
