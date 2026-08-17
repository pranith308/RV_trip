import { useState } from 'react'
import { Sheet } from '../components/Sheet'
import { fileToJpegDataUrl } from '../data/images'
import { formatDayDate, sortDays, useTripData } from '../data/trip'
import { newId } from '../data/store'
import type { Booking, NoteImage } from '../types'

type AddBookingSheetProps = {
  onClose: () => void
  booking?: Booking
}

export function AddBookingSheet({ onClose, booking }: AddBookingSheetProps) {
  const { days, addBooking, updateBooking } = useTripData()
  const ordered = sortDays(days)
  const [title, setTitle] = useState(booking?.title ?? '')
  const [confirmation, setConfirmation] = useState(booking?.confirmation ?? '')
  const [contact, setContact] = useState(booking?.contact ?? '')
  const [notes, setNotes] = useState(booking?.notes ?? '')
  const [images, setImages] = useState<NoteImage[]>(booking?.images ?? [])
  const [dayIds, setDayIds] = useState<string[]>(booking?.dayIds ?? [])
  const [busy, setBusy] = useState(false)
  const [imageError, setImageError] = useState('')

  async function onFiles(fileList: FileList | null) {
    if (!fileList?.length) return
    setBusy(true)
    setImageError('')
    try {
      const next: NoteImage[] = []
      for (const file of Array.from(fileList)) {
        next.push({ id: newId(), dataUrl: await fileToJpegDataUrl(file) })
      }
      setImages((current) => [...current, ...next].slice(0, 8))
    } catch {
      setImageError('Could not read one of those images.')
    } finally {
      setBusy(false)
    }
  }

  function toggleDay(id: string) {
    setDayIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    )
  }

  function submit() {
    if (!title.trim() || dayIds.length === 0) return
    const payload = {
      title: title.trim(),
      confirmation: confirmation.trim(),
      startDate: booking?.startDate ?? '',
      endDate: booking?.endDate ?? '',
      contact: contact.trim(),
      notes: notes.trim(),
      images,
      dayIds,
    }
    if (booking) updateBooking(booking.id, payload)
    else addBooking(payload)
    onClose()
  }

  const canSave = Boolean(title.trim()) && dayIds.length > 0 && !busy

  return (
    <Sheet
      title={booking ? 'Edit booking' : 'New booking'}
      onClose={onClose}
      onSubmit={submit}
      submitLabel={busy ? 'Working…' : 'Save'}
      disableSubmit={!canSave}
    >
      <p className="field-hint">
        Title and at least one day are required. Everything else is optional.
      </p>

      <label className="field-label" htmlFor="booking-title">
        Title <span className="field-required">required</span>
      </label>
      <input
        id="booking-title"
        className="field"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Cruise America, campground, park pass…"
        autoFocus
      />

      <label className="field-label" htmlFor="booking-code">
        Confirmation # <span className="field-optional">optional</span>
      </label>
      <input
        id="booking-code"
        className="field"
        value={confirmation}
        onChange={(event) => setConfirmation(event.target.value)}
        placeholder="Reservation or ticket number"
      />

      <label className="field-label" htmlFor="booking-contact">
        Phone or link <span className="field-optional">optional</span>
      </label>
      <input
        id="booking-contact"
        className="field"
        value={contact}
        onChange={(event) => setContact(event.target.value)}
        placeholder="Phone or https://…"
      />

      <label className="field-label" htmlFor="booking-photos">
        Photo of confirmation <span className="field-optional">optional</span>
      </label>
      <input
        id="booking-photos"
        className="field-file"
        type="file"
        accept="image/*"
        multiple
        onChange={(event) => void onFiles(event.target.files)}
      />
      {imageError && <p className="gate-error">{imageError}</p>}
      {images.length > 0 && (
        <div className="thumb-row">
          {images.map((image) => (
            <button
              key={image.id}
              type="button"
              className="thumb-wrap"
              onClick={() =>
                setImages((current) => current.filter((item) => item.id !== image.id))
              }
              aria-label="Remove image"
            >
              <img src={image.dataUrl} alt="" className="thumb" />
            </button>
          ))}
        </div>
      )}

      <label className="field-label" htmlFor="booking-notes">
        Notes <span className="field-optional">optional</span>
      </label>
      <textarea
        id="booking-notes"
        className="field field-area"
        rows={4}
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
        placeholder="Gate code, check-in time, site number…"
      />

      <p className="field-label">
        Show on these days <span className="field-required">pick at least one</span>
      </p>
      {ordered.length === 0 ? (
        <p className="field-hint">Add a day under Days first, then pin this booking to it.</p>
      ) : (
        <ul className="member-picks">
          {ordered.map((day) => (
            <li key={day.id}>
              <label className="check-row">
                <input
                  type="checkbox"
                  checked={dayIds.includes(day.id)}
                  onChange={() => toggleDay(day.id)}
                />
                <span>{formatDayDate(day.date)}</span>
              </label>
            </li>
          ))}
        </ul>
      )}
    </Sheet>
  )
}
