import { getSection, type SectionId } from '../nav'

export type ExtraTab = {
  id: string
  label: string
}

type BottomNavProps = {
  section: SectionId
  sub: string
  extraTabs?: ExtraTab[]
  onSelect: (sub: string) => void
  onCornerAdd?: () => void
}

export function BottomNav({
  section,
  sub,
  extraTabs = [],
  onSelect,
  onCornerAdd,
}: BottomNavProps) {
  const current = getSection(section)
  const tabs = [...current.subs, ...extraTabs]

  if (tabs.length === 0 && !current.cornerAdd) return null

  return (
    <nav className="bottom-nav" aria-label={`${current.fullLabel} sections`}>
      <div className="bottom-nav-tabs">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`bottom-nav-btn${sub === item.id ? ' is-active' : ''}`}
            onClick={() => onSelect(item.id)}
            aria-current={sub === item.id ? 'page' : undefined}
          >
            {item.label}
          </button>
        ))}
      </div>
      {current.cornerAdd && (
        <button
          type="button"
          className="bottom-nav-add"
          onClick={onCornerAdd}
          aria-label="Create group"
        >
          +
        </button>
      )}
    </nav>
  )
}
