import type { ReactNode } from 'react'

export type TabId = 'plan' | 'shop' | 'rv' | 'location'

export type HeaderOption = {
  id: string
  name: string
  note: string
  Art: () => ReactNode
}

function Pin({ className }: { className: string }) {
  return (
    <g className={className}>
      <path
        d="M0 10 C0 10 7 -1 7 -6 C7 -10 4 -13 0 -13 C-4 -13 -7 -10 -7 -6 C-7 -1 0 10 0 10 Z"
        fill="#c4471a"
        stroke="#1c2b22"
        strokeWidth="1.2"
      />
      <circle cx="0" cy="-6.5" r="2.4" fill="#fbf6e8" />
    </g>
  )
}

function Person({ fill }: { fill: string }) {
  return (
    <g>
      <circle cx="0" cy="-11" r="5.5" fill="#f4e4c1" stroke="#1c2b22" strokeWidth="1.2" />
      <path
        d="M-8 0 C-8 -6, 8 -6, 8 0 L10 16 L-10 16 Z"
        fill={fill}
        stroke="#1c2b22"
        strokeWidth="1.2"
      />
    </g>
  )
}

function PlanMapPins() {
  return (
    <g>
      <g transform="translate(10 6) rotate(-6)">
        <rect x="0" y="0" width="168" height="50" rx="3" fill="#f4e4c1" stroke="#1c2b22" strokeWidth="1.6" />
        <path
          d="M18 36 C40 28, 52 14, 78 18 S120 38, 150 16"
          fill="none"
          stroke="#c4471a"
          strokeWidth="1.6"
          strokeDasharray="3 3"
        />
      </g>
      <g transform="translate(44 26)">
        <Pin className="header-pin is-a" />
      </g>
      <g transform="translate(98 20)">
        <Pin className="header-pin is-b" />
      </g>
      <g transform="translate(150 28)">
        <Pin className="header-pin is-c" />
      </g>
    </g>
  )
}

function PlanCompass() {
  return (
    <g>
      <path
        d="M16 52 C40 40, 70 28, 110 34 S160 50, 188 30"
        fill="none"
        stroke="#f4e4c1"
        strokeWidth="2"
        strokeDasharray="4 4"
      />
      <g className="lab-spin-slow">
        <g transform="translate(48 28)">
        <circle r="18" fill="#fbf6e8" stroke="#1c2b22" strokeWidth="1.6" />
        <path d="M0 -14 L5 0 L0 14 L-5 0 Z" fill="#c4471a" />
        <path d="M-14 0 L0 5 L14 0 L0 -5 Z" fill="#1e3d56" />
        <circle r="3" fill="#f4e4c1" stroke="#1c2b22" strokeWidth="1" />
        </g>
      </g>
      <g transform="translate(128 40)">
        <ellipse cx="0" cy="6" rx="10" ry="5" fill="#1a3329" />
        <path d="M-8 4 C-2 -8, 8 -8, 10 6" fill="#c4471a" stroke="#1c2b22" strokeWidth="1.2" />
      </g>
      <g transform="translate(158 38)">
        <ellipse cx="0" cy="6" rx="10" ry="5" fill="#1a3329" />
        <path d="M-8 4 C-2 -8, 8 -8, 10 6" fill="#1e3d56" stroke="#1c2b22" strokeWidth="1.2" />
      </g>
    </g>
  )
}

function PlanBinoculars() {
  return (
    <g>
      <g className="header-float">
        <g transform="translate(18 16)">
        <rect x="0" y="8" width="28" height="22" rx="10" fill="#1e3d56" stroke="#1c2b22" strokeWidth="1.5" />
        <rect x="32" y="8" width="28" height="22" rx="10" fill="#1e3d56" stroke="#1c2b22" strokeWidth="1.5" />
        <rect x="22" y="14" width="16" height="8" fill="#c4471a" stroke="#1c2b22" strokeWidth="1.2" />
        <circle cx="14" cy="19" r="6" fill="#7ba3b8" />
        <circle cx="46" cy="19" r="6" fill="#7ba3b8" />
        </g>
      </g>
      <g transform="translate(100 18)">
        <Pin className="header-pin is-a" />
      </g>
      <g transform="translate(128 26)">
        <Pin className="header-pin is-b" />
      </g>
      <path d="M92 8 Q 110 0, 128 10" fill="none" stroke="#f0d48a" strokeWidth="1.4" />
    </g>
  )
}

function PlanConvoy() {
  return (
    <g>
      <path d="M8 48 H190" stroke="#c9922a" strokeWidth="6" />
      <path d="M8 48 H190" stroke="#1c2b22" strokeWidth="1.4" strokeDasharray="6 6" />
      <g className="header-rv">
        <g transform="translate(14 28)">
          <rect x="0" y="8" width="34" height="14" rx="2" fill="#c4471a" stroke="#1c2b22" strokeWidth="1.3" />
          <rect x="22" y="10" width="10" height="6" fill="#7ba3b8" />
          <circle className="header-wheel" cx="8" cy="24" r="4" fill="#1c2b22" />
          <circle className="header-wheel" cx="24" cy="24" r="4" fill="#1c2b22" />
        </g>
        <g transform="translate(62 26)">
          <rect x="18" y="6" width="48" height="16" rx="2" fill="#2c4a3e" stroke="#1c2b22" strokeWidth="1.3" />
          <rect x="0" y="12" width="20" height="12" rx="2" fill="#2c4a3e" stroke="#1c2b22" strokeWidth="1.3" />
          <circle className="header-wheel" cx="10" cy="26" r="4" fill="#1c2b22" />
          <circle className="header-wheel" cx="36" cy="26" r="4" fill="#1c2b22" />
          <circle className="header-wheel" cx="56" cy="26" r="4" fill="#1c2b22" />
        </g>
      </g>
    </g>
  )
}

function ShopCart() {
  return (
    <g>
      <g className="header-float is-a">
        <g transform="translate(8 14)">
          <ellipse cx="8" cy="16" rx="7" ry="9" fill="#e2c36a" stroke="#1c2b22" strokeWidth="1.2" />
        </g>
      </g>
      <g className="header-float is-b">
        <g transform="translate(28 8)">
          <circle cx="8" cy="10" r="8" fill="#c4471a" stroke="#1c2b22" strokeWidth="1.2" />
        </g>
      </g>
      <g transform="translate(48 22)">
        <rect x="0" y="8" width="22" height="16" rx="1" fill="#c9922a" stroke="#1c2b22" strokeWidth="1.3" />
        <path d="M4 8 C4 2, 18 2, 18 8" fill="none" stroke="#1c2b22" strokeWidth="1.5" />
      </g>
      <g className="header-cart">
        <g transform="translate(78 24)">
          <rect x="16" y="6" width="56" height="22" rx="2" fill="#fbf6e8" stroke="#1c2b22" strokeWidth="1.6" />
          <circle className="header-wheel" cx="28" cy="32" r="5" fill="#1e3d56" />
          <circle className="header-wheel" cx="62" cy="32" r="5" fill="#1e3d56" />
        </g>
      </g>
    </g>
  )
}

function ShopMarket() {
  return (
    <g>
      <g transform="translate(10 14)">
        <path d="M0 18 L20 4 L40 18" fill="#c4471a" stroke="#1c2b22" strokeWidth="1.4" />
        <rect x="2" y="18" width="36" height="22" fill="#f4e4c1" stroke="#1c2b22" strokeWidth="1.3" />
        <circle className="header-float is-a" cx="12" cy="30" r="5" fill="#c4471a" />
        <circle className="header-float is-b" cx="24" cy="32" r="5" fill="#e2c36a" />
        <ellipse cx="32" cy="30" rx="4" ry="6" fill="#2c4a3e" />
      </g>
      <g transform="translate(58 22)">
        <rect x="0" y="8" width="40" height="20" fill="#c9922a" stroke="#1c2b22" strokeWidth="1.3" />
        <rect x="4" y="0" width="32" height="12" fill="#1e3d56" stroke="#1c2b22" strokeWidth="1.2" />
        <circle className="header-bob" cx="12" cy="18" r="4" fill="#fbf6e8" />
        <circle cx="28" cy="18" r="4" fill="#c4471a" />
      </g>
      <g className="header-float">
        <g transform="translate(112 18)">
          <rect x="0" y="10" width="18" height="22" rx="2" fill="#fbf6e8" stroke="#1c2b22" strokeWidth="1.3" />
          <rect x="3" y="4" width="12" height="8" fill="#c4471a" />
        </g>
      </g>
    </g>
  )
}

function ShopPicnic() {
  return (
    <g>
      <g transform="translate(12 28)">
        <ellipse cx="40" cy="18" rx="48" ry="10" fill="#2c4a3e" />
        <rect x="8" y="4" width="64" height="22" rx="3" fill="#f4e4c1" stroke="#1c2b22" strokeWidth="1.4" />
      </g>
      <g className="lab-steam">
        <g transform="translate(24 10)">
          <path d="M6 18 C6 10, 2 8, 6 2" fill="none" stroke="#fbf6e8" strokeWidth="1.4" />
          <path d="M12 18 C14 10, 8 8, 12 2" fill="none" stroke="#fbf6e8" strokeWidth="1.4" />
          <ellipse cx="10" cy="26" rx="10" ry="7" fill="#c4471a" stroke="#1c2b22" strokeWidth="1.3" />
          <path d="M20 24 C26 24, 26 32, 20 32" fill="none" stroke="#1c2b22" strokeWidth="1.4" />
        </g>
      </g>
      <g className="header-float is-b">
        <g transform="translate(70 16)">
          <ellipse cx="10" cy="14" rx="12" ry="8" fill="#e2c36a" stroke="#1c2b22" strokeWidth="1.2" />
        </g>
      </g>
      <g transform="translate(100 22)">
        <rect x="0" y="8" width="28" height="16" rx="2" fill="#fbf6e8" stroke="#1c2b22" strokeWidth="1.3" />
        <path d="M0 16 H28" stroke="#c4471a" strokeWidth="2" />
      </g>
    </g>
  )
}

function ShopBags() {
  return (
    <g className="header-float">
      <g transform="translate(16 18)">
        <path d="M6 12 L10 4 H22 L26 12 V40 H6 Z" fill="#c4471a" stroke="#1c2b22" strokeWidth="1.4" />
        <path d="M10 4 C10 -2, 22 -2, 22 4" fill="none" stroke="#1c2b22" strokeWidth="1.5" />
      </g>
      <g className="header-float is-b">
        <g transform="translate(52 14)">
          <path d="M6 12 L10 4 H22 L26 12 V40 H6 Z" fill="#f4e4c1" stroke="#1c2b22" strokeWidth="1.4" />
          <path d="M10 4 C10 -2, 22 -2, 22 4" fill="none" stroke="#1c2b22" strokeWidth="1.5" />
          <circle cx="16" cy="22" r="5" fill="#e2c36a" />
        </g>
      </g>
      <g transform="translate(92 20)">
        <path d="M6 12 L10 4 H22 L26 12 V36 H6 Z" fill="#1e3d56" stroke="#1c2b22" strokeWidth="1.4" />
        <rect x="10" y="18" width="12" height="8" fill="#c9922a" />
      </g>
    </g>
  )
}

function RvCoach() {
  return (
    <g>
      <g transform="translate(8 18)">
        <circle cx="8" cy="6" r="6" fill="#f4e4c1" stroke="#1c2b22" strokeWidth="1.3" />
        <path d="M2 14 L8 12 L14 14 L16 28 L0 28 Z" fill="#1e3d56" stroke="#1c2b22" strokeWidth="1.3" />
        <g className="header-think">
          <circle cx="20" cy="0" r="7.5" fill="#fbf6e8" stroke="#1c2b22" strokeWidth="1.3" />
          <text x="20" y="4" textAnchor="middle" fill="#c4471a" fontSize="11" fontFamily="Oswald, sans-serif">
            ?
          </text>
        </g>
      </g>
      <g transform="translate(38 28)">
        <rect x="0" y="2" width="16" height="20" rx="1" fill="#fbf6e8" stroke="#1c2b22" strokeWidth="1.3" />
        <rect x="0" y="2" width="4" height="20" fill="#c4471a" />
      </g>
      <g className="header-rv">
        <g transform="translate(62 22)">
          <rect x="28" y="10" width="86" height="26" rx="3" fill="#c4471a" stroke="#1c2b22" strokeWidth="1.6" />
          <rect x="0" y="18" width="32" height="18" rx="2" fill="#c4471a" stroke="#1c2b22" strokeWidth="1.6" />
          <circle className="header-wheel" cx="18" cy="38" r="6" fill="#1c2b22" />
          <circle className="header-wheel" cx="54" cy="38" r="6" fill="#1c2b22" />
          <circle className="header-wheel" cx="96" cy="38" r="6" fill="#1c2b22" />
        </g>
      </g>
    </g>
  )
}

function RvHookups() {
  return (
    <g>
      <g className="header-rv">
        <g transform="translate(8 18)">
        <rect x="24" y="12" width="70" height="24" rx="2" fill="#c4471a" stroke="#1c2b22" strokeWidth="1.5" />
        <rect x="0" y="18" width="26" height="18" rx="2" fill="#c4471a" stroke="#1c2b22" strokeWidth="1.5" />
        <circle className="header-wheel" cx="16" cy="38" r="5" fill="#1c2b22" />
        <circle className="header-wheel" cx="48" cy="38" r="5" fill="#1c2b22" />
        <circle className="header-wheel" cx="78" cy="38" r="5" fill="#1c2b22" />
        </g>
      </g>
      <g transform="translate(112 20)">
        <rect x="8" y="18" width="14" height="22" fill="#1e3d56" stroke="#1c2b22" strokeWidth="1.3" />
        <rect x="4" y="8" width="22" height="12" fill="#c9922a" stroke="#1c2b22" strokeWidth="1.3" />
        <circle className="lab-blink" cx="15" cy="14" r="3" fill="#c4471a" />
        <path d="M8 30 C0 36, 4 42, 18 40" fill="none" stroke="#7ba3b8" strokeWidth="2" />
      </g>
    </g>
  )
}

function RvTools() {
  return (
    <g>
      <g className="header-think">
        <g transform="translate(22 18)">
        <rect x="0" y="8" width="10" height="28" rx="2" fill="#c9922a" stroke="#1c2b22" strokeWidth="1.3" />
        <circle cx="5" cy="8" r="7" fill="#1e3d56" stroke="#1c2b22" strokeWidth="1.3" />
        </g>
      </g>
      <g transform="translate(48 22)">
        <ellipse cx="12" cy="18" rx="12" ry="16" fill="#2c4a3e" stroke="#1c2b22" strokeWidth="1.4" />
        <rect x="8" y="0" width="8" height="10" fill="#c4471a" stroke="#1c2b22" strokeWidth="1.2" />
      </g>
      <g className="header-float is-b">
        <g transform="translate(84 16)">
        <rect x="0" y="4" width="36" height="28" fill="#fbf6e8" stroke="#1c2b22" strokeWidth="1.4" />
        <path d="M6 12 H30 M6 18 H24 M6 24 H28" stroke="#1e3d56" strokeWidth="1.3" />
        </g>
      </g>
    </g>
  )
}

function RvCamp() {
  return (
    <g>
      <g className="lab-flicker">
        <g transform="translate(28 28)">
        <path d="M0 20 L10 0 L20 20 Z" fill="#c4471a" stroke="#1c2b22" strokeWidth="1.2" />
        <path d="M4 20 L10 6 L16 20 Z" fill="#e2c36a" />
        </g>
      </g>
      <g transform="translate(8 36)">
        <path d="M0 12 L10 0 L20 12 Z" fill="#1e3d56" stroke="#1c2b22" strokeWidth="1.2" />
        <rect x="4" y="12" width="12" height="8" fill="#1e3d56" />
      </g>
      <g transform="translate(52 36)">
        <path d="M0 12 L10 0 L20 12 Z" fill="#c9922a" stroke="#1c2b22" strokeWidth="1.2" />
        <rect x="4" y="12" width="12" height="8" fill="#c9922a" />
      </g>
      <g transform="translate(88 22)">
        <rect x="16" y="10" width="50" height="20" rx="2" fill="#c4471a" stroke="#1c2b22" strokeWidth="1.4" />
        <rect x="0" y="16" width="18" height="14" fill="#c4471a" stroke="#1c2b22" strokeWidth="1.3" />
        <circle cx="10" cy="32" r="4" fill="#1c2b22" />
        <circle cx="40" cy="32" r="4" fill="#1c2b22" />
      </g>
      <g className="header-float">
        <circle cx="150" cy="12" r="2" fill="#fbf6e8" />
        <circle cx="168" cy="8" r="1.5" fill="#fbf6e8" />
        <circle cx="138" cy="18" r="1.4" fill="#f0d48a" />
      </g>
    </g>
  )
}

function LocPeople() {
  return (
    <g>
      <g className="header-pulse">
        <g transform="translate(118 22)">
          <circle r="18" fill="none" stroke="#f0d48a" strokeWidth="1.2" />
        </g>
      </g>
      <g transform="translate(36 36)">
        <Person fill="#1e3d56" />
      </g>
      <g transform="translate(68 34)">
        <Person fill="#c4471a" />
      </g>
      <g transform="translate(100 36)">
        <Person fill="#c9922a" />
      </g>
      <g transform="translate(132 24)">
        <Pin className="header-pin is-a" />
      </g>
      <g transform="translate(156 30)">
        <Pin className="header-pin is-b" />
      </g>
    </g>
  )
}

function LocWalkies() {
  return (
    <g>
      <g transform="translate(16 16)">
        <rect x="4" y="10" width="18" height="32" rx="3" fill="#1e3d56" stroke="#1c2b22" strokeWidth="1.4" />
        <rect x="8" y="2" width="4" height="10" fill="#c4471a" />
        <circle className="lab-blink" cx="13" cy="20" r="3" fill="#e2c36a" />
      </g>
      <g className="lab-signal">
        <g transform="translate(44 18)">
          <path d="M0 20 C12 8, 12 32, 0 20" fill="none" stroke="#f0d48a" strokeWidth="1.6" />
          <path d="M6 20 C22 0, 22 40, 6 20" fill="none" stroke="#f0d48a" strokeWidth="1.4" />
        </g>
      </g>
      <g transform="translate(88 16)">
        <rect x="4" y="10" width="18" height="32" rx="3" fill="#c4471a" stroke="#1c2b22" strokeWidth="1.4" />
        <rect x="14" y="2" width="4" height="10" fill="#1e3d56" />
        <circle className="lab-blink" cx="13" cy="20" r="3" fill="#fbf6e8" />
      </g>
      <g transform="translate(130 28)">
        <Person fill="#c9922a" />
      </g>
    </g>
  )
}

function LocCompassRose() {
  return (
    <g>
      <g className="lab-spin-slow">
        <g transform="translate(64 34)">
        <circle r="22" fill="#f4e4c1" stroke="#1c2b22" strokeWidth="1.6" />
        <path d="M0 -20 L6 0 L0 20 L-6 0 Z" fill="#c4471a" />
        <path d="M-20 0 L0 6 L20 0 L0 -6 Z" fill="#1e3d56" />
        <text x="0" y="-24" textAnchor="middle" fill="#fbf6e8" fontSize="8" fontFamily="Oswald, sans-serif">
          N
        </text>
        </g>
      </g>
      <g transform="translate(118 22)">
        <Pin className="header-pin is-a" />
      </g>
      <g transform="translate(148 36)">
        <Pin className="header-pin is-b" />
      </g>
    </g>
  )
}

function LocPing() {
  return (
    <g>
      <g transform="translate(20 18)">
        <rect x="0" y="8" width="28" height="36" rx="4" fill="#1e3d56" stroke="#1c2b22" strokeWidth="1.5" />
        <rect x="4" y="12" width="20" height="22" fill="#7ba3b8" />
        <circle className="lab-blink" cx="14" cy="40" r="2.5" fill="#c4471a" />
      </g>
      <g className="header-pulse">
        <g transform="translate(86 28)">
          <circle r="16" fill="none" stroke="#f0d48a" strokeWidth="1.4" />
          <circle r="8" fill="none" stroke="#c4471a" strokeWidth="1.3" />
        </g>
      </g>
      <g transform="translate(86 28)">
        <Pin className="header-pin is-a" />
      </g>
      <g transform="translate(128 34)">
        <Person fill="#c4471a" />
      </g>
    </g>
  )
}

export const OPTIONS: Record<TabId, HeaderOption[]> = {
  plan: [
    { id: 'map-pins', name: 'Map & pins', note: 'Current', Art: PlanMapPins },
    { id: 'compass', name: 'Compass trail', note: 'Boots on a dashed path', Art: PlanCompass },
    { id: 'binoculars', name: 'Lookout', note: 'Binoculars spotting pins', Art: PlanBinoculars },
    { id: 'convoy', name: 'Convoy', note: 'Car + RV on the road', Art: PlanConvoy },
  ],
  shop: [
    { id: 'cart', name: 'Cart & fruit', note: 'Current', Art: ShopCart },
    { id: 'market', name: 'Market stall', note: 'Awning, crates, milk', Art: ShopMarket },
    { id: 'picnic', name: 'Camp kitchen', note: 'Mug, banana, sandwich', Art: ShopPicnic },
    { id: 'bags', name: 'Grocery bags', note: 'Three bags bouncing', Art: ShopBags },
  ],
  rv: [
    { id: 'coach', name: 'Coach & ?', note: 'Current', Art: RvCoach },
    { id: 'hookups', name: 'Hookups', note: 'Power pedestal + hose', Art: RvHookups },
    { id: 'tools', name: 'Wrench & tank', note: 'Tools plus a checklist', Art: RvTools },
    { id: 'camp', name: 'Campfire night', note: 'Fire, chairs, parked RV', Art: RvCamp },
  ],
  location: [
    { id: 'people', name: 'Family pins', note: 'Current', Art: LocPeople },
    { id: 'walkies', name: 'Walkie-talkies', note: 'Signal arcs between radios', Art: LocWalkies },
    { id: 'compass-rose', name: 'Compass rose', note: 'Spinning N marker', Art: LocCompassRose },
    { id: 'ping', name: 'Phone ping', note: 'Phone finding a pin', Art: LocPing },
  ],
}
