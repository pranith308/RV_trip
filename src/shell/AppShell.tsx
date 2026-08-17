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
  const { shopGroups } = useTripData()
  const [route, setRoute] = useState(() => parseHash(window.location.hash))
  const [composeOpen, setComposeOpen] = useState(false)

  const myGroups = shopGroups.filter(
    (group) => current && group.memberIds.includes(current.id),
  )
  const shopExtraTabs = myGroups.map((group) => ({
    id: groupSubId(group.id),
    label: group.title,
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
    }
    window.addEventListener('hashchange', onHash)
    if (!window.location.hash) {
      const initial = parseHash('')
      window.location.hash = toHash(initial.section, initial.sub)
    }
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  function go(section: SectionId, sub: string) {
    saveLastSub(section, sub)
    setComposeOpen(false)
    window.location.hash = toHash(section, sub)
  }

  function selectSection(section: SectionId) {
    const remembered = loadLastSubs()[section]
    const extraOk =
      section === 'shop' &&
      remembered &&
      shopExtraTabs.some((tab) => tab.id === remembered)
    const sub =
      remembered && (isSubOf(section, remembered) || extraOk)
        ? remembered
        : defaultSub(section)
    go(section, sub)
  }

  const sectionMeta = getSection(route.section)
  const personId = current?.id ?? ''

  return (
    <div className="shell">
      <header className="shell-header">
        <Mountains variant="strip" />
        <div className="shell-header-copy">
          <p className="shell-kicker">{sectionMeta.fullLabel}</p>
          <h1 className="shell-title">Family Expedition</h1>
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

      <main className="shell-main">
        {route.section === 'plan' && (
          <PlanSection composeOpen={composeOpen} onCloseCompose={() => setComposeOpen(false)} />
        )}
        {route.section === 'shop' && current && (
          <ShopSection sub={activeSub} personId={current.id} />
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
          <button type="button" className="create-bar is-solo" onClick={() => setComposeOpen(true)}>
            + Add day
          </button>
        )}
        {route.section === 'rv' && (
          <button type="button" className="create-bar" onClick={() => setComposeOpen(true)}>
            + Create new
          </button>
        )}
        {route.section === 'shop' && current && (
          <div className="dock-composer">
            <ShopComposer sub={activeSub} personId={personId} />
          </div>
        )}
        <BottomNav
          section={route.section}
          sub={route.section === 'shop' ? activeSub : route.sub}
          extraTabs={route.section === 'shop' ? shopExtraTabs : []}
          onSelect={(sub) => go(route.section, sub)}
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
