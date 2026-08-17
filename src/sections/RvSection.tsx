import { useState } from 'react'
import { confirmDelete } from '../confirm'
import { LinkifiedText } from '../components/LinkifiedText'
import { useTripData } from '../data/trip'
import { youtubeThumbUrl } from '../data/youtube'
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
    deleteChecklist,
    deleteNote,
  } = useTripData()
  const [lightbox, setLightbox] = useState<string | null>(null)

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
                  <summary className="card-summary">
                    <span>{note.title}</span>
                    <button
                      type="button"
                      className="icon-btn"
                      aria-label={`Delete ${note.title}`}
                      onClick={(event) => {
                        event.preventDefault()
                        event.stopPropagation()
                        if (confirmDelete(note.title)) deleteNote(note.id)
                      }}
                    >
                      ×
                    </button>
                  </summary>
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
        {composeOpen && <AddNoteSheet onClose={onCloseCompose} />}
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
            <li key={list.id} className="card">
              <details>
                <summary className="card-summary">
                  <span>{list.title}</span>
                  <button
                    type="button"
                    className="icon-btn"
                    aria-label={`Delete ${list.title}`}
                    onClick={(event) => {
                      event.preventDefault()
                      event.stopPropagation()
                      if (confirmDelete(list.title)) deleteChecklist(list.id)
                    }}
                  >
                    ×
                  </button>
                </summary>
                <ul className="check-items">
                  {list.items.map((item) => (
                    <li key={item.id}>
                      <label className={`check-row${item.done ? ' is-done' : ''}`}>
                        <input
                          type="checkbox"
                          checked={item.done}
                          onChange={() => toggleChecklistItem(list.id, item.id)}
                        />
                        <span>{item.text}</span>
                      </label>
                    </li>
                  ))}
                </ul>
                <AddStepRow onAdd={(text) => addChecklistStep(list.id, text)} />
              </details>
            </li>
          ))}
        </ul>
      )}
      {composeOpen && <AddChecklistSheet onClose={onCloseCompose} />}
    </>
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
