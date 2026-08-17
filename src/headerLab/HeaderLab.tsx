import { useState, type ReactNode } from 'react'
import { OPTIONS, type TabId } from './scenes'

const TABS: { id: TabId; title: string }[] = [
  { id: 'plan', title: 'Plan' },
  { id: 'shop', title: 'Shopping List' },
  { id: 'rv', title: 'RV' },
  { id: 'location', title: 'Location' },
]

const KEY = 'expedition.headerPicks'

type Picks = Partial<Record<TabId, string>>

function loadPicks(): Picks {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '{}') as Picks
  } catch {
    return {}
  }
}

export function HeaderLab() {
  const [picks, setPicks] = useState<Picks>(loadPicks)

  function choose(tab: TabId, optionId: string) {
    const next = { ...picks, [tab]: optionId }
    setPicks(next)
    localStorage.setItem(KEY, JSON.stringify(next))
  }

  return (
    <div className="lab-page">
      <header className="lab-intro">
        <p className="lab-kicker">Local only · not on the family site</p>
        <h1>Header scenes</h1>
        <p>
          Tap a card to mark your favorite for each tab. Tell me the names you like, for example
          “Plan: Compass trail, Shop: Market crates.”
        </p>
      </header>
      {TABS.map((tab) => (
        <section key={tab.id} className="lab-section">
          <h2>{tab.title}</h2>
          <div className="lab-grid">
            {OPTIONS[tab.id].map((option) => {
              const selected = (picks[tab.id] ?? OPTIONS[tab.id][0].id) === option.id
              return (
                <button
                  key={option.id}
                  type="button"
                  className={`lab-card${selected ? ' is-picked' : ''}`}
                  onClick={() => choose(tab.id, option.id)}
                >
                  <Banner title={tab.title}>
                    <option.Art />
                  </Banner>
                  <span className="lab-name">{option.name}</span>
                  <span className="lab-note">{option.note}</span>
                </button>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}

function Banner({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="lab-banner">
      <svg
        className="mountains mountains-strip"
        viewBox="0 0 400 72"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <rect width="400" height="72" fill="#7ba3b8" />
        <circle className="header-sun" cx="328" cy="16" r="11" fill="#e2c36a" />
        <path
          fill="#1e3d56"
          d="M0 72 L0 34 L62 14 L108 32 L162 8 L232 36 L292 16 L400 38 L400 72 Z"
        />
        <path
          fill="#2c4a3e"
          d="M0 72 L0 44 L78 26 L138 42 L198 30 L268 46 L348 32 L400 44 L400 72 Z"
        />
        <path fill="#1a3329" d="M0 72 V60 H400 V72 Z" />
        {children}
      </svg>
      <div className="shell-header-copy">
        <h1 className="shell-title">{title}</h1>
      </div>
      <div className="lab-fake-chip">P</div>
    </div>
  )
}
