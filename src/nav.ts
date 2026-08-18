export const SECTIONS = [
  {
    id: 'plan',
    label: 'Plan',
    fullLabel: 'The Trail',
    showAdd: false,
    cornerAdd: false,
    composer: 'none',
    subs: [
      { id: 'days', label: 'Days' },
      { id: 'bookings', label: 'Bookings' },
    ],
  },
  {
    id: 'shop',
    label: 'Shopping List',
    fullLabel: 'Shopping List',
    showAdd: false,
    cornerAdd: true,
    composer: 'shop',
    subs: [
      { id: 'everyone', label: 'Everyone' },
      { id: 'me', label: "My List" },
    ],
  },
  {
    id: 'location',
    label: 'Location',
    fullLabel: 'Location',
    showAdd: false,
    cornerAdd: false,
    composer: 'none',
    subs: [] as { id: string; label: string }[],
  },
  {
    id: 'bills',
    label: 'Expenses',
    fullLabel: 'Expenses',
    showAdd: false,
    cornerAdd: false,
    composer: 'none',
    subs: [] as { id: string; label: string }[],
  },
  {
    id: 'rv',
    label: 'RV',
    fullLabel: 'The Coach',
    showAdd: false,
    cornerAdd: false,
    composer: 'none',
    subs: [
      { id: 'checklists', label: 'Checklists' },
      { id: 'notes', label: 'How-to' },
    ],
  },
] as const

export type SectionId = (typeof SECTIONS)[number]['id']

export type Route = {
  section: SectionId
  sub: string
}

const SECTION_ALIASES: Record<string, SectionId> = {
  trip: 'plan',
  together: 'location',
}

const SUB_ALIASES: Record<string, string> = {
  howto: 'notes',
}

export function isSectionId(value: string): value is SectionId {
  return SECTIONS.some((section) => section.id === value)
}

export function getSection(id: SectionId) {
  return SECTIONS.find((section) => section.id === id) ?? SECTIONS[0]
}

export function defaultSub(section: SectionId): string {
  return getSection(section).subs[0]?.id ?? ''
}

export function isSubOf(section: SectionId, sub: string): boolean {
  if (section === 'shop' && (sub === 'everyone' || sub === 'me' || sub.startsWith('g-'))) {
    return true
  }
  const subs = getSection(section).subs
  if (subs.length === 0) return sub === ''
  return subs.some((item) => item.id === sub)
}

export function parseHash(hash: string): Route {
  const raw = hash.replace(/^#\/?/, '').trim()
  const [sectionRaw = 'plan', subRaw = ''] = raw.split('/')
  const mappedSection = SECTION_ALIASES[sectionRaw] ?? sectionRaw
  const section = isSectionId(mappedSection) ? mappedSection : 'plan'
  const mappedSub = SUB_ALIASES[subRaw] ?? subRaw
  const sub = mappedSub && isSubOf(section, mappedSub) ? mappedSub : defaultSub(section)
  return { section, sub }
}

export function toHash(section: SectionId, sub: string): string {
  return sub ? `#/${section}/${sub}` : `#/${section}`
}
