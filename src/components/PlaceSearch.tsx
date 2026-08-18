import { useEffect, useId, useRef, useState } from 'react'
import { newId } from '../ids'
import { loadPlace, mapsConfigured, searchPlaces } from '../maps/client'
import type { MappedPlace, PlaceSuggestion } from '../maps/types'

export function PlaceSearch({
  placeholder,
  disabled,
  value,
  onQueryChange,
  onPick,
}: {
  placeholder: string
  disabled?: boolean
  value?: string
  onQueryChange?: (value: string) => void
  onPick: (place: MappedPlace) => void
}) {
  const listId = useId()
  const [inner, setInner] = useState('')
  const query = value ?? inner
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([])
  const [open, setOpen] = useState(false)
  const [enabled, setEnabled] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const session = useRef(newId())
  const boxRef = useRef<HTMLDivElement>(null)

  function setQuery(next: string) {
    if (onQueryChange) onQueryChange(next)
    else setInner(next)
  }

  useEffect(() => {
    void mapsConfigured().then(setEnabled)
  }, [])

  useEffect(() => {
    if (!enabled) return
    const input = query.trim()
    if (input.length < 2) {
      setSuggestions([])
      setError('')
      return
    }
    const timer = window.setTimeout(() => {
      void searchPlaces(input, session.current)
        .then((items) => {
          setSuggestions(items)
          setOpen(true)
          setError('')
        })
        .catch((caught: unknown) => {
          setSuggestions([])
          setError(caught instanceof Error ? caught.message : 'Search failed.')
        })
    }, 250)
    return () => window.clearTimeout(timer)
  }, [enabled, query])

  useEffect(() => {
    function onPointer(event: PointerEvent) {
      if (!boxRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointer)
    return () => document.removeEventListener('pointerdown', onPointer)
  }, [])

  async function pick(suggestion: PlaceSuggestion) {
    setBusy(true)
    setError('')
    try {
      const place = await loadPlace(suggestion.placeId, session.current)
      onPick({ ...place, name: suggestion.name || place.name })
      session.current = newId()
      setQuery('')
      setSuggestions([])
      setOpen(false)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not load that place.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="place-search" ref={boxRef}>
      <input
        className="field"
        value={query}
        disabled={disabled || busy}
        placeholder={placeholder}
        onChange={(event) => setQuery(event.target.value)}
        onFocus={() => {
          if (suggestions.length) setOpen(true)
        }}
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        autoComplete="off"
      />
      {open && suggestions.length > 0 ? (
        <ul id={listId} className="place-suggest" role="listbox">
          {suggestions.map((item) => (
            <li key={item.placeId}>
              <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => void pick(item)}>
                <span>{item.name}</span>
                {item.subtitle ? <small>{item.subtitle}</small> : null}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      {error ? <p className="place-search-error">{error}</p> : null}
    </div>
  )
}
