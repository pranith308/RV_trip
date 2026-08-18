import { useEffect, useRef } from 'react'
import { SECTIONS, type SectionId } from '../nav'

type TopNavProps = {
  section: SectionId
  onSelect: (id: SectionId) => void
}

export function TopNav({ section, onSelect }: TopNavProps) {
  const activeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    activeRef.current?.scrollIntoView({ inline: 'nearest', block: 'nearest' })
  }, [section])

  return (
    <nav className="top-nav" aria-label="Main sections">
      {SECTIONS.map((item) => (
        <button
          key={item.id}
          type="button"
          ref={section === item.id ? activeRef : undefined}
          className={`top-nav-btn${section === item.id ? ' is-active' : ''}`}
          onClick={() => onSelect(item.id)}
          aria-current={section === item.id ? 'page' : undefined}
        >
          {item.label}
        </button>
      ))}
    </nav>
  )
}
