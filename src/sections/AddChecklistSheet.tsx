import { useState } from 'react'
import { Sheet } from '../components/Sheet'
import { useTripData } from '../data/trip'

type AddChecklistSheetProps = {
  onClose: () => void
}

export function AddChecklistSheet({ onClose }: AddChecklistSheetProps) {
  const { addChecklist } = useTripData()
  const [title, setTitle] = useState('')
  const [steps, setSteps] = useState([''])

  function updateStep(index: number, value: string) {
    setSteps((current) => {
      const next = [...current]
      next[index] = value
      if (index === next.length - 1 && value.trim()) next.push('')
      return next
    })
  }

  function submit() {
    const cleaned = steps.map((step) => step.trim()).filter(Boolean)
    if (!title.trim() || cleaned.length === 0) return
    addChecklist(title, cleaned)
    onClose()
  }

  return (
    <Sheet
      title="New checklist"
      onClose={onClose}
      onSubmit={submit}
      submitLabel="Save"
      disableSubmit={!title.trim() || !steps.some((step) => step.trim())}
    >
      <label className="field-label" htmlFor="list-title">
        Title
      </label>
      <input
        id="list-title"
        className="field"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Sleep"
        autoFocus
      />
      <p className="field-label">Things to do</p>
      <ul className="step-editor">
        {steps.map((step, index) => (
          <li key={index}>
            <input
              className="field"
              value={step}
              onChange={(event) => updateStep(index, event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') event.preventDefault()
              }}
              placeholder={index === 0 ? 'Plug in campground power' : 'Add another'}
            />
          </li>
        ))}
      </ul>
    </Sheet>
  )
}
