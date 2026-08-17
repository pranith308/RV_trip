import { useState } from 'react'
import { Mountains } from '../components/Mountains'
import { useAuth } from './AuthContext'
import { PinPad } from './PinPad'

type GateMode = 'roster' | 'name' | 'pin' | 'confirm' | 'unlock'

export function PinGate() {
  const { people, createPerson, unlock, enterIfTrusted, isTrusted } = useAuth()
  const [mode, setMode] = useState<GateMode>(people.length ? 'roster' : 'name')
  const [name, setName] = useState('')
  const [pin, setPin] = useState('')
  const [confirm, setConfirm] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const selected = people.find((person) => person.id === selectedId)

  function pickPerson(personId: string) {
    setError('')
    setPin('')
    if (enterIfTrusted(personId)) return
    setSelectedId(personId)
    setMode('unlock')
  }

  function startCreate() {
    setError('')
    setName('')
    setPin('')
    setConfirm('')
    setMode('name')
  }

  function handlePin(next: string) {
    if (busy) return
    setError('')
    setPin(next)
    if (next.length !== 4) return

    if (mode === 'pin') {
      setMode('confirm')
      return
    }

    if (mode === 'unlock' && selectedId) {
      setBusy(true)
      void unlock(selectedId, next).then((ok) => {
        setBusy(false)
        if (!ok) {
          setError('That PIN is not right.')
          setPin('')
        }
      })
    }
  }

  function handleConfirm(next: string) {
    if (busy) return
    setError('')
    setConfirm(next)
    if (next.length !== 4) return

    if (next !== pin) {
      setError('Those PINs did not match. Try again.')
      setPin('')
      setConfirm('')
      setMode('pin')
      return
    }

    setBusy(true)
    void createPerson(name, pin).then((message) => {
      setBusy(false)
      if (message) {
        setError(message)
        setPin('')
        setConfirm('')
        setMode('pin')
      }
    })
  }

  return (
    <div className="gate">
      <div className="poster-frame gate-poster">
        <p className="poster-kicker">Department of Family Adventure</p>
        <Mountains variant="hero" />
        <h1 className="poster-title">The Family Expedition</h1>
        <p className="poster-tag">A first RV journey · eight travelers</p>
        <div className="poster-rule" />

        {mode === 'roster' && (
          <>
            <p className="gate-lead">Welcome, traveler. Choose your name.</p>
            <div className="roster">
              {people.map((person) => (
                <button
                  key={person.id}
                  type="button"
                  className="roster-btn"
                  onClick={() => pickPerson(person.id)}
                >
                  <span className="roster-mark">{person.name.slice(0, 1)}</span>
                  <span className="roster-name">{person.name}</span>
                  {isTrusted(person.id) && (
                    <span className="roster-known">this phone</span>
                  )}
                </button>
              ))}
            </div>
            <button type="button" className="text-btn" onClick={startCreate}>
              + Add a traveler
            </button>
          </>
        )}

        {mode === 'name' && (
          <form
            className="gate-form"
            onSubmit={(event) => {
              event.preventDefault()
              if (!name.trim()) {
                setError('Please enter a name.')
                return
              }
              setError('')
              setMode('pin')
            }}
          >
            <p className="gate-lead">
              {people.length ? 'Add a traveler to the roster.' : 'Create your trail name.'}
            </p>
            <label className="field-label" htmlFor="traveler-name">
              Your name
            </label>
            <input
              id="traveler-name"
              className="field"
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoComplete="nickname"
              autoFocus
              maxLength={20}
              placeholder="First name"
            />
            {error && <p className="gate-error">{error}</p>}
            <button type="submit" className="primary-btn">
              Continue
            </button>
            {people.length > 0 && (
              <button
                type="button"
                className="text-btn"
                onClick={() => {
                  setError('')
                  setMode('roster')
                }}
              >
                Back to roster
              </button>
            )}
          </form>
        )}

        {(mode === 'pin' || mode === 'confirm' || mode === 'unlock') && (
          <div className="gate-form">
            <p className="gate-lead">
              {mode === 'unlock' && `Enter the PIN for ${selected?.name ?? 'this traveler'}.`}
              {mode === 'pin' && 'Choose a 4-digit PIN for this phone.'}
              {mode === 'confirm' && 'Enter that PIN once more.'}
            </p>
            <PinPad
              value={mode === 'confirm' ? confirm : pin}
              onChange={mode === 'confirm' ? handleConfirm : handlePin}
              disabled={busy}
              error={Boolean(error)}
            />
            {error && <p className="gate-error">{error}</p>}
            <button
              type="button"
              className="text-btn"
              onClick={() => {
                setError('')
                setPin('')
                setConfirm('')
                setMode(mode === 'unlock' ? 'roster' : 'name')
              }}
            >
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
