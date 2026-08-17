import { useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useLongPress } from '../hooks/useLongPress'

type DeleteMenuProps = {
  label: string
  onClose: () => void
  onDelete: () => void
  onEdit?: () => void
  onReorder?: () => void
}

export function DeleteMenu({ label, onClose, onDelete, onEdit, onReorder }: DeleteMenuProps) {
  const root = document.getElementById('root')
  if (!root) return null
  const hasExtras = Boolean(onEdit || onReorder)
  return createPortal(
    <div className="sheet" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="action-sheet" onClick={(event) => event.stopPropagation()}>
        <p className="action-copy">{hasExtras ? label : `Delete “${label}”?`}</p>
        {onEdit ? (
          <button type="button" className="action-edit" onClick={onEdit}>
            Edit
          </button>
        ) : null}
        {onReorder ? (
          <button type="button" className="action-reorder" onClick={onReorder}>
            Reorder
          </button>
        ) : null}
        <button type="button" className="action-delete" onClick={onDelete}>
          Delete
        </button>
        <button type="button" className="text-btn" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>,
    root,
  )
}

export function useDeletePress(
  label: string,
  onDelete: () => void,
  onEdit?: () => void,
  onReorder?: () => void,
) {
  const [open, setOpen] = useState(false)
  const press = useLongPress(() => setOpen(true))
  const menu = open ? (
    <DeleteMenu
      label={label}
      onClose={() => setOpen(false)}
      onEdit={
        onEdit
          ? () => {
              setOpen(false)
              onEdit()
            }
          : undefined
      }
      onReorder={
        onReorder
          ? () => {
              setOpen(false)
              onReorder()
            }
          : undefined
      }
      onDelete={() => {
        onDelete()
        setOpen(false)
      }}
    />
  ) : null
  return { press, menu }
}

export function DeletableSummary({
  label,
  onDelete,
  onEdit,
  children,
}: {
  label: string
  onDelete: () => void
  onEdit?: () => void
  children: ReactNode
}) {
  const { press, menu } = useDeletePress(label, onDelete, onEdit)
  return (
    <>
      <summary className="card-summary" {...press}>
        {children}
      </summary>
      {menu}
    </>
  )
}
