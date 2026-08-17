import type { ReactNode } from 'react'

type SheetProps = {
  title: string
  onClose: () => void
  onSubmit: () => void
  submitLabel: string
  children: ReactNode
  disableSubmit?: boolean
}

export function Sheet({
  title,
  onClose,
  onSubmit,
  submitLabel,
  children,
  disableSubmit,
}: SheetProps) {
  return (
    <div className="sheet" role="dialog" aria-modal="true" aria-labelledby="sheet-title">
      <form
        className="sheet-card"
        onSubmit={(event) => {
          event.preventDefault()
          if (!disableSubmit) onSubmit()
        }}
      >
        <div className="sheet-head">
          <h2 id="sheet-title">{title}</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <div className="sheet-body">{children}</div>
        <div className="sheet-foot">
          <button type="button" className="text-btn" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="primary-btn" disabled={disableSubmit}>
            {submitLabel}
          </button>
        </div>
      </form>
    </div>
  )
}
