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
  createdAt: string
}

export type PlanPlace = {
  id: string
  name: string
}

export type PlanDay = {
  id: string
  title: string
  date: string
  places: PlanPlace[]
  createdAt: string
}

export type ShopGroup = {
  id: string
  title: string
  memberIds: string[]
  items: ShopItem[]
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
  shopPersonal: Record<string, ShopItem[]>
  shopGroups: ShopGroup[]
  days: PlanDay[]
}
