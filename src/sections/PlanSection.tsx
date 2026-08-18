import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { CommentIcon } from '../components/CommentIcon'
import { DeletableSummary, useDeletePress } from '../components/DeleteMenu'
import { DirectionsIcon, TurnIcon } from '../components/DirectionsIcon'
import { LinkifiedText } from '../components/LinkifiedText'
import { PlaceSearch } from '../components/PlaceSearch'
import { PlaceWeatherLabel } from '../components/PlaceWeatherLabel'
import { Sheet } from '../components/Sheet'
import {
  formatBookingDays,
  formatDayDate,
  sortBookings,
  sortDays,
  todayInputValue,
  useTripData,
} from '../data/trip'
import {
  formatDriveDistance,
  formatDriveTime,
  isMappedPlace,
  mapsDirectionsUrl,
} from '../maps/client'
import { useDriveLegs } from '../maps/useDriveLegs'
import { usePlaceWeather } from '../weather/usePlaceWeather'
import type { Booking, PlaceDraft, PlanDay, PlanPlace } from '../types'
import { AddBookingSheet } from './AddBookingSheet'

type PlanSectionProps = {
  sub: string
  composeOpen: boolean
  onCloseCompose: () => void
}

export function PlanSection({ sub, composeOpen, onCloseCompose }: PlanSectionProps) {
  if (sub === 'bookings') {
    return <BookingsView composeOpen={composeOpen} onCloseCompose={onCloseCompose} />
  }
  return <DaysView composeOpen={composeOpen} onCloseCompose={onCloseCompose} />
}

function DaysView({
  composeOpen,
  onCloseCompose,
}: {
  composeOpen: boolean
  onCloseCompose: () => void
}) {
  const { days, bookings, addPlace, deleteDay, movePlace, setPlaceDrives, setPlaceWeather } =
    useTripData()
  const ordered = sortDays(days)
  const [openDayId, setOpenDayId] = useState<string | null>(null)
  const [reorderDayId, setReorderDayId] = useState<string | null>(null)
  useDriveLegs(days, setPlaceDrives)
  usePlaceWeather(days, setPlaceWeather)

  return (
    <>
      {ordered.length === 0 ? (
        <p className="empty-hint">Tap + Add day to plan the first date.</p>
      ) : (
        <ol className="day-stack">
          {ordered.map((day) => {
            const label = formatDayDate(day.date)
            const pinned = (bookings ?? []).filter((booking) =>
              (booking.dayIds ?? []).includes(day.id),
            )
            const isOpen = openDayId === day.id
            const isReordering = reorderDayId === day.id
            return (
              <li key={day.id} className="card day-block">
                <details
                  open={isOpen}
                  onToggle={(event) => {
                    const nextOpen = event.currentTarget.open
                    setOpenDayId((current) => {
                      if (nextOpen) return day.id
                      return current === day.id ? null : current
                    })
                    if (!nextOpen) {
                      setReorderDayId((current) => (current === day.id ? null : current))
                    }
                  }}
                >
                  <DeletableSummary
                    label={label}
                    onDelete={() => {
                      deleteDay(day.id)
                      setOpenDayId((current) => (current === day.id ? null : current))
                      setReorderDayId((current) => (current === day.id ? null : current))
                    }}
                  >
                    <h2 className="day-heading">{label}</h2>
                  </DeletableSummary>
                  {pinned.length > 0 && (
                    <ul className="day-booking-list">
                      {pinned.map((booking) => (
                        <li key={booking.id} className="day-booking-row">
                          <span className="day-booking-title">{booking.title}</span>
                          {booking.confirmation ? (
                            <span className="day-booking-code">{booking.confirmation}</span>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  )}
                  {isReordering && (
                    <div className="day-place-tools">
                      <button
                        type="button"
                        className="reorder-toggle is-active"
                        onClick={() => setReorderDayId(null)}
                      >
                        Done reordering
                      </button>
                    </div>
                  )}
                  <ul className="place-list">
                    {day.places.map((place, index) => {
                      const previous = day.places[index - 1]
                      return (
                        <PlaceRow
                          key={place.id}
                          dayId={day.id}
                          dayDate={day.date}
                          place={place}
                          previous={previous}
                          reorderMode={isReordering}
                          canReorder={day.places.length > 1}
                          canMoveUp={index > 0}
                          canMoveDown={index < day.places.length - 1}
                          onMove={(direction) => movePlace(day.id, place.id, direction)}
                          onStartReorder={() => setReorderDayId(day.id)}
                        />
                      )
                    })}
                  </ul>
                  <AddPlaceRow onAdd={(draft) => addPlace(day.id, draft)} />
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

function PlaceRow({
  dayId,
  dayDate,
  place,
  previous,
  reorderMode,
  canReorder,
  canMoveUp,
  canMoveDown,
  onMove,
  onStartReorder,
}: {
  dayId: string
  dayDate: string
  place: PlanPlace
  previous?: PlanPlace
  reorderMode: boolean
  canReorder: boolean
  canMoveUp: boolean
  canMoveDown: boolean
  onMove: (direction: 'up' | 'down') => void
  onStartReorder: () => void
}) {
  const { deletePlace } = useTripData()
  const { press, menu } = useDeletePress(
    place.name,
    () => deletePlace(dayId, place.id),
    undefined,
    canReorder ? onStartReorder : undefined,
  )
  const [notesOpen, setNotesOpen] = useState(false)
  const [notesExpanded, setNotesExpanded] = useState(false)
  const [notesOverflow, setNotesOverflow] = useState(false)
  const notesRef = useRef<HTMLDivElement>(null)
  const notes = place.notes?.trim() ?? ''
  const mapped = isMappedPlace(place)
  const previousMapped = previous && isMappedPlace(previous)
  const drive =
    mapped && previousMapped && place.driveFromPrevious?.fromPlaceId === previous.placeId
      ? place.driveFromPrevious
      : null
  const weatherSnapshot =
    dayDate && mapped && place.weather?.date === dayDate ? place.weather : null

  useEffect(() => {
    setNotesExpanded(false)
  }, [notes])

  useLayoutEffect(() => {
    const container = notesRef.current
    const note = container?.querySelector<HTMLElement>('.note-text')
    if (!container || !note || !notes) {
      setNotesOverflow(false)
      return
    }
    const noteElement = note

    function measure() {
      const width = noteElement.getBoundingClientRect().width
      if (!width) return
      const styles = getComputedStyle(noteElement)
      const clone = noteElement.cloneNode(true) as HTMLElement
      clone.classList.add('note-measure')
      clone.style.width = `${width}px`
      clone.style.font = styles.font
      clone.style.letterSpacing = styles.letterSpacing
      clone.style.lineHeight = styles.lineHeight
      document.body.appendChild(clone)
      const lineHeight = Number.parseFloat(styles.lineHeight)
      setNotesOverflow(clone.scrollHeight > lineHeight * 1.5)
      clone.remove()
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(container)
    return () => observer.disconnect()
  }, [notes])

  return (
    <li className={`place-item${drive && previous ? ' has-leg' : ''}`}>
      {drive && previous ? (
        <a
          className="place-leg"
          href={mapsDirectionsUrl({
            lat: place.lat as number,
            lng: place.lng as number,
          })}
          target="_blank"
          rel="noreferrer"
          onPointerDown={(event) => event.stopPropagation()}
        >
          {formatDriveTime(drive.durationSeconds)}
          <TurnIcon />
          {formatDriveDistance(drive.distanceMeters)}
        </a>
      ) : null}
      <div className="place-row" {...press}>
      {reorderMode ? (
        <div className="place-move-actions">
          <button
            type="button"
            aria-label={`Move ${place.name} up`}
            disabled={!canMoveUp}
            onPointerDown={(event) => event.stopPropagation()}
            onClick={() => onMove('up')}
          >
            ↑
          </button>
          <button
            type="button"
            aria-label={`Move ${place.name} down`}
            disabled={!canMoveDown}
            onPointerDown={(event) => event.stopPropagation()}
            onClick={() => onMove('down')}
          >
            ↓
          </button>
        </div>
      ) : null}
      <div className="place-copy">
        <div className="place-title-row">
          <span className="place-name">{place.name}</span>
          {weatherSnapshot ? <PlaceWeatherLabel weather={weatherSnapshot} /> : null}
        </div>
        {notes ? (
          <div
            ref={notesRef}
            className={`place-note-wrap${notesOverflow && !notesExpanded ? ' is-collapsed' : ''}`}
          >
            <LinkifiedText text={place.notes ?? ''} />
          </div>
        ) : null}
      </div>
      <div className="place-actions">
        {notesOverflow ? (
          <button
            type="button"
            className="note-toggle"
            aria-label={`${notesExpanded ? 'Collapse' : 'Expand'} notes for ${place.name}`}
            aria-expanded={notesExpanded}
            onPointerDown={(event) => event.stopPropagation()}
            onClick={() => setNotesExpanded((current) => !current)}
          >
            {notesExpanded ? '▴' : '▾'}
          </button>
        ) : null}
        {mapped ? (
          <a
            className="directions-btn"
            href={mapsDirectionsUrl({ lat: place.lat as number, lng: place.lng as number })}
            target="_blank"
            rel="noreferrer"
            aria-label={`Directions to ${place.name}`}
            onPointerDown={(event) => event.stopPropagation()}
          >
            <DirectionsIcon />
          </a>
        ) : null}
        <button
          type="button"
          className={`comment-btn${notes ? ' is-filled' : ''}`}
          aria-label={`Notes for ${place.name}`}
          onPointerDown={(event) => event.stopPropagation()}
          onClick={() => setNotesOpen(true)}
        >
          <CommentIcon filled={Boolean(notes)} />
        </button>
      </div>
      {menu}
      {notesOpen && (
        <PlaceNotesSheet dayId={dayId} place={place} onClose={() => setNotesOpen(false)} />
      )}
      </div>
    </li>
  )
}

function PlaceNotesSheet({
  dayId,
  place,
  onClose,
}: {
  dayId: string
  place: PlanPlace
  onClose: () => void
}) {
  const { updatePlace } = useTripData()
  const [name, setName] = useState(place.name)
  const [notes, setNotes] = useState(place.notes ?? '')
  const [mapped, setMapped] = useState<PlaceDraft | null>(
    isMappedPlace(place)
      ? {
          name: place.name,
          placeId: place.placeId,
          address: place.address,
          lat: place.lat,
          lng: place.lng,
        }
      : null,
  )

  return (
    <Sheet
      title="Edit place"
      onClose={onClose}
      onSubmit={() => {
        updatePlace(dayId, place.id, {
          name,
          notes,
          ...(mapped
            ? {
                placeId: mapped.placeId,
                address: mapped.address,
                lat: mapped.lat,
                lng: mapped.lng,
              }
            : { clearLocation: true }),
        })
        onClose()
      }}
      submitLabel="Save"
      disableSubmit={!name.trim()}
    >
      <label className="field-label" htmlFor={`place-name-${place.id}`}>
        Place title
      </label>
      <input
        id={`place-name-${place.id}`}
        className="field"
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Place name"
        autoFocus
      />
      <p className="field-label">Map address</p>
      {mapped?.address ? <p className="place-map-current">{mapped.address}</p> : (
        <p className="place-map-current is-empty">No map pin yet. Search below.</p>
      )}
      <PlaceSearch
        placeholder="Search Google Maps"
        onPick={(next) => {
          setMapped(next)
          if (!name.trim()) setName(next.name)
        }}
      />
      {mapped ? (
        <button type="button" className="text-btn" onClick={() => setMapped(null)}>
          Remove map pin
        </button>
      ) : null}
      <label className="field-label" htmlFor={`place-notes-${place.id}`}>
        Notes
      </label>
      <textarea
        id={`place-notes-${place.id}`}
        className="field field-area"
        rows={8}
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
        placeholder="Hours, parking, links, side trips…"
      />
    </Sheet>
  )
}

function BookingsView({
  composeOpen,
  onCloseCompose,
}: {
  composeOpen: boolean
  onCloseCompose: () => void
}) {
  const { bookings, days, deleteBooking, toggleBookingDay } = useTripData()
  const ordered = sortBookings(bookings ?? [], days)
  const [lightbox, setLightbox] = useState<string | null>(null)
  const [editing, setEditing] = useState<Booking | null>(null)

  return (
    <>
      {ordered.length === 0 ? (
        <p className="empty-hint">Tap + Add booking for confirmations and papers.</p>
      ) : (
        <ul className="stack-list">
          {ordered.map((booking) => {
            const meta = bookingSummaryMeta(booking, days)
            return (
              <li key={booking.id} className="card">
                <details>
                  <DeletableSummary
                    label={booking.title}
                    onDelete={() => deleteBooking(booking.id)}
                    onEdit={() => setEditing(booking)}
                  >
                    <span className="card-summary-copy">
                      {booking.title}
                      {meta ? <span className="booking-summary-meta">{meta}</span> : null}
                    </span>
                  </DeletableSummary>
                  <BookingBody
                    booking={booking}
                    onOpenImage={setLightbox}
                    onToggleDay={(dayId) => toggleBookingDay(booking.id, dayId)}
                    days={days}
                  />
                </details>
              </li>
            )
          })}
        </ul>
      )}
      {(composeOpen || editing) && (
        <AddBookingSheet
          booking={composeOpen ? undefined : (editing ?? undefined)}
          onClose={() => {
            setEditing(null)
            onCloseCompose()
          }}
        />
      )}
      {lightbox && (
        <button type="button" className="lightbox" onClick={() => setLightbox(null)}>
          <img src={lightbox} alt="" />
        </button>
      )}
    </>
  )
}

function BookingBody({
  booking,
  days,
  onOpenImage,
  onToggleDay,
}: {
  booking: Booking
  days: PlanDay[]
  onOpenImage: (src: string) => void
  onToggleDay: (dayId: string) => void
}) {
  const range = formatBookingDays(booking, days)
  const contact = booking.contact.trim()
  const href = contactHref(contact)
  const orderedDays = sortDays(days)

  return (
    <div className="booking-body">
      {booking.confirmation ? <p className="booking-code">{booking.confirmation}</p> : null}
      {range ? <p className="booking-dates">{range}</p> : null}
      {contact ? (
        href ? (
          <a
            className="booking-contact"
            href={href}
            target={href.startsWith('http') ? '_blank' : undefined}
            rel="noreferrer"
          >
            {contact}
          </a>
        ) : (
          <p className="booking-contact">{contact}</p>
        )
      ) : null}
      {booking.images.length > 0 && (
        <div className="thumb-row">
          {booking.images.map((image) => (
            <button
              key={image.id}
              type="button"
              className="thumb-wrap"
              onClick={() => onOpenImage(image.dataUrl)}
            >
              <img src={image.dataUrl} alt="" className="thumb" />
            </button>
          ))}
        </div>
      )}
      <LinkifiedText text={booking.notes} />
      {orderedDays.length > 0 && (
        <>
          <p className="field-label">Show on these days</p>
          <ul className="member-picks">
            {orderedDays.map((day) => (
              <li key={day.id}>
                <label className="check-row">
                  <input
                    type="checkbox"
                    checked={(booking.dayIds ?? []).includes(day.id)}
                    onChange={() => onToggleDay(day.id)}
                  />
                  <span>{formatDayDate(day.date)}</span>
                </label>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

function bookingSummaryMeta(booking: Booking, days: PlanDay[]) {
  const parts = [booking.confirmation, formatBookingDays(booking, days)].filter(Boolean)
  return parts.join(' · ')
}

function contactHref(value: string) {
  const text = value.trim()
  if (!text) return null
  if (/^https?:\/\//i.test(text)) return text
  if (/^www\./i.test(text)) return `https://${text}`
  const digits = text.replace(/[^\d+]/g, '')
  if (digits.replace(/\+/g, '').length >= 7 && /^[\d+().\s-]+$/.test(text)) {
    return `tel:${digits}`
  }
  return null
}

function AddPlaceRow({ onAdd }: { onAdd: (draft: PlaceDraft) => void }) {
  const [name, setName] = useState('')
  return (
    <form
      className="inline-add is-tight place-add"
      onSubmit={(event) => {
        event.preventDefault()
        onAdd({ name })
        setName('')
      }}
    >
      <PlaceSearch
        placeholder="Add a place"
        value={name}
        onQueryChange={setName}
        onPick={(place) => {
          onAdd(place)
          setName('')
        }}
      />
      <button type="submit" className="mini-btn" disabled={!name.trim()}>
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
