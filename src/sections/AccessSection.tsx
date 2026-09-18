import { useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import { generateJoinCode } from '../data/access'
import { useTripData } from '../data/trip'

export function AccessSection() {
  const { people, current, removePerson, isHost } = useAuth()
  const { access, updateTripAccess, regenerateJoinCode } = useTripData()
  const [busyId, setBusyId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const host = isHost(current?.id)

  if (!host) {
    return (
      <p className="empty-hint">
        Only the trip host can manage who joins. Ask them for the join code if you need to add
        someone new.
      </p>
    )
  }

  async function copyJoinCode() {
    try {
      await navigator.clipboard.writeText(access.joinCode)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="access-panel">
      <section className="card access-block">
        <h2 className="day-heading">Join code</h2>
        <p className="field-hint">
          Share this code with people you want on the trip. They enter it when creating a traveler.
        </p>
        <p className="access-code" aria-label="Join code">
          {access.joinCode}
        </p>
        <div className="access-actions">
          <button type="button" className="mini-btn" onClick={() => void copyJoinCode()}>
            {copied ? 'Copied' : 'Copy code'}
          </button>
          <button
            type="button"
            className="mini-btn"
            onClick={() => regenerateJoinCode(generateJoinCode())}
          >
            New code
          </button>
        </div>
      </section>

      <section className="card access-block">
        <h2 className="day-heading">New travelers</h2>
        <label className="check-row">
          <input
            type="checkbox"
            checked={access.allowNewTravelers}
            onChange={(event) =>
              updateTripAccess({ allowNewTravelers: event.target.checked })
            }
          />
          <span>Allow new people to join with the code</span>
        </label>
        <p className="field-hint">
          Turn this off when the trip is done so strangers with the link cannot add themselves.
        </p>
      </section>

      <section className="card access-block">
        <h2 className="day-heading">Travelers</h2>
        <ul className="access-roster">
          {people.map((person) => (
            <li key={person.id} className="access-roster-row">
              <div>
                <span className="access-roster-name">{person.name}</span>
                {access.hostPersonId === person.id ? (
                  <span className="access-roster-tag">Host</span>
                ) : null}
              </div>
              {person.id !== current?.id ? (
                <button
                  type="button"
                  className="text-btn access-remove"
                  disabled={busyId === person.id}
                  onClick={() => {
                    setError('')
                    setBusyId(person.id)
                    void removePerson(person.id)
                      .then((message) => {
                        if (message) setError(message)
                      })
                      .finally(() => setBusyId(null))
                  }}
                >
                  Remove
                </button>
              ) : (
                <span className="access-roster-you">You</span>
              )}
            </li>
          ))}
        </ul>
        {error ? <p className="gate-error">{error}</p> : null}
      </section>
    </div>
  )
}
