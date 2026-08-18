import type { SectionId } from '../nav'

type MountainsProps = {
  variant: 'hero' | 'strip'
  scene?: SectionId
}

export function Mountains({ variant, scene = 'plan' }: MountainsProps) {
  const tall = variant === 'hero'
  if (tall) return <HeroMountains />
  return (
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
      {scene === 'plan' && <PlanArt />}
      {scene === 'shop' && <ShopArt />}
      {scene === 'rv' && <RvArt />}
      {scene === 'bills' && <BillsArt />}
      {scene === 'location' && <LocationArt />}
    </svg>
  )
}

function HeroMountains() {
  return (
    <svg className="mountains mountains-hero" viewBox="0 0 400 150" aria-hidden="true">
      <rect width="400" height="150" fill="#7ba3b8" />
      <circle cx="318" cy="38" r="22" fill="#e2c36a" />
      <path
        fill="#1e3d56"
        d="M0 150 L0 92 L70 40 L120 78 L175 28 L250 88 L310 48 L400 96 L400 150 Z"
      />
      <path
        fill="#2c4a3e"
        d="M0 150 L0 110 L90 62 L150 98 L210 70 L280 108 L360 80 L400 108 L400 150 Z"
      />
      <path fill="#1a3329" d="M0 150 V128 H400 V150 Z" />
      <g fill="#c4471a">
        <rect x="46" y="118" width="36" height="16" rx="1" />
        <rect x="54" y="110" width="14" height="10" />
      </g>
    </svg>
  )
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

function PlanArt() {
  return (
    <g className="header-scene">
      <g transform="translate(10 6) rotate(-6)">
        <rect
          x="0"
          y="0"
          width="168"
          height="50"
          rx="3"
          fill="#f4e4c1"
          stroke="#1c2b22"
          strokeWidth="1.6"
        />
        <path
          d="M18 36 C40 28, 52 14, 78 18 S120 38, 150 16"
          fill="none"
          stroke="#c4471a"
          strokeWidth="1.6"
          strokeDasharray="3 3"
          strokeLinecap="round"
        />
        <circle cx="22" cy="38" r="2.2" fill="#1e3d56" />
        <circle cx="150" cy="16" r="2.2" fill="#1e3d56" />
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

function ShopArt() {
  return (
    <g className="header-scene">
      <g className="header-float is-a">
        <g transform="translate(8 14)">
          <ellipse cx="8" cy="16" rx="7" ry="9" fill="#e2c36a" stroke="#1c2b22" strokeWidth="1.2" />
          <path d="M8 4 C10 1, 14 2, 14 6" fill="none" stroke="#2c4a3e" strokeWidth="1.4" />
        </g>
      </g>
      <g className="header-float is-b">
        <g transform="translate(28 8)">
          <circle cx="8" cy="10" r="8" fill="#c4471a" stroke="#1c2b22" strokeWidth="1.2" />
          <ellipse cx="6" cy="7" rx="2" ry="1.2" fill="#fbf6e8" opacity="0.45" />
        </g>
      </g>
      <g transform="translate(48 22)">
        <rect x="0" y="8" width="22" height="16" rx="1" fill="#c9922a" stroke="#1c2b22" strokeWidth="1.3" />
        <path d="M4 8 C4 2, 18 2, 18 8" fill="none" stroke="#1c2b22" strokeWidth="1.5" />
        <rect x="3" y="12" width="16" height="3" fill="#f4e4c1" />
      </g>
      <g className="header-cart">
        <g transform="translate(78 24)">
        <path d="M4 4 H14 L18 6 H72" fill="none" stroke="#1c2b22" strokeWidth="1.6" />
        <rect x="16" y="6" width="56" height="22" rx="2" fill="#fbf6e8" stroke="#1c2b22" strokeWidth="1.6" />
        <path d="M22 10 H66 M22 16 H66 M22 22 H60" stroke="#7ba3b8" strokeWidth="1.1" />
        <rect x="20" y="8" width="10" height="14" fill="#c4471a" stroke="#1c2b22" strokeWidth="1" />
        <rect x="34" y="10" width="12" height="8" fill="#2c4a3e" stroke="#1c2b22" strokeWidth="1" />
        <circle className="header-wheel" cx="28" cy="32" r="5" fill="#1e3d56" stroke="#1c2b22" strokeWidth="1.3" />
        <circle className="header-wheel" cx="62" cy="32" r="5" fill="#1e3d56" stroke="#1c2b22" strokeWidth="1.3" />
        <circle cx="28" cy="32" r="1.6" fill="#fbf6e8" />
        <circle cx="62" cy="32" r="1.6" fill="#fbf6e8" />
        </g>
      </g>
    </g>
  )
}

function RvArt() {
  return (
    <g className="header-scene">
      <g transform="translate(8 18)">
        <circle cx="8" cy="6" r="6" fill="#f4e4c1" stroke="#1c2b22" strokeWidth="1.3" />
        <path d="M2 14 L8 12 L14 14 L16 28 L0 28 Z" fill="#1e3d56" stroke="#1c2b22" strokeWidth="1.3" />
        <g className="header-think">
          <circle cx="20" cy="0" r="7.5" fill="#fbf6e8" stroke="#1c2b22" strokeWidth="1.3" />
          <text
            x="20"
            y="4"
            textAnchor="middle"
            fill="#c4471a"
            fontSize="11"
            fontFamily="Oswald, sans-serif"
            fontWeight="700"
          >
            ?
          </text>
        </g>
      </g>
      <g transform="translate(38 28)">
        <rect x="0" y="2" width="16" height="20" rx="1" fill="#fbf6e8" stroke="#1c2b22" strokeWidth="1.3" />
        <rect x="0" y="2" width="4" height="20" fill="#c4471a" />
        <path d="M7 8 H14 M7 12 H14 M7 16 H12" stroke="#1e3d56" strokeWidth="1.1" />
      </g>
      <g className="header-rv">
        <g transform="translate(62 22)">
        <rect x="28" y="10" width="86" height="26" rx="3" fill="#c4471a" stroke="#1c2b22" strokeWidth="1.6" />
        <rect x="0" y="18" width="32" height="18" rx="2" fill="#c4471a" stroke="#1c2b22" strokeWidth="1.6" />
        <rect x="6" y="22" width="16" height="8" fill="#7ba3b8" stroke="#1c2b22" strokeWidth="1" />
        <rect x="38" y="16" width="18" height="10" fill="#fbf6e8" stroke="#1c2b22" strokeWidth="1" />
        <rect x="64" y="16" width="18" height="10" fill="#fbf6e8" stroke="#1c2b22" strokeWidth="1" />
        <rect x="90" y="16" width="14" height="10" fill="#fbf6e8" stroke="#1c2b22" strokeWidth="1" />
        <rect x="28" y="32" width="86" height="4" fill="#c9922a" />
        <circle className="header-wheel" cx="18" cy="38" r="6" fill="#1c2b22" />
        <circle className="header-wheel" cx="54" cy="38" r="6" fill="#1c2b22" />
        <circle className="header-wheel" cx="96" cy="38" r="6" fill="#1c2b22" />
        <circle cx="18" cy="38" r="2" fill="#f4e4c1" />
        <circle cx="54" cy="38" r="2" fill="#f4e4c1" />
        <circle cx="96" cy="38" r="2" fill="#f4e4c1" />
        </g>
      </g>
    </g>
  )
}

function BillsArt() {
  return (
    <g className="header-scene">
      <g transform="translate(38 16)">
        <rect
          x="0"
          y="2"
          width="42"
          height="38"
          rx="3"
          fill="#fbf6e8"
          stroke="#1c2b22"
          strokeWidth="1.2"
        />
        <path d="M7 12 H35 M7 18 H30 M7 24 H33" stroke="#c4471a" strokeWidth="1.5" strokeLinecap="round" />
      </g>
      <circle cx="108" cy="40" r="10" fill="#c9922a" stroke="#1c2b22" strokeWidth="1.2" />
      <circle cx="126" cy="34" r="8" fill="#e2c36a" stroke="#1c2b22" strokeWidth="1.2" />
      <circle cx="118" cy="48" r="6" fill="#f4e4c1" stroke="#1c2b22" strokeWidth="1.2" />
    </g>
  )
}

function Person({ fill }: { fill: string }) {
  return (
    <g>
      <circle cx="0" cy="-11" r="5.5" fill="#f4e4c1" stroke="#1c2b22" strokeWidth="1.2" />
      <path d="M-8 0 C-8 -6, 8 -6, 8 0 L10 16 L-10 16 Z" fill={fill} stroke="#1c2b22" strokeWidth="1.2" />
    </g>
  )
}

function LocationArt() {
  return (
    <g className="header-scene">
      <g className="header-pulse">
        <g transform="translate(118 22)">
          <circle r="18" fill="none" stroke="#f0d48a" strokeWidth="1.2" opacity="0.7" />
          <circle r="10" fill="none" stroke="#f0d48a" strokeWidth="1.2" opacity="0.85" />
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
