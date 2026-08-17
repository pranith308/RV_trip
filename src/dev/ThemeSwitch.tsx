import { useState, type CSSProperties } from 'react'

const THEME_KEY = 'expedition.theme'
const SKETCH_KEY = 'expedition.sketch'

const SKETCHES = [
  { id: 'auto', label: 'Per tab' },
  { id: 'camper', label: 'Camper' },
  { id: 'ridge', label: 'Ridge' },
  { id: 'camp', label: 'Camp' },
  { id: 'road', label: 'Road' },
  { id: 'map', label: 'Map' },
  { id: 'none', label: 'None' },
] as const

function storedTheme() {
  return localStorage.getItem(THEME_KEY) === 'classic' ? 'classic' : 'journey'
}

function storedSketch() {
  const saved = localStorage.getItem(SKETCH_KEY)
  return SKETCHES.some((option) => option.id === saved) ? (saved as string) : 'auto'
}

export function applyStoredTheme() {
  const root = document.documentElement
  root.dataset.theme = storedTheme()
  root.dataset.sketch = storedSketch()
}

export function DevThemeSwitch() {
  const [open, setOpen] = useState(false)
  const [theme, setTheme] = useState(storedTheme)
  const [sketch, setSketch] = useState(storedSketch)

  function pickTheme(next: 'journey' | 'classic') {
    localStorage.setItem(THEME_KEY, next)
    document.documentElement.dataset.theme = next
    setTheme(next)
  }

  function pickSketch(next: string) {
    localStorage.setItem(SKETCH_KEY, next)
    document.documentElement.dataset.sketch = next
    setSketch(next)
  }

  if (!open) {
    return (
      <button type="button" style={tabStyle} onClick={() => setOpen(true)}>
        Theme
      </button>
    )
  }

  return (
    <div style={panelStyle}>
      <div style={rowStyle}>
        <strong style={labelStyle}>Look</strong>
        <button
          type="button"
          style={chipStyle(theme === 'journey')}
          onClick={() => pickTheme('journey')}
        >
          Journey
        </button>
        <button
          type="button"
          style={chipStyle(theme === 'classic')}
          onClick={() => pickTheme('classic')}
        >
          Classic
        </button>
      </div>
      <div style={rowStyle}>
        <strong style={labelStyle}>Sketch</strong>
        {SKETCHES.map((option) => (
          <button
            key={option.id}
            type="button"
            style={chipStyle(sketch === option.id, theme !== 'journey')}
            onClick={() => pickSketch(option.id)}
          >
            {option.label}
          </button>
        ))}
      </div>
      <button type="button" style={closeStyle} onClick={() => setOpen(false)}>
        Hide
      </button>
    </div>
  )
}

const tabStyle: CSSProperties = {
  position: 'fixed',
  right: 0,
  bottom: '28vh',
  zIndex: 40,
  background: '#1a3329',
  color: '#f0d48a',
  font: '600 11px/1 system-ui, sans-serif',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  padding: '8px 7px',
  borderRadius: '6px 0 0 6px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.35)',
}

const panelStyle: CSSProperties = {
  position: 'fixed',
  right: 8,
  bottom: '18vh',
  zIndex: 40,
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
  background: 'rgba(16, 32, 25, 0.95)',
  padding: '8px 9px 9px',
  borderRadius: 10,
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
}

const rowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 4,
  flexWrap: 'wrap',
  maxWidth: 230,
}

const labelStyle: CSSProperties = {
  color: '#9fb6a6',
  font: '600 10px/1 system-ui, sans-serif',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  marginRight: 2,
}

function chipStyle(active: boolean, dim = false): CSSProperties {
  return {
    background: active ? '#c4471a' : 'rgba(255, 255, 255, 0.1)',
    color: active ? '#fff8ea' : '#d7e4dc',
    font: '600 11px/1 system-ui, sans-serif',
    padding: '5px 8px',
    borderRadius: 999,
    opacity: dim ? 0.4 : 1,
  }
}

const closeStyle: CSSProperties = {
  alignSelf: 'flex-start',
  color: '#9fb6a6',
  font: '600 10px/1 system-ui, sans-serif',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  padding: '2px 0 0',
}
