import { useEffect, useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import { Mountains } from '../components/Mountains'
import {
  defaultSub,
  getSection,
  isSubOf,
  parseHash,
  toHash,
  type SectionId,
} from '../nav'
import { groupSubId, useTripData } from '../data/trip'
import { LocationSection } from '../sections/LocationSection'
import { PlanSection } from '../sections/PlanSection'
import { RvSection } from '../sections/RvSection'
import { AddGroupSheet } from '../sections/AddGroupSheet'
import { ShopComposer } from '../sections/ShopComposer'
import { ShopSection } from '../sections/ShopSection'
import { BottomNav } from './BottomNav'
import { TopNav } from './TopNav'

const LAST_SUB_KEY = 'expedition.lastSubs'

function loadLastSubs(): Partial<Record<SectionId, string>> {
  try {
    return JSON.parse(localStorage.getItem(LAST_SUB_KEY) ?? '{}') as Partial<
      Record<SectionId, string>
    >
  } catch {
    return {}
  }
}

function saveLastSub(section: SectionId, sub: string) {
  const current = loadLastSubs()
  localStorage.setItem(LAST_SUB_KEY, JSON.stringify({ ...current, [section]: sub }))
}

export function AppShell() {
  const { current, switchTraveler } = useAuth()
  const { shopGroups, deleteGroup, checklists, resetExpiredChecklists } = useTripData()
  const [route, setRoute] = useState(() => parseHash(window.location.hash))
  const [composeOpen, setComposeOpen] = useState(false)
  const [openShopCategoryId, setOpenShopCategoryId] = useState<string | null>(null)
  const [shopCategoryOpen, setShopCategoryOpen] = useState(false)

  const myGroups = shopGroups.filter(
    (group) => current && group.memberIds.includes(current.id),
  )
  const shopExtraTabs = myGroups.map((group) => ({
    id: groupSubId(group.id),
    label: group.title,
    deletable: true,
  }))
  const activeSub =
    route.section === 'shop' &&
    route.sub.startsWith('g-') &&
    !shopExtraTabs.some((tab) => tab.id === route.sub)
      ? 'everyone'
      : route.sub

  useEffect(() => {
    function onHash() {
      setRoute(parseHash(window.location.hash))
      setComposeOpen(false)
      setShopCategoryOpen(false)
    }
    window.addEventListener('hashchange', onHash)
    if (!window.location.hash) {
      const initial = parseHash('')
      window.location.hash = toHash(initial.section, initial.sub)
    }
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  useEffect(() => {
    setOpenShopCategoryId(null)
    setShopCategoryOpen(false)
  }, [activeSub])

  useEffect(() => {
    const deadlines = checklists
      .filter(
        (list) =>
          list.items.some((item) => item.done) && list.items.some((item) => !item.done),
      )
      .map((list) => {
        const started = list.startedAt ? Date.parse(list.startedAt) : Number.NaN
        return Number.isFinite(started) ? started + 15 * 60_000 : Date.now()
      })
    if (deadlines.length === 0) return

    const delay = Math.max(0, Math.min(...deadlines) - Date.now())
    const timer = window.setTimeout(
      () => resetExpiredChecklists(),
      Math.min(delay + 50, 2_147_483_647),
    )
    return () => window.clearTimeout(timer)
  }, [checklists, resetExpiredChecklists])

  function go(section: SectionId, sub: string) {
    saveLastSub(section, sub)
    setComposeOpen(false)
    window.location.hash = toHash(section, sub)
  }

  function selectSection(section: SectionId) {
    if (section === 'shop') {
      go('shop', 'everyone')
      return
    }
    if (section === 'plan') {
      go('plan', 'days')
      return
    }
    const remembered = loadLastSubs()[section]
    const sub =
      remembered && isSubOf(section, remembered) ? remembered : defaultSub(section)
    go(section, sub)
  }

  const sectionMeta = getSection(route.section)
  const personId = current?.id ?? ''

  return (
    <div className="shell">
      <header className="shell-header">
        <Mountains variant="strip" scene={route.section} />
        <div className="shell-header-copy">
          <h1 className="shell-title">{sectionMeta.label}</h1>
        </div>
        {current && (
          <button
            type="button"
            className="traveler-chip"
            onClick={switchTraveler}
            title="Switch traveler"
          >
            <span className="traveler-mark">{current.name.slice(0, 1)}</span>
            <span className="traveler-meta">
              <span className="traveler-name">{current.name}</span>
              <span className="traveler-hint">Switch</span>
            </span>
          </button>
        )}
      </header>

      <TopNav section={route.section} onSelect={selectSection} />

      <main className="shell-main" data-section={route.section}>
        {route.section === 'plan' && (
          <PlanSection
            sub={route.sub}
            composeOpen={composeOpen}
            onCloseCompose={() => setComposeOpen(false)}
          />
        )}
        {route.section === 'shop' && current && (
          <ShopSection
            sub={activeSub}
            personId={current.id}
            openCategoryId={openShopCategoryId}
            onOpenCategory={setOpenShopCategoryId}
            categoryComposeOpen={shopCategoryOpen}
            onCloseCategoryCompose={() => setShopCategoryOpen(false)}
          />
        )}
        {route.section === 'rv' && (
          <RvSection
            sub={route.sub}
            composeOpen={composeOpen}
            onCloseCompose={() => setComposeOpen(false)}
          />
        )}
        {route.section === 'location' && <LocationSection />}
      </main>

      <div className="dock">
        {route.section === 'plan' && (
          <button type="button" className="create-bar" onClick={() => setComposeOpen(true)}>
            {route.sub === 'bookings' ? '+ Add booking' : '+ Add day'}
          </button>
        )}
        {route.section === 'rv' && (
          <button type="button" className="create-bar" onClick={() => setComposeOpen(true)}>
            + Create new
          </button>
        )}
        {route.section === 'shop' && current && (
          <>
            <div className="dock-composer">
              <ShopComposer
                sub={activeSub}
                personId={personId}
                categoryId={openShopCategoryId}
              />
            </div>
            <button
              type="button"
              className="create-bar"
              onClick={() => setShopCategoryOpen(true)}
            >
              + Add category
            </button>
          </>
        )}
        <BottomNav
          section={route.section}
          sub={route.section === 'shop' ? activeSub : route.sub}
          extraTabs={route.section === 'shop' ? shopExtraTabs : []}
          tabLabels={
            current ? { me: `${current.name}'s List` } : undefined
          }
          onSelect={(sub) => go(route.section, sub)}
          onDeleteTab={(sub) => {
            if (!sub.startsWith('g-')) return
            deleteGroup(sub.slice(2))
            if (activeSub === sub) go('shop', 'everyone')
          }}
          onCornerAdd={() => setComposeOpen(true)}
        />
      </div>

      {route.section === 'shop' && composeOpen && current && (
        <AddGroupSheet
          onClose={() => setComposeOpen(false)}
          onCreated={(groupId) => go('shop', groupSubId(groupId))}
        />
      )}
    </div>
  )
}
