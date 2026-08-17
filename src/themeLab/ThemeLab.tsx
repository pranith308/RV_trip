import { useState } from 'react'
import { ParkPair } from './ParkLooks'

type Sample = {
  id: string
  name: string
  note: string
  look: string
  wm?: string
  font?: string
}

const JOURNEY: Sample[] = [
  {
    id: 'journey-rv',
    name: 'Camper in the corner',
    note: 'Faint line drawing of the RV low on the page. Rounded casual dates.',
    look: 'journey',
    wm: 'rv',
  },
  {
    id: 'journey-ridge',
    name: 'Mountain ridge',
    note: 'A thin sketched range sitting behind the list, above the add button.',
    look: 'journey',
    wm: 'ridge',
  },
  {
    id: 'journey-road',
    name: 'Winding road',
    note: 'Dashed road curving down the page with a few pines and a pin.',
    look: 'journey',
    wm: 'road',
  },
  {
    id: 'journey-camp',
    name: 'Camp scene',
    note: 'Tent, pines and a small fire sketched in the bottom corner.',
    look: 'journey',
    wm: 'camp',
  },
  {
    id: 'journey-map',
    name: 'Map contours',
    note: 'Whole page has faint contour rings and a dotted route. Most texture.',
    look: 'journey',
    wm: 'map',
  },
  {
    id: 'journey-plain',
    name: 'No sketch',
    note: 'Same look with a clean background, so you can compare.',
    look: 'journey',
  },
]

const FONTS: Sample[] = [
  {
    id: 'font-nunito',
    name: 'Rounded (Nunito)',
    note: 'The default on all samples above. Friendly, still easy to read.',
    look: 'journey',
    wm: 'rv',
  },
  {
    id: 'font-quicksand',
    name: 'Softer round (Quicksand)',
    note: 'A bit wider and lighter. Calmer than Nunito.',
    look: 'journey',
    wm: 'rv',
    font: 'quicksand',
  },
  {
    id: 'font-hand',
    name: 'Neat hand print (Patrick Hand)',
    note: 'Hand-written but tidy. Most casual option without going scribbly.',
    look: 'journey',
    wm: 'rv',
    font: 'hand',
  },
]

const OTHERS: Sample[] = [
  { id: 'notebook', name: 'Notebook', note: 'From last round.', look: 'notebook' },
  { id: 'banner', name: 'Forest banner', note: 'From last round.', look: 'banner' },
  { id: 'topo', name: 'Vintage map', note: 'From last round.', look: 'topo' },
  { id: 'adventure', name: 'Our adventure', note: 'From last round.', look: 'adventure' },
  { id: 'postcard', name: 'Taped postcard', note: 'From last round.', look: 'postcard' },
]

const KEY = 'expedition.planThemePick'

export function ThemeLab() {
  const [picked, setPicked] = useState(() => localStorage.getItem(KEY) ?? 'journey-rv')

  function choose(id: string) {
    setPicked(id)
    localStorage.setItem(KEY, id)
  }

  return (
    <div className="tlab-page">
      <header className="tlab-intro">
        <p className="tlab-kicker">Local only · not on the family site</p>
        <h1>The Journey, more versions</h1>
        <p>
          Fixed the stray mint box at the top — the kraft label now has proper tape corners and a
          small dotted trail. Dates and categories use a rounded casual font instead of the serif.
          Each sample shows Plan and Shopping List with Food open.
        </p>
        <nav className="tlab-jump">
          {[...JOURNEY, ...FONTS].map((sample) => (
            <a key={sample.id} href={`#look-${sample.id}`}>
              {sample.name}
            </a>
          ))}
        </nav>
      </header>

      <h2 className="tlab-section-head">Background sketches</h2>
      {JOURNEY.map((sample) => (
        <SampleBlock key={sample.id} sample={sample} picked={picked} onPick={choose} />
      ))}

      <h2 className="tlab-section-head">Font options (same camper background)</h2>
      {FONTS.map((sample) => (
        <SampleBlock key={sample.id} sample={sample} picked={picked} onPick={choose} />
      ))}

      <h2 className="tlab-section-head">Other looks from last round</h2>
      {OTHERS.map((sample) => (
        <SampleBlock key={sample.id} sample={sample} picked={picked} onPick={choose} />
      ))}
    </div>
  )
}

function SampleBlock({
  sample,
  picked,
  onPick,
}: {
  sample: Sample
  picked: string
  onPick: (id: string) => void
}) {
  return (
    <section id={`look-${sample.id}`} className="park-block">
      <div className="tlab-copy">
        <h2>{sample.name}</h2>
        <p>{sample.note}</p>
        <button
          type="button"
          className={`tlab-pick${picked === sample.id ? ' is-on' : ''}`}
          onClick={() => onPick(sample.id)}
        >
          {picked === sample.id ? 'Picked' : 'Pick this'}
        </button>
      </div>
      <ParkPair look={sample.look} wm={sample.wm} font={sample.font} />
    </section>
  )
}
