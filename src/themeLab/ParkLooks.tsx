import type { ReactNode } from 'react'

const DAYS = [
  { label: 'Fri, Aug 21', Icon: TentIcon },
  { label: 'Sat, Aug 22', Icon: FireIcon },
  { label: 'Sun, Aug 23', Icon: CameraIcon },
  { label: 'Mon, Aug 24 (TODAY)', Icon: PinIcon },
  { label: 'Tue, Aug 25', Icon: TreeIcon },
]

const FOOD = ['Milk', 'Coffee', 'Tortillas', 'Ice', 'Fruit']

type ParkPairProps = {
  look: string
  wm?: string
  font?: string
}

export function ParkPair({ look, wm, font }: ParkPairProps) {
  return (
    <div className="park-pair">
      <div className="park-labeled">
        <p className="park-label">Plan</p>
        <ParkShell
          look={look}
          wm={wm}
          font={font}
          section="plan"
          add="+ Add day"
          tabs={['Days', 'Bookings']}
        >
          <ul className="park-rows">
            {DAYS.map((day) => (
              <li key={day.label} className="park-row">
                <day.Icon />
                <strong>{day.label}</strong>
                <span className="park-chev">›</span>
              </li>
            ))}
          </ul>
        </ParkShell>
      </div>
      <div className="park-labeled">
        <p className="park-label">Shopping List</p>
        <ParkShell
          look={look}
          wm={wm}
          font={font}
          section="shop"
          add="+ Add category"
          tabs={['Everyone', "Pranith's List"]}
        >
          <article className="park-cat is-open">
            <div className="park-row">
              <BasketIcon />
              <strong>Food</strong>
              <span className="park-chev">⌄</span>
            </div>
            <ul className="park-items">
              {FOOD.map((item) => (
                <li key={item}>
                  <span>{item}</span>
                  <i className="park-tick" />
                </li>
              ))}
            </ul>
          </article>
          <article className="park-cat">
            <div className="park-row">
              <PackIcon />
              <strong>Camp gear</strong>
              <span className="park-chev">›</span>
            </div>
          </article>
          <p className="park-done">Done (3)</p>
        </ParkShell>
      </div>
    </div>
  )
}

function ParkShell({
  look,
  wm,
  font,
  section,
  add,
  tabs,
  children,
}: {
  look: string
  wm?: string
  font?: string
  section: 'plan' | 'shop'
  add: string
  tabs: string[]
  children: ReactNode
}) {
  const classes = [
    'park',
    `look-${look}`,
    wm ? `wm-${wm}` : '',
    font ? `font-${font}` : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classes}>
      <header className="park-head">
        <HeadArt look={look} />
        <div className="park-chip">
          <b>P</b>
          <span>
            Pranith
            <small>Switch</small>
          </span>
        </div>
      </header>
      <nav className="park-top">
        <span className={section === 'plan' ? 'is-on' : ''}>Plan</span>
        <span className={section === 'shop' ? 'is-on' : ''}>Shopping List</span>
        <span>RV</span>
        <span>Location</span>
      </nav>
      <main className="park-main">{children}</main>
      <button type="button" className="park-add">
        {add}
      </button>
      <nav className="park-bottom">
        {tabs.map((tab, index) => (
          <span key={tab} className={index === 0 ? 'is-on' : ''}>
            {tab}
          </span>
        ))}
      </nav>
    </div>
  )
}

function HeadArt({ look }: { look: string }) {
  if (look === 'journey') {
    return (
      <svg
        className="park-art"
        viewBox="0 0 400 78"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <rect width="400" height="78" fill="#e8d5b5" />
        <g transform="rotate(-2.5 118 40)">
          <path d="M26 18 L212 15 L214 62 L28 65 Z" fill="#d9b892" />
          <path d="M26 18 L212 15 L214 62 L28 65 Z" fill="none" stroke="#c19f78" strokeWidth="0.8" />
          <text x="44" y="49" fill="#3d2c18" fontSize="24" fontFamily="Caveat, cursive">
            the journey
          </text>
        </g>
        <g opacity="0.62">
          <path d="M18 10 L74 6 L76 20 L20 24 Z" fill="#b9c9b4" transform="rotate(-7 47 15)" />
          <path d="M168 8 L226 12 L224 26 L166 22 Z" fill="#b9c9b4" transform="rotate(5 196 17)" />
        </g>
        <path
          d="M236 52 C266 34, 296 56, 330 36"
          fill="none"
          stroke="#8a6a3a"
          strokeWidth="1.1"
          strokeDasharray="3 4"
        />
        <path d="M330 32 L336 40 L328 42 Z" fill="#c4471a" />
      </svg>
    )
  }
  if (look === 'notebook') {
    return (
      <svg className="park-art" viewBox="0 0 400 78" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <rect width="400" height="78" fill="#f4ead4" />
        <path d="M18 58 C70 28, 120 48, 170 22 S260 18, 330 40 L400 52 V78 H0 Z" fill="none" stroke="#3d4a3c" strokeWidth="1.4" />
        <circle cx="318" cy="22" r="8" fill="none" stroke="#c9922a" strokeWidth="1.4" />
      </svg>
    )
  }
  if (look === 'banner') {
    return (
      <svg className="park-art" viewBox="0 0 400 78" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <rect width="400" height="78" fill="#e6eadc" />
        <path d="M0 78 V18 C40 8, 80 22, 120 12 S200 8, 240 20 S320 6, 400 16 V78 Z" fill="#2c4a3e" />
        <path d="M0 78 L0 42 L50 22 L90 38 L140 16 L200 40 L260 20 L330 36 L400 24 V78 Z" fill="#1e3d32" />
      </svg>
    )
  }
  if (look === 'topo') {
    return (
      <svg className="park-art" viewBox="0 0 400 78" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <rect width="400" height="78" fill="#eadcc0" />
        <ellipse cx="80" cy="40" rx="46" ry="22" fill="none" stroke="#cbb58a" strokeWidth="1" />
        <ellipse cx="80" cy="40" rx="28" ry="12" fill="none" stroke="#cbb58a" strokeWidth="1" />
        <ellipse cx="220" cy="36" rx="70" ry="28" fill="none" stroke="#cbb58a" strokeWidth="1" />
        <circle cx="48" cy="28" r="16" fill="none" stroke="#3d4a3c" strokeWidth="1.3" />
        <path d="M48 14 V42 M32 28 H64" stroke="#c4471a" strokeWidth="1.2" />
      </svg>
    )
  }
  if (look === 'adventure') {
    return (
      <svg className="park-art" viewBox="0 0 400 78" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <rect width="400" height="78" fill="#f6f1e4" />
        <path d="M210 44 C250 28, 290 40, 340 18" fill="none" stroke="#7ba3b8" strokeWidth="1.2" strokeDasharray="3 4" />
        <path d="M338 14 L352 22 L336 26 Z" fill="#7ba3b8" />
        <text x="28" y="48" fill="#2c4a3e" fontSize="24" fontFamily="Caveat, cursive">
          our adventure
        </text>
      </svg>
    )
  }
  return (
    <svg className="park-art" viewBox="0 0 400 78" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="400" height="78" fill="#efe4d0" />
      <rect x="160" y="4" width="80" height="14" fill="#7ba3b8" transform="rotate(-6 200 11)" opacity="0.85" />
      <path d="M24 62 C70 30, 120 50, 168 24 S250 20, 310 44" fill="none" stroke="#3d4a3c" strokeWidth="1.35" />
      <circle cx="78" cy="22" r="7" fill="none" stroke="#c9922a" strokeWidth="1.3" />
    </svg>
  )
}

function strokeIcon(path: string) {
  return (
    <svg className="park-ico" viewBox="0 0 24 24" aria-hidden="true">
      <path d={path} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function TentIcon() {
  return strokeIcon(
    'M2.5 19 H21.5 M12 5.5 L4.5 19 M12 5.5 L19.5 19 M12 11.5 L8.5 19 M12 11.5 L15.5 19',
  )
}
function FireIcon() {
  return strokeIcon(
    'M12 21 C8.4 21 6 18.4 6 15.2 C6 11.4 10 9.4 10 5 C12.8 6.8 13.2 9.4 12 11.2 C13.4 10.2 15 9 15 6.4 C17 9 18 11.6 18 15.2 C18 18.4 15.6 21 12 21 Z',
  )
}
function CameraIcon() {
  return strokeIcon('M4 8 H8 L10 6 H14 L16 8 H20 V18 H4 Z M12 10 A3 3 0 1 1 12 16 A3 3 0 1 1 12 10')
}
function PinIcon() {
  return strokeIcon('M12 21 C12 21 6 13 6 9 A6 6 0 1 1 18 9 C18 13 12 21 12 21 Z M12 9 A1.6 1.6 0 1 1 12 12.2 A1.6 1.6 0 1 1 12 9')
}
function TreeIcon() {
  return strokeIcon('M12 21 V14 M7 18 L12 8 L17 18 Z M8 13 L12 4 L16 13')
}
function BasketIcon() {
  return strokeIcon('M5 9 H19 L18 19 H6 Z M8 9 V6 H16 V9')
}
function PackIcon() {
  return strokeIcon('M7 8 H17 V19 H7 Z M10 8 V5 H14 V8 M7 12 H17')
}
