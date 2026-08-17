import { useEffect, useState } from 'react'
import { DeletableSummary, useDeletePress } from '../components/DeleteMenu'
import { LinkifiedText } from '../components/LinkifiedText'
import { Sheet } from '../components/Sheet'
import { useTripData } from '../data/trip'
import { youtubeThumbUrl } from '../data/youtube'
import type { ChecklistItem, HowToNote } from '../types'
import { AddChecklistSheet } from './AddChecklistSheet'
import { AddNoteSheet } from './AddNoteSheet'

type RvSectionProps = {
  sub: string
  composeOpen: boolean
  onCloseCompose: () => void
}

export function RvSection({ sub, composeOpen, onCloseCompose }: RvSectionProps) {
  const {
    checklists,
    notes,
    toggleChecklistItem,
    addChecklistStep,
    updateChecklist,
    updateChecklistItem,
    deleteChecklistItem,
    resetChecklist,
    deleteChecklist,
    deleteNote,
  } = useTripData()
  const [lightbox, setLightbox] = useState<string | null>(null)
  const [editingNote, setEditingNote] = useState<HowToNote | null>(null)
  const [editingChecklist, setEditingChecklist] = useState<{ id: string; text: string } | null>(
    null,
  )
  const [editingItem, setEditingItem] = useState<{
    listId: string
    item: ChecklistItem
  } | null>(null)
  const [acknowledged, setAcknowledged] = useState<Set<string>>(() => new Set())

  useEffect(() => {
    const completed = checklists.filter(
      (list) => list.items.length > 0 && list.items.every((item) => item.done),
    )
    if (completed.length === 0) return

    setAcknowledged(new Set(completed.map((list) => list.id)))
    const timers = completed.map((list) =>
      window.setTimeout(() => {
        resetChecklist(list.id)
        setAcknowledged((current) => {
          const next = new Set(current)
          next.delete(list.id)
          return next
        })
      }, 1100),
    )
    return () => timers.forEach((timer) => window.clearTimeout(timer))
  }, [checklists, resetChecklist])

  if (sub === 'notes') {
    return (
      <>
        {notes.length === 0 ? (
          <p className="empty-hint">Tap Create new to add a how-to or note.</p>
        ) : (
          <ul className="stack-list">
            {notes.map((note) => (
              <li key={note.id} className="card">
                <details>
                  <DeletableSummary
                    label={note.title}
                    onDelete={() => deleteNote(note.id)}
                    onEdit={() => setEditingNote(note)}
                  >
                    <span>{note.title}</span>
                  </DeletableSummary>
                  {(note.images.length > 0 || note.videos.length > 0) && (
                    <div className="thumb-row">
                      {note.images.map((image) => (
                        <button
                          key={image.id}
                          type="button"
                          className="thumb-wrap"
                          onClick={() => setLightbox(image.dataUrl)}
                        >
                          <img src={image.dataUrl} alt="" className="thumb" />
                        </button>
                      ))}
                      {note.videos.map((video) => (
                        <a
                          key={video.id}
                          className="thumb-wrap is-link"
                          href={video.url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <img
                            src={youtubeThumbUrl(video.videoId)}
                            alt="YouTube video"
                            className="thumb"
                          />
                          <span className="yt-badge">YT</span>
                        </a>
                      ))}
                    </div>
                  )}
                  <LinkifiedText text={note.notes} />
                </details>
              </li>
            ))}
          </ul>
        )}
        {(composeOpen || editingNote) && (
          <AddNoteSheet
            note={composeOpen ? undefined : (editingNote ?? undefined)}
            onClose={() => {
              setEditingNote(null)
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

  return (
    <>
      {checklists.length === 0 ? (
        <p className="empty-hint">Tap Create new to add a checklist.</p>
      ) : (
        <ul className="stack-list">
          {checklists.map((list) => (
            <li
              key={list.id}
              className={`card checklist-card${acknowledged.has(list.id) ? ' is-acknowledged' : ''}`}
            >
              <details>
                <DeletableSummary
                  label={list.title}
                  onDelete={() => deleteChecklist(list.id)}
                  onEdit={() => setEditingChecklist({ id: list.id, text: list.title })}
                >
                  <span>{list.title}</span>
                </DeletableSummary>
                <ul className="check-items">
                  {list.items.map((item) => (
                    <ChecklistRow
                      key={item.id}
                      item={item}
                      onToggle={() => toggleChecklistItem(list.id, item.id)}
                      onEdit={() => setEditingItem({ listId: list.id, item })}
                      onDelete={() => deleteChecklistItem(list.id, item.id)}
                    />
                  ))}
                </ul>
                <AddStepRow onAdd={(text) => addChecklistStep(list.id, text)} />
              </details>
              {acknowledged.has(list.id) ? (
                <div className="checklist-ack" aria-live="polite">
                  All checked ✓
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      )}
      {composeOpen && <AddChecklistSheet onClose={onCloseCompose} />}
      {editingChecklist ? (
        <EditTextSheet
          title="Edit checklist"
          initialValue={editingChecklist.text}
          onClose={() => setEditingChecklist(null)}
          onSave={(text) => {
            updateChecklist(editingChecklist.id, text)
            setEditingChecklist(null)
          }}
        />
      ) : null}
      {editingItem ? (
        <EditTextSheet
          title="Edit checklist item"
          initialValue={editingItem.item.text}
          onClose={() => setEditingItem(null)}
          onSave={(text) => {
            updateChecklistItem(editingItem.listId, editingItem.item.id, text)
            setEditingItem(null)
          }}
        />
      ) : null}
    </>
  )
}

function ChecklistRow({
  item,
  onToggle,
  onEdit,
  onDelete,
}: {
  item: ChecklistItem
  onToggle: () => void
  onEdit: () => void
  onDelete: () => void
}) {
  const { press, menu } = useDeletePress(item.text, onDelete, onEdit)
  return (
    <li {...press}>
      <label className={`check-row${item.done ? ' is-done' : ''}`}>
        <input type="checkbox" checked={item.done} onChange={onToggle} />
        <span>{item.text}</span>
      </label>
      {menu}
    </li>
  )
}

function EditTextSheet({
  title,
  initialValue,
  onClose,
  onSave,
}: {
  title: string
  initialValue: string
  onClose: () => void
  onSave: (text: string) => void
}) {
  const [text, setText] = useState(initialValue)
  return (
    <Sheet
      title={title}
      onClose={onClose}
      onSubmit={() => onSave(text)}
      submitLabel="Save"
      disableSubmit={!text.trim()}
    >
      <label className="field-label" htmlFor="checklist-edit-text">
        Name
      </label>
      <input
        id="checklist-edit-text"
        className="field"
        value={text}
        onChange={(event) => setText(event.target.value)}
        autoFocus
      />
    </Sheet>
  )
}

function AddStepRow({ onAdd }: { onAdd: (text: string) => void }) {
  const [text, setText] = useState('')
  return (
    <form
      className="inline-add is-tight"
      onSubmit={(event) => {
        event.preventDefault()
        onAdd(text)
        setText('')
      }}
    >
      <input
        className="field"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Add a step"
      />
      <button type="submit" className="mini-btn">
        Add
      </button>
    </form>
  )
}
