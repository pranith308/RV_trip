import { useState } from 'react'
import { Sheet } from '../components/Sheet'
import { fileToJpegDataUrl } from '../data/images'
import { useTripData } from '../data/trip'
import { parseYouTubeId, youtubeThumbUrl, youtubeWatchUrl } from '../data/youtube'
import { newId } from '../data/store'
import type { NoteImage, NoteVideo } from '../types'

type AddNoteSheetProps = {
  onClose: () => void
}

export function AddNoteSheet({ onClose }: AddNoteSheetProps) {
  const { addNote } = useTripData()
  const [title, setTitle] = useState('')
  const [notes, setNotes] = useState('')
  const [videoInput, setVideoInput] = useState('')
  const [videoError, setVideoError] = useState('')
  const [images, setImages] = useState<NoteImage[]>([])
  const [videos, setVideos] = useState<NoteVideo[]>([])
  const [busy, setBusy] = useState(false)

  async function onFiles(fileList: FileList | null) {
    if (!fileList?.length) return
    setBusy(true)
    try {
      const next: NoteImage[] = []
      for (const file of Array.from(fileList)) {
        next.push({ id: newId(), dataUrl: await fileToJpegDataUrl(file) })
      }
      setImages((current) => [...current, ...next].slice(0, 8))
    } catch {
      setVideoError('Could not read one of those images.')
    } finally {
      setBusy(false)
    }
  }

  function addVideo() {
    const videoId = parseYouTubeId(videoInput)
    if (!videoId) {
      setVideoError('Paste a YouTube link.')
      return
    }
    if (videos.some((video) => video.videoId === videoId)) {
      setVideoInput('')
      setVideoError('')
      return
    }
    setVideos((current) => [
      ...current,
      { id: newId(), videoId, url: youtubeWatchUrl(videoId) },
    ])
    setVideoInput('')
    setVideoError('')
  }

  function submit() {
    if (!title.trim()) return
    addNote({
      title: title.trim(),
      notes: notes.trim(),
      images,
      videos,
    })
    onClose()
  }

  return (
    <Sheet
      title="New how-to / note"
      onClose={onClose}
      onSubmit={submit}
      submitLabel={busy ? 'Working…' : 'Save'}
      disableSubmit={!title.trim() || busy}
    >
      <label className="field-label" htmlFor="note-title">
        Title
      </label>
      <input
        id="note-title"
        className="field"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Turn on the furnace"
        autoFocus
      />

      <label className="field-label" htmlFor="note-images">
        Images
      </label>
      <input
        id="note-images"
        className="field-file"
        type="file"
        accept="image/*"
        multiple
        onChange={(event) => void onFiles(event.target.files)}
      />
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

      <label className="field-label" htmlFor="note-yt">
        YouTube link
      </label>
      <div className="inline-add">
        <input
          id="note-yt"
          className="field"
          value={videoInput}
          onChange={(event) => setVideoInput(event.target.value)}
          placeholder="https://youtu.be/…"
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              addVideo()
            }
          }}
        />
        <button type="button" className="mini-btn" onClick={addVideo}>
          Add
        </button>
      </div>
      {videoError && <p className="gate-error">{videoError}</p>}
      {videos.length > 0 && (
        <div className="thumb-row">
          {videos.map((video) => (
            <button
              key={video.id}
              type="button"
              className="thumb-wrap"
              onClick={() =>
                setVideos((current) => current.filter((item) => item.id !== video.id))
              }
              aria-label="Remove video"
            >
              <img src={youtubeThumbUrl(video.videoId)} alt="" className="thumb" />
              <span className="yt-badge">YT</span>
            </button>
          ))}
        </div>
      )}

      <label className="field-label" htmlFor="note-body">
        Notes & links
      </label>
      <textarea
        id="note-body"
        className="field field-area"
        rows={5}
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
        placeholder="Your steps, reminders, and any other links"
      />
    </Sheet>
  )
}
