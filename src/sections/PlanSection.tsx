import { useState } from 'react'
import { confirmDelete } from '../confirm'
import { Sheet } from '../components/Sheet'
import { formatDayDate, sortDays, todayInputValue, useTripData } from '../data/trip'

type PlanSectionProps = {
  composeOpen: boolean
  onCloseCompose: () => void
}

export function PlanSection({ composeOpen, onCloseCompose }: PlanSectionProps) {
  const { days, addPlace, deleteDay, deletePlace } = useTripData()
  const ordered = sortDays(days)

  return (
    <>
      {ordered.length === 0 ? (
        <p className="empty-hint">Tap + Add day to plan the first date.</p>
      ) : (
        <ol className="day-stack">
          {ordered.map((day) => {
            const label = formatDayDate(day.date)
            return (
              <li key={day.id} className="card day-block">
                <details>
                  <summary className="card-summary">
                    <h2 className="day-heading">{label}</h2>
                    <button
                      type="button"
                      className="icon-btn"
                      aria-label={`Delete ${label}`}
                      onClick={(event) => {
                        event.preventDefault()
                        event.stopPropagation()
                        if (confirmDelete(label)) deleteDay(day.id)
                      }}
                    >
                      ×
                    </button>
                  </summary>
                  <ul className="place-list">
                    {day.places.map((place) => (
                      <li key={place.id} className="place-row">
                        <span>{place.name}</span>
                        <button
                          type="button"
                          className="icon-btn"
                          aria-label={`Remove ${place.name}`}
                          onClick={() => deletePlace(day.id, place.id)}
                        >
                          ×
                        </button>
                      </li>
                    ))}
                  </ul>
                  <AddPlaceRow onAdd={(name) => addPlace(day.id, name)} />
                </details>
              </li>
            )
          })}
        </ol>
      )}
      {composeOpen && <AddDaySheet onClose={onCloseCompose} />}
    </>
  )
}

function AddPlaceRow({ onAdd }: { onAdd: (name: string) => void }) {
  const [name, setName] = useState('')
  return (
    <form
      className="inline-add is-tight"
      onSubmit={(event) => {
        event.preventDefault()
        onAdd(name)
        setName('')
      }}
    >
      <input
        className="field"
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Add a place"
      />
      <button type="submit" className="mini-btn">
        Add
      </button>
    </form>
  )
}

function AddDaySheet({ onClose }: { onClose: () => void }) {
  const { addDay } = useTripData()
  const [date, setDate] = useState(todayInputValue())

  return (
    <Sheet
      title="New day"
      onClose={onClose}
      onSubmit={() => {
        addDay(date)
        onClose()
      }}
      submitLabel="Save"
      disableSubmit={!date}
    >
      <label className="field-label" htmlFor="day-date">
        Date
      </label>
      <input
        id="day-date"
        className="field"
        type="date"
        value={date}
        onChange={(event) => setDate(event.target.value)}
        autoFocus
      />
    </Sheet>
  )
}
