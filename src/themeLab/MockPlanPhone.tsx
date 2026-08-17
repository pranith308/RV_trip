import { useState } from 'react'

const DAYS = [
  {
    id: 'today',
    label: 'Mon, Aug 17 (TODAY)',
    booking: { title: 'Yosemite Lodge', code: '#4821' },
    places: [
      { name: 'Tunnel View sunrise', note: 'Get there before the buses.' },
      { name: 'Glacier Point picnic', note: undefined },
    ],
  },
  {
    id: 'tue',
    label: 'Tue, Aug 18',
    places: [
      { name: 'Sequoia picnic', note: undefined },
      { name: 'Gas in Three Rivers', note: undefined },
    ],
  },
]

const PAPER = new Set([
  'sketch',
  'scrap',
  'atlas',
  'journal',
  'kraft',
  'sticky',
  'postcard',
  'watercolor',
  'composition',
  'logbook',
  'index',
  'margin',
  'washi',
])

type MockPlanPhoneProps = {
  theme: string
}

export function MockPlanPhone({ theme }: MockPlanPhoneProps) {
  const [open, setOpen] = useState('today')
  const [tab, setTab] = useState<'days' | 'bookings'>('days')

  return (
    <div className={`phone theme-${theme}${PAPER.has(theme) ? ' is-paper' : ''}`}>
      <header className="phone-header">
        <HeaderArt theme={theme} />
        <div className="phone-header-copy">
          <p className="phone-kicker">Family expedition</p>
          <h3>Plan</h3>
        </div>
        <span className="phone-chip">Pranith</span>
      </header>
      <nav className="phone-top">
        <span className="is-on">Plan</span>
        <span>Shopping List</span>
        <span>RV</span>
        <span>Location</span>
      </nav>
      <main className="phone-main">
        {tab === 'days' ? (
          <ol className="phone-days">
            {DAYS.map((day) => {
              const shown = open === day.id
              return (
                <li key={day.id} className={`phone-day${shown ? ' is-open' : ''}`}>
                  <button type="button" className="phone-day-head" onClick={() => setOpen(shown ? '' : day.id)}>
                    <span className="phone-caret">{shown ? '▾' : '▸'}</span>
                    <strong>{day.label}</strong>
                  </button>
                  {shown && (
                    <div className="phone-day-body">
                      {day.booking && (
                        <div className="phone-booking">
                          <span>{day.booking.title}</span>
                          <em>{day.booking.code}</em>
                        </div>
                      )}
                      <ul>
                        {day.places.map((place) => (
                          <li key={place.name} className="phone-place">
                            <span>
                              {place.name}
                              {place.note ? <small>{place.note}</small> : null}
                            </span>
                            <i aria-hidden="true">💬</i>
                          </li>
                        ))}
                      </ul>
                      <p className="phone-add-place">+ Add a place</p>
                    </div>
                  )}
                </li>
              )
            })}
          </ol>
        ) : (
          <article className="phone-booking-card">
            <h4>Yosemite Lodge</h4>
            <p>Confirmation #4821</p>
            <p>Pinned to Mon, Aug 17</p>
          </article>
        )}
      </main>
      <div className="phone-dock">
        <div className="phone-bottom">
          <button type="button" className={tab === 'days' ? 'is-on' : ''} onClick={() => setTab('days')}>
            Days
          </button>
          <button
            type="button"
            className={tab === 'bookings' ? 'is-on' : ''}
            onClick={() => setTab('bookings')}
          >
            Bookings
          </button>
        </div>
        <button type="button" className="phone-plus">
          + Add day
        </button>
      </div>
    </div>
  )
}

function HeaderArt({ theme }: { theme: string }) {
  if (theme === 'sketch') {
    return (
      <svg className="phone-art" viewBox="0 0 400 72" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <rect width="400" height="72" fill="#efe6d4" />
        <path d="M8 62 C80 20, 140 50, 210 18 S320 8, 392 40" fill="none" stroke="#2b2418" strokeWidth="2.2" />
        <path d="M20 70 C90 40, 180 66, 390 52" fill="none" stroke="#8a6a3a" strokeWidth="1.4" />
        <circle cx="70" cy="28" r="9" fill="none" stroke="#c4471a" strokeWidth="2" />
        <path d="M70 37 L70 48" stroke="#c4471a" strokeWidth="2" />
        <text x="92" y="34" fill="#2b2418" fontSize="13" fontFamily="Patrick Hand, cursive">
          go this way!!
        </text>
      </svg>
    )
  }
  if (theme === 'comic') {
    return (
      <svg className="phone-art" viewBox="0 0 400 72" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <rect width="400" height="72" fill="#ffe14a" />
        <circle cx="330" cy="18" r="16" fill="#ff7a18" />
        <path d="M0 72 L40 28 L90 50 L150 10 L220 48 L280 16 L400 44 V72 Z" fill="#1c2b22" />
        <rect x="12" y="10" width="118" height="28" fill="#fff" stroke="#111" strokeWidth="3" />
        <text x="22" y="30" fill="#111" fontSize="16" fontFamily="Bangers, cursive">
          HIT THE ROAD
        </text>
      </svg>
    )
  }
  if (theme === 'neon') {
    return (
      <svg className="phone-art" viewBox="0 0 400 72" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <rect width="400" height="72" fill="#12081c" />
        <path d="M0 48 H400" stroke="#ff3d9a" strokeWidth="2" />
        <path d="M0 56 H400" stroke="#21e6ff" strokeWidth="2" strokeDasharray="10 8" />
        <rect x="250" y="8" width="86" height="28" rx="3" fill="none" stroke="#ff3d9a" strokeWidth="2" />
        <text x="262" y="27" fill="#ff3d9a" fontSize="12" fontFamily="Oswald, sans-serif">
          OPEN 24H
        </text>
      </svg>
    )
  }
  if (theme === 'scrap') {
    return (
      <svg className="phone-art" viewBox="0 0 400 72" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <rect width="400" height="72" fill="#f7d9c4" />
        <rect x="18" y="8" width="70" height="52" fill="#fff" stroke="#333" strokeWidth="2" transform="rotate(-6 53 34)" />
        <rect x="20" y="10" width="66" height="38" fill="#7ba3b8" transform="rotate(-6 53 34)" />
        <rect x="110" y="12" width="78" height="46" fill="#fff8ea" stroke="#333" strokeWidth="2" transform="rotate(4 149 35)" />
        <text x="122" y="40" fill="#c4471a" fontSize="14" fontFamily="Caveat, cursive" transform="rotate(4 149 35)">
          day one!!
        </text>
      </svg>
    )
  }
  if (theme === 'sunny') {
    return (
      <svg className="phone-art" viewBox="0 0 400 72" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <rect width="400" height="72" fill="#7ec8ff" />
        <circle className="sun-bounce" cx="340" cy="18" r="14" fill="#ffe14a" />
        <path d="M0 72 L0 40 Q80 18 160 38 T400 28 V72 Z" fill="#7bc67e" />
        <g className="van-bounce">
          <rect x="24" y="38" width="54" height="22" rx="5" fill="#ff6b4a" stroke="#1c2b22" strokeWidth="2" />
          <rect x="48" y="42" width="22" height="12" fill="#cdefff" stroke="#1c2b22" strokeWidth="1.4" />
          <circle cx="36" cy="60" r="6" fill="#1c2b22" />
          <circle cx="66" cy="60" r="6" fill="#1c2b22" />
        </g>
      </svg>
    )
  }
  if (theme === 'atlas') {
    return (
      <svg className="phone-art" viewBox="0 0 400 72" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <rect width="400" height="72" fill="#e7f0d8" />
        <path d="M0 18 H400 M0 36 H400 M0 54 H400 M80 0 V72 M160 0 V72 M240 0 V72 M320 0 V72" stroke="#c5d4a8" strokeWidth="1" />
        <path className="dash-move" d="M10 50 C80 20, 160 60, 240 24 S360 18, 400 40" fill="none" stroke="#c4471a" strokeWidth="3" strokeDasharray="8 6" />
        <circle cx="80" cy="32" r="5" fill="#1e3d56" />
        <circle cx="240" cy="24" r="5" fill="#c4471a" />
      </svg>
    )
  }
  if (theme === 'sticker') {
    return (
      <svg className="phone-art" viewBox="0 0 400 72" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <rect width="400" height="72" fill="#2c4a3e" />
        <ellipse cx="70" cy="36" rx="54" ry="22" fill="#ffe14a" stroke="#111" strokeWidth="3" />
        <text x="34" y="42" fill="#111" fontSize="13" fontFamily="Permanent Marker, cursive">
          I ❤️ DIRT
        </text>
        <rect x="150" y="14" width="96" height="40" rx="4" fill="#ff5a36" stroke="#111" strokeWidth="3" transform="rotate(-8 198 34)" />
        <text x="162" y="40" fill="#fff" fontSize="12" fontFamily="Permanent Marker, cursive" transform="rotate(-8 198 34)">
          THIS WAY
        </text>
      </svg>
    )
  }
  if (theme === 'journal') {
    return (
      <svg className="phone-art" viewBox="0 0 400 72" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <rect width="400" height="72" fill="#f7f1e3" />
        <path d="M0 18 H400 M0 36 H400 M0 54 H400" stroke="#c9d4e2" strokeWidth="1.2" />
        <path d="M48 0 V72" stroke="#e07a6a" strokeWidth="2" />
        <text x="62" y="42" fill="#3a3224" fontSize="16" fontFamily="Architects Daughter, cursive">
          pack the cooler
        </text>
      </svg>
    )
  }
  if (theme === 'kraft') {
    return (
      <svg className="phone-art" viewBox="0 0 400 72" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <rect width="400" height="72" fill="#c4a574" />
        <ellipse cx="330" cy="28" rx="28" ry="16" fill="none" stroke="#8a6230" strokeWidth="2" opacity="0.55" />
        <ellipse cx="330" cy="28" rx="18" ry="10" fill="none" stroke="#8a6230" strokeWidth="1.4" opacity="0.4" />
        <path d="M20 50 C90 18, 170 58, 260 22 S360 48, 400 30" fill="none" stroke="#4a3720" strokeWidth="1.6" />
        <text x="24" y="38" fill="#3a2814" fontSize="15" fontFamily="Homemade Apple, cursive">
          don't forget ice
        </text>
      </svg>
    )
  }
  if (theme === 'sticky') {
    return (
      <svg className="phone-art" viewBox="0 0 400 72" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <rect width="400" height="72" fill="#c9a06a" />
        <circle cx="40" cy="18" r="3" fill="#7a5a32" />
        <circle cx="90" cy="50" r="2.5" fill="#7a5a32" />
        <circle cx="200" cy="22" r="3" fill="#7a5a32" />
        <rect x="24" y="14" width="70" height="48" fill="#fff3a0" transform="rotate(-8 59 38)" />
        <rect x="110" y="12" width="74" height="50" fill="#ffd0e0" transform="rotate(6 147 37)" />
        <text
          x="128"
          y="42"
          fill="#5a3040"
          fontSize="13"
          fontFamily="Indie Flower, cursive"
          transform="rotate(6 147 37)"
        >
          snacks!!
        </text>
      </svg>
    )
  }
  if (theme === 'postcard') {
    return (
      <svg className="phone-art" viewBox="0 0 400 72" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <rect width="400" height="72" fill="#efe4d2" />
        <path d="M0 8 H400 M0 64 H400" stroke="#c4471a" strokeWidth="3" strokeDasharray="10 7" />
        <rect x="300" y="12" width="72" height="48" fill="#f4e4c1" stroke="#8a3b2a" strokeWidth="1.6" />
        <text x="312" y="40" fill="#8a3b2a" fontSize="11" fontFamily="Caveat, cursive">
          postage
        </text>
        <text x="24" y="42" fill="#3a3224" fontSize="16" fontFamily="Indie Flower, cursive">
          wish you were here
        </text>
      </svg>
    )
  }
  if (theme === 'watercolor') {
    return (
      <svg className="phone-art" viewBox="0 0 400 72" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <rect width="400" height="72" fill="#f6f0e6" />
        <ellipse cx="70" cy="36" rx="56" ry="28" fill="#f2c6b0" opacity="0.7" />
        <ellipse cx="160" cy="40" rx="50" ry="22" fill="#b8d4c4" opacity="0.7" />
        <ellipse cx="300" cy="28" rx="60" ry="26" fill="#f0d48a" opacity="0.65" />
        <text x="28" y="44" fill="#4a3a2a" fontSize="16" fontFamily="Gloria Hallelujah, cursive">
          little trip notes
        </text>
      </svg>
    )
  }
  if (theme === 'composition') {
    return (
      <svg className="phone-art" viewBox="0 0 400 72" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <rect width="400" height="72" fill="#1c1c1c" />
        <path
          d="M0 12 C20 4, 40 20, 60 12 S100 4, 120 16 S160 6, 180 14 S220 4, 240 16 S280 8, 300 12 S340 4, 360 14 S390 8, 400 12 V0 H0 Z"
          fill="#f4f0e6"
        />
        <path
          d="M0 72 C18 64, 40 72, 62 64 S100 72, 122 64 S160 72, 182 66 S220 72, 244 64 S280 72, 304 66 S340 72, 364 64 S390 72, 400 66 V72 Z"
          fill="#f4f0e6"
        />
        <text x="28" y="44" fill="#f4f0e6" fontSize="16" fontFamily="Gochi Hand, cursive">
          subject: the trip
        </text>
      </svg>
    )
  }
  if (theme === 'logbook') {
    return (
      <svg className="phone-art" viewBox="0 0 400 72" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <rect width="400" height="72" fill="#dce8d4" />
        <path d="M0 24 H400 M0 48 H400" stroke="#b7c9ad" strokeWidth="1.2" />
        <ellipse cx="54" cy="36" rx="32" ry="18" fill="none" stroke="#c4471a" strokeWidth="2" />
        <text x="38" y="40" fill="#c4471a" fontSize="11" fontFamily="Kalam, cursive">
          DAY 1
        </text>
        <text x="100" y="42" fill="#355a3a" fontSize="15" fontFamily="Kalam, cursive">
          miles · camps · snacks
        </text>
      </svg>
    )
  }
  if (theme === 'index') {
    return (
      <svg className="phone-art" viewBox="0 0 400 72" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <rect width="400" height="72" fill="#e8dfc8" />
        <rect x="28" y="16" width="150" height="46" fill="#fffdf6" stroke="#b9a888" strokeWidth="1.4" />
        <rect x="40" y="10" width="150" height="46" fill="#fff8ea" stroke="#b9a888" strokeWidth="1.4" />
        <rect x="210" y="22" width="10" height="28" rx="2" fill="#9aa4b0" />
        <rect x="206" y="18" width="18" height="10" rx="2" fill="#c9d0d8" />
        <text x="52" y="38" fill="#3a3224" fontSize="14" fontFamily="Kalam, cursive">
          recipe for a day
        </text>
      </svg>
    )
  }
  if (theme === 'margin') {
    return (
      <svg className="phone-art" viewBox="0 0 400 72" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <rect width="400" height="72" fill="#f3efe0" />
        <path d="M0 18 H400 M0 36 H400 M0 54 H400 M80 0 V72 M160 0 V72 M240 0 V72 M320 0 V72" stroke="#d8d2bc" strokeWidth="1" />
        <path d="M18 58 C40 20, 70 50, 96 16" fill="none" stroke="#c4471a" strokeWidth="1.8" />
        <circle cx="96" cy="16" r="5" fill="none" stroke="#c4471a" strokeWidth="1.6" />
        <text x="118" y="40" fill="#5a4a32" fontSize="14" fontFamily="Patrick Hand, cursive">
          turn left after the trees
        </text>
      </svg>
    )
  }
  if (theme === 'washi') {
    return (
      <svg className="phone-art" viewBox="0 0 400 72" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <rect width="400" height="72" fill="#f6ead8" />
        <rect x="-10" y="10" width="180" height="16" fill="#f2b6c6" transform="rotate(-8 80 18)" opacity="0.9" />
        <rect x="160" y="28" width="200" height="14" fill="#a8d4c4" transform="rotate(4 260 35)" opacity="0.9" />
        <rect x="40" y="46" width="140" height="12" fill="#f0d48a" transform="rotate(-3 110 52)" />
        <text x="24" y="44" fill="#5a3a40" fontSize="16" fontFamily="Caveat, cursive">
          tape it in
        </text>
      </svg>
    )
  }
  return (
    <svg className="phone-art" viewBox="0 0 400 72" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="400" height="72" fill="#7ba3b8" />
      <circle cx="328" cy="16" r="11" fill="#e2c36a" />
      <path fill="#1e3d56" d="M0 72 L0 34 L62 14 L108 32 L162 8 L232 36 L292 16 L400 38 L400 72 Z" />
      <path fill="#2c4a3e" d="M0 72 L0 44 L78 26 L138 42 L198 30 L268 46 L348 32 L400 44 L400 72 Z" />
      <path fill="#1a3329" d="M0 72 V60 H400 V72 Z" />
    </svg>
  )
}
