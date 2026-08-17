export type Person = {
  id: string
  name: string
  pinHash: string
  deviceTokens: string[]
  createdAt: string
}

export type ChecklistItem = {
  id: string
  text: string
  done: boolean
}

export type Checklist = {
  id: string
  title: string
  items: ChecklistItem[]
  createdAt: string
  startedAt?: string
}

export type NoteImage = {
  id: string
  dataUrl: string
}

export type NoteVideo = {
  id: string
  url: string
  videoId: string
}

export type HowToNote = {
  id: string
  title: string
  notes: string
  images: NoteImage[]
  videos: NoteVideo[]
  createdAt: string
}

export type ShopItem = {
  id: string
  text: string
  done: boolean
  doneBy?: string
  createdAt: string
  categoryId?: string
}

export type ShopCategory = {
  id: string
  title: string
  createdAt: string
}

export type PlanPlace = {
  id: string
  name: string
  notes?: string
}

export type PlanDay = {
  id: string
  title: string
  date: string
  places: PlanPlace[]
  createdAt: string
}

export type Booking = {
  id: string
  title: string
  confirmation: string
  startDate: string
  endDate: string
  contact: string
  notes: string
  images: NoteImage[]
  dayIds: string[]
  createdAt: string
}

export type ShopGroup = {
  id: string
  title: string
  memberIds: string[]
  items: ShopItem[]
  categories: ShopCategory[]
  createdAt: string
}

export type ShopScope =
  | { kind: 'everyone' }
  | { kind: 'me'; personId: string }
  | { kind: 'group'; groupId: string }

export type TripData = {
  checklists: Checklist[]
  notes: HowToNote[]
  shopEveryone: ShopItem[]
  shopEveryoneCategories: ShopCategory[]
  shopPersonal: Record<string, ShopItem[]>
  shopPersonalCategories: Record<string, ShopCategory[]>
  shopGroups: ShopGroup[]
  days: PlanDay[]
  bookings: Booking[]
}
