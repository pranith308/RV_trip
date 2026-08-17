/* Local-only samples for the traveler gate. Not shipped in the app. */

type LookId = 'postcard' | 'camp' | 'mapsheet' | 'stickers'
type GateState = 'roster' | 'create' | 'pin'

const LOOKS: { id: LookId; name: string; note: string }[] = [
  {
    id: 'postcard',
    name: 'Trail Postcard',
    note: 'Framed scene up top: sun, ridge, and the camper rolling in. Taped title, luggage-tag names.',
  },
  {
    id: 'camp',
    name: 'Campsite',
    note: 'Pennant garland under the card, then pines, a tent, campfire, and the camper parked along the bottom.',
  },
  {
    id: 'mapsheet',
    name: 'Map Sheet',
    note: 'Folded map paper: contour rings, a dashed route with pins, compass rose behind the card.',
  },
  {
    id: 'stickers',
    name: 'Sticker Journal',
    note: 'Scattered doodles like a journal cover: cactus, canyon arch, thermos, wheel, arrows.',
  },
]

export function GateLab() {
  return (
    <div className="gl-lab">
      <header className="gl-lab-head">
        <p className="gl-lab-kicker">Local only · gate lab</p>
        <h1>Create traveler screen</h1>
        <p className="gl-lab-lead">
          Four takes on the entry screen in the Journey style, each with the new wording. Every look
          is shown as the roster (returning travelers) and as the add-a-traveler step. Tell me which
          drawing set you want and I will wire it into the live gate.
        </p>
      </header>

      {LOOKS.map((look) => (
        <section key={look.id} className="gl-block">
          <div className="gl-block-head">
            <h2>{look.name}</h2>
            <p>{look.note}</p>
          </div>
          <div className="gl-row">
            <Phone look={look.id} state="roster" caption="Choose your name" />
            <Phone look={look.id} state="create" caption="Add a traveler" />
          </div>
        </section>
      ))}

      <section className="gl-block">
        <div className="gl-block-head">
          <h2>PIN step</h2>
          <p>The keypad screen, shown in each look so you can compare the quieter states too.</p>
        </div>
        <div className="gl-row">
          {LOOKS.map((look) => (
            <Phone key={look.id} look={look.id} state="pin" caption={look.name} />
          ))}
        </div>
      </section>
    </div>
  )
}

function Phone({
  look,
  state,
  caption,
}: {
  look: LookId
  state: GateState
  caption: string
}) {
  return (
    <figure className="gl-phone-wrap">
      <div className={`gl-phone look-${look}`}>
        <div className="gl-gate">
          <BackArt look={look} />
          <div className="gl-card">
            <Masthead look={look} />
            {state === 'roster' && <RosterBody look={look} />}
            {state === 'create' && <CreateBody />}
            {state === 'pin' && <PinBody />}
          </div>
          <div className="gl-band">
            <BandArt look={look} />
          </div>
        </div>
      </div>
      <figcaption>{caption}</figcaption>
    </figure>
  )
}

function Masthead({ look }: { look: LookId }) {
  return (
    <div className="gl-masthead">
      <p className="gl-kicker">The Family Expedition</p>
      {look === 'postcard' && <ScenePanel />}
      <h1 className="gl-title">A First RV Journey</h1>
      <p className="gl-tag">LFG!!</p>
      <TrailRule />
    </div>
  )
}

function RosterBody({ look }: { look: LookId }) {
  return (
    <div className="gl-body">
      <p className="gl-lead">Welcome, traveler. Choose your name.</p>
      <div className="gl-roster">
        {[
          { name: 'Pranith', known: true },
          { name: 'Bhavya', known: false },
        ].map((person) => (
          <div key={person.name} className="gl-roster-btn">
            <span className="gl-mark">{person.name.slice(0, 1)}</span>
            <span className="gl-roster-name">{person.name}</span>
            {person.known ? <span className="gl-known">this phone</span> : null}
            {look === 'stickers' ? <StickerBullet /> : null}
          </div>
        ))}
      </div>
      <div className="gl-primary">+ Add a traveler</div>
    </div>
  )
}

function CreateBody() {
  return (
    <div className="gl-body">
      <p className="gl-lead">Create your trail name.</p>
      <p className="gl-field-label">Your name</p>
      <div className="gl-field">
        <span>First name</span>
      </div>
      <div className="gl-primary">Continue</div>
      <div className="gl-text-btn">Back to roster</div>
    </div>
  )
}

function PinBody() {
  return (
    <div className="gl-body">
      <p className="gl-lead">Choose a 4-digit PIN for this phone.</p>
      <div className="gl-dots">
        {[0, 1, 2, 3].map((slot) => (
          <span key={slot} className={`gl-dot${slot < 2 ? ' is-filled' : ''}`} />
        ))}
      </div>
      <div className="gl-pad">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'].map((key, index) => (
          <span key={index} className={`gl-key${key ? '' : ' is-blank'}`}>
            {key}
          </span>
        ))}
      </div>
      <div className="gl-text-btn">Back</div>
    </div>
  )
}

function TrailRule() {
  return (
    <svg className="gl-rule" viewBox="0 0 260 12" aria-hidden="true">
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

function ScenePanel() {
  return (
    <svg className="gl-scene" viewBox="0 0 300 132" aria-hidden="true">
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

function StickerBullet() {
  return (
    <svg className="gl-bullet" viewBox="0 0 24 24" aria-hidden="true">
      <g fill="none" stroke="#b2946a" strokeWidth="1.6" strokeLinecap="round">
        <path d="M12 3 C12 3 5 11 5 15 A7 7 0 0 0 19 15 C19 11 12 3 12 3 Z" />
      </g>
    </svg>
  )
}

function StampGlyph({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <g fill="none" stroke="#b2946a" strokeWidth="1.6" strokeLinejoin="round">
        <path d="M8 8 H84 V84 H8 Z" strokeDasharray="5 4" />
        <path d="M18 62 L36 38 L48 52 L62 30 L76 62" />
        <circle cx="64" cy="24" r="6" stroke="#c9922a" />
        <path d="M18 70 H76" />
      </g>
    </g>
  )
}

function BackArt({ look }: { look: LookId }) {
  if (look === 'mapsheet') {
    return (
      <svg className="gl-map-bed" viewBox="0 0 320 620" aria-hidden="true">
        <g fill="none" stroke="#cdb28c" strokeWidth="1" opacity="0.9">
          <ellipse cx="72" cy="120" rx="66" ry="38" />
          <ellipse cx="72" cy="120" rx="44" ry="24" />
          <ellipse cx="72" cy="120" rx="22" ry="11" />
          <ellipse cx="252" cy="300" rx="74" ry="44" />
          <ellipse cx="252" cy="300" rx="48" ry="27" />
          <ellipse cx="252" cy="300" rx="24" ry="13" />
          <ellipse cx="96" cy="500" rx="70" ry="40" />
          <ellipse cx="96" cy="500" rx="44" ry="23" />
        </g>
        <g stroke="#c8ab84" strokeWidth="1" opacity="0.55">
          <path d="M0 206 H320 M0 414 H320 M108 0 V620 M214 0 V620" />
        </g>
      </svg>
    )
  }

  if (look === 'stickers') {
    return (
      <>
        <svg className="gl-sticker-tr" viewBox="0 0 70 70" aria-hidden="true">
          <circle cx="35" cy="35" r="30" fill="#f6ead2" stroke="#c19f78" strokeWidth="1.2" />
          <g fill="none" stroke="#b2946a" strokeWidth="1.5" strokeLinecap="round">
            <circle cx="35" cy="35" r="21" />
            <path d="M35 14 V20 M35 50 V56 M14 35 H20 M50 35 H56" />
          </g>
          <path d="M35 19 L42 35 L35 51 L28 35 Z" fill="none" stroke="#c4471a" strokeWidth="1.5" />
        </svg>
        <svg className="gl-sticker-bl" viewBox="0 0 80 54" aria-hidden="true">
          <g fill="none" stroke="#b2946a" strokeWidth="1.6" strokeLinecap="round">
            <path d="M6 40 C22 12 48 12 68 34" strokeDasharray="5 6" />
          </g>
          <path d="M68 26 L74 38 L60 39 Z" fill="#c4471a" />
        </svg>
      </>
    )
  }

  return null
}

function BandArt({ look }: { look: LookId }) {
  if (look === 'postcard') {
    return (
      <svg className="gl-band-art" viewBox="0 0 320 160" preserveAspectRatio="xMidYMax meet">
        <StampGlyph x={252} y={90} scale={0.5} />
        <g
          fill="none"
          stroke="#b2946a"
          strokeWidth="1.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        >
          <path d="M0 120 H320" opacity="0.45" />
          <path d="M96 120 V98 M86 88 H112 V99 H86 Z" />
        </g>
        <Pine x={32} y={80} scale={0.95} />
        <Pine x={68} y={92} scale={0.7} />
        <g transform="translate(126 70)">
          <RvGlyph />
        </g>
        <path
          d="M8 146 C90 130 150 152 312 128"
          fill="none"
          stroke="#c4471a"
          strokeWidth="1.3"
          strokeDasharray="7 9"
          strokeLinecap="round"
          opacity="0.7"
        />
      </svg>
    )
  }

  if (look === 'camp') {
    return (
      <>
        <svg className="gl-band-top" viewBox="0 0 320 76" preserveAspectRatio="xMidYMin meet">
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
        <svg className="gl-band-art" viewBox="0 0 320 120" preserveAspectRatio="xMidYMax meet">
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
      </>
    )
  }

  if (look === 'mapsheet') {
    return (
      <svg className="gl-band-art" viewBox="0 0 320 160" preserveAspectRatio="xMidYMax meet">
        <path
          d="M4 18 C60 68 118 38 176 92"
          fill="none"
          stroke="#c4471a"
          strokeWidth="1.5"
          strokeDasharray="7 9"
          strokeLinecap="round"
          opacity="0.7"
        />
        <g fill="none" stroke="#8a6a3a" strokeWidth="1.7" strokeLinecap="round">
          <path d="M62 76 C62 76 52 60 52 50 A10 10 0 0 1 72 50 C72 60 62 76 62 76 Z" />
          <circle cx="62" cy="50" r="2.8" />
          <path d="M20 140 H96 M20 134 V146 M96 134 V146 M58 136 V144" opacity="0.8" />
        </g>
        <g transform="translate(188 24) scale(1.2)">
          <g fill="none" stroke="#b2946a" strokeWidth="1.4" strokeLinecap="round">
            <circle cx="45" cy="45" r="34" />
            <circle cx="45" cy="45" r="26" />
            <path d="M45 11 V19 M45 71 V79 M11 45 H19 M71 45 H79" />
            <path d="M23 23 L29 29 M61 61 L67 67 M67 23 L61 29 M23 67 L29 61" />
          </g>
          <path d="M45 19 L54 45 L45 71 L36 45 Z" fill="none" stroke="#c4471a" strokeWidth="1.5" />
        </g>
      </svg>
    )
  }

  return (
    <svg className="gl-band-art" viewBox="0 0 320 170" preserveAspectRatio="xMidYMax meet">
      <g
        fill="none"
        stroke="#b2946a"
        strokeWidth="1.7"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        <g transform="translate(26 84)">
          <path d="M12 62 V22 C12 14 24 14 24 22 V62" />
          <path d="M24 36 H40 C46 36 48 30 48 24" />
          <path d="M12 44 H-2 C-8 44 -10 38 -10 32" />
          <path d="M2 64 H36" />
        </g>
        <g transform="translate(110 92)">
          <path d="M0 52 V26 C0 8 44 8 44 26 V52" />
          <path d="M10 52 V30 C10 18 34 18 34 30 V52" />
          <path d="M-8 54 H52" />
        </g>
        <g transform="translate(206 84)">
          <path d="M6 14 H30 V52 C30 57 25 59 18 59 C11 59 6 57 6 52 Z" />
          <path d="M11 4 H25 V14 H11 Z" />
          <path d="M6 28 H30" />
        </g>
        <g transform="translate(264 104)">
          <circle cx="20" cy="20" r="19" />
          <circle cx="20" cy="20" r="6" />
          <path d="M20 1 V14 M20 26 V39 M1 20 H14 M26 20 H39" />
        </g>
        <g transform="translate(140 8)">
          <circle cx="20" cy="20" r="12" stroke="#c9922a" />
          <path
            d="M20 0 V6 M20 34 V40 M0 20 H6 M34 20 H40 M6 6 L10 10 M30 30 L34 34 M30 6 L34 2 M6 34 L10 30"
            stroke="#c9922a"
          />
        </g>
        <g transform="translate(28 16)">
          <path d="M0 26 C12 8 28 8 40 26" strokeDasharray="5 6" />
        </g>
      </g>
      <path d="M64 38 L72 50 L58 52 Z" fill="#c4471a" />
    </svg>
  )
}

