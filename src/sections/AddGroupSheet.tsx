import { useState } from 'react'
import { Sheet } from '../components/Sheet'
import { useAuth } from '../auth/AuthContext'
import { useTripData } from '../data/trip'

type AddGroupSheetProps = {
  onClose: () => void
  onCreated: (groupId: string) => void
}

export function AddGroupSheet({ onClose, onCreated }: AddGroupSheetProps) {
  const { people, current } = useAuth()
  const { addGroup } = useTripData()
  const [title, setTitle] = useState('')
  const [memberIds, setMemberIds] = useState<string[]>(
    current ? [current.id] : [],
  )

  function toggleMember(id: string) {
    if (id === current?.id) return
    setMemberIds((ids) =>
      ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id],
    )
  }

  function submit() {
    if (!title.trim() || !current) return
    const members = [...new Set([current.id, ...memberIds])]
    const group = addGroup(title, members)
    onCreated(group.id)
  }

  return (
    <Sheet
      title="New group"
      onClose={onClose}
      onSubmit={submit}
      submitLabel="Create"
      disableSubmit={!title.trim()}
    >
      <label className="field-label" htmlFor="group-title">
        Title
      </label>
      <input
        id="group-title"
        className="field"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Women, snacks crew…"
        autoFocus
      />
      <p className="field-label">Members</p>
      <ul className="member-picks">
        {people.map((person) => {
          const checked = memberIds.includes(person.id)
          const locked = person.id === current?.id
          return (
            <li key={person.id}>
              <label className="check-row">
                <input
                  type="checkbox"
                  checked={checked}
                  disabled={locked}
                  onChange={() => toggleMember(person.id)}
                />
                <span>
                  {person.name}
                  {locked ? ' (you)' : ''}
                </span>
              </label>
            </li>
          )
        })}
      </ul>
    </Sheet>
  )
}
