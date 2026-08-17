import { getSection, type SectionId } from '../nav'
import { useDeletePress } from '../components/DeleteMenu'

export type ExtraTab = {
  id: string
  label: string
  deletable?: boolean
}

type BottomNavProps = {
  section: SectionId
  sub: string
  extraTabs?: ExtraTab[]
  tabLabels?: Record<string, string>
  onSelect: (sub: string) => void
  onDeleteTab?: (sub: string) => void
  onCornerAdd?: () => void
}

export function BottomNav({
  section,
  sub,
  extraTabs = [],
  tabLabels = {},
  onSelect,
  onDeleteTab,
  onCornerAdd,
}: BottomNavProps) {
  const current = getSection(section)
  const tabs = [...current.subs, ...extraTabs].map((item) => ({
    ...item,
    label: tabLabels[item.id] ?? item.label,
    deletable: 'deletable' in item ? Boolean(item.deletable) : false,
  }))

  if (tabs.length === 0 && !current.cornerAdd) return null

  return (
    <nav className="bottom-nav" aria-label={`${current.fullLabel} sections`}>
      <div className="bottom-nav-tabs">
        {tabs.map((item) => (
          <NavTab
            key={item.id}
            label={item.label}
            active={sub === item.id}
            onSelect={() => onSelect(item.id)}
            onDelete={
              item.deletable && onDeleteTab ? () => onDeleteTab(item.id) : undefined
            }
          />
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

function NavTab({
  label,
  active,
  onSelect,
  onDelete,
}: {
  label: string
  active: boolean
  onSelect: () => void
  onDelete?: () => void
}) {
  const { press, menu } = useDeletePress(label, onDelete ?? (() => {}))
  return (
    <>
      <button
        type="button"
        className={`bottom-nav-btn${active ? ' is-active' : ''}`}
        onClick={onSelect}
        aria-current={active ? 'page' : undefined}
        {...(onDelete ? press : {})}
      >
        {label}
      </button>
      {onDelete ? menu : null}
    </>
  )
}
