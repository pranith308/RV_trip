function RvGlyph() {
  return (
    <g
      fill="none"
      stroke="#8a6a3a"
      strokeWidth="1.7"
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      <path d="M6 44 V22 C6 18 9 15 13 15 H70 L84 27 H101 C105 27 108 30 108 34 V44 Z" />
      <path d="M18 23 H40 V34 H18 Z" />
      <path d="M48 23 H64 V34 H48 Z" />
      <path d="M76 26 L84 33 H98 L89 26 Z" />
      <path d="M6 15 H52 M52 15 L60 8" />
      <path d="M34 11 H48 V15 H34 Z" />
      <circle cx="28" cy="46" r="6" />
      <circle cx="92" cy="46" r="6" />
    </g>
  )
}

function Pine({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g
      transform={`translate(${x} ${y}) scale(${scale})`}
      fill="none"
      stroke="#8a6a3a"
      strokeWidth="1.6"
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      <path d="M0 0 L-11 18 H11 Z" />
      <path d="M0 10 L-14 32 H14 Z" />
      <path d="M0 32 V40" />
    </g>
  )
}

export function GateScene() {
  return (
    <svg className="gate-scene" viewBox="0 0 300 132" aria-hidden="true">
      <rect x="1.5" y="1.5" width="297" height="129" rx="9" fill="#fffaef" stroke="#d3c3a4" />
      <circle cx="240" cy="30" r="12" fill="none" stroke="#c9922a" strokeWidth="1.6" />
      <g stroke="#c9922a" strokeWidth="1.3" strokeLinecap="round">
        <path d="M240 10 V4 M240 56 V50 M220 30 H214 M266 30 H260 M226 16 L222 12 M254 44 L258 48 M254 16 L258 12 M226 44 L222 48" />
      </g>
      <g fill="none" stroke="#b2946a" strokeWidth="1.6" strokeLinejoin="round">
        <path d="M8 88 L54 40 L80 66 L114 30 L152 74 L184 48 L216 82 L248 60 L292 90" />
        <path d="M102 42 L114 30 L126 42 M174 58 L184 48 L194 58" />
      </g>
      <g fill="none" stroke="#b2946a" strokeWidth="1.3" strokeLinecap="round">
        <path d="M40 26 C44 22 48 22 52 26 M56 26 C60 22 64 22 68 26" />
      </g>
      <Pine x={34} y={64} scale={0.7} />
      <Pine x={272} y={66} scale={0.62} />
      <g transform="translate(96 62)">
        <RvGlyph />
      </g>
      <path
        d="M6 116 C70 106 120 122 294 110"
        fill="none"
        stroke="#b2946a"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M20 122 C80 113 130 128 286 116"
        fill="none"
        stroke="#c4471a"
        strokeWidth="1.2"
        strokeDasharray="6 8"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function GateTrail() {
  return (
    <svg className="gate-trail" viewBox="0 0 260 12" aria-hidden="true">
      <path
        d="M4 8 C50 2 84 11 130 5 S212 2 256 7"
        fill="none"
        stroke="#b2946a"
        strokeWidth="1.4"
        strokeDasharray="4 5"
        strokeLinecap="round"
      />
      <circle cx="4" cy="8" r="2.2" fill="#c4471a" />
      <path d="M250 3 L258 7 L250 11 Z" fill="#c4471a" />
    </svg>
  )
}

export function GateCamp() {
  return (
    <div className="gate-art" aria-hidden="true">
      <svg className="gate-art-garland" viewBox="0 0 320 76" preserveAspectRatio="xMidYMin meet">
        <path
          d="M4 12 C80 46 240 46 316 12"
          fill="none"
          stroke="#b2946a"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
        <g fill="none" stroke="#c4471a" strokeWidth="1.3" strokeLinejoin="round" opacity="0.85">
          <path d="M33 26 L47 26 L40 40 Z" />
          <path d="M113 40 L127 40 L120 54 Z" />
          <path d="M193 40 L207 40 L200 54 Z" />
          <path d="M273 26 L287 26 L280 40 Z" />
        </g>
        <g fill="none" stroke="#b2946a" strokeWidth="1.3" strokeLinejoin="round">
          <path d="M73 36 L87 36 L80 50 Z" />
          <path d="M153 41 L167 41 L160 55 Z" />
          <path d="M233 36 L247 36 L240 50 Z" />
        </g>
      </svg>
      <svg className="gate-art-scene" viewBox="0 0 320 120" preserveAspectRatio="xMidYMax meet">
        <Pine x={30} y={64} scale={1.15} />
        <Pine x={68} y={76} scale={0.85} />
        <g
          fill="none"
          stroke="#8a6a3a"
          strokeWidth="1.7"
          strokeLinejoin="round"
          strokeLinecap="round"
        >
          <path d="M98 110 L124 62 L150 110 Z" />
          <path d="M124 62 V110" />
          <path d="M112 110 C116 92 132 92 136 110" />
          <path d="M178 106 C174 106 172 102 172 98 C172 91 178 88 178 80 C182 84 183 88 182 91 C184 89 186 86 186 82 C189 86 191 91 191 98 C191 102 188 106 184 106 Z" />
          <path d="M166 110 L198 110 M170 106 L194 98 M170 98 L194 106" />
          <path d="M6 110 H314" />
        </g>
        <g transform="translate(206 58)">
          <RvGlyph />
        </g>
      </svg>
    </div>
  )
}
