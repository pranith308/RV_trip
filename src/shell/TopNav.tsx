import { SECTIONS, type SectionId } from '../nav'

type TopNavProps = {
  section: SectionId
  onSelect: (id: SectionId) => void
}

export function TopNav({ section, onSelect }: TopNavProps) {
  return (
    <nav className="top-nav" aria-label="Main sections">
      {SECTIONS.map((item) => (
        <button
          key={item.id}
          type="button"
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
