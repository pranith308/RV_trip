import { itemsForScope, parseShopScope, useTripData } from '../data/trip'
import type { ShopItem, ShopScope } from '../types'

type ShopSectionProps = {
  sub: string
  personId: string
}

export function ShopSection({ sub, personId }: ShopSectionProps) {
  const data = useTripData()
  const scope = parseShopScope(sub, personId)
  const shopItems = itemsForScope(data, scope)
  const openItems = shopItems.filter((item) => !item.done)
  const doneItems = shopItems.filter((item) => item.done)

  if (shopItems.length === 0) {
    return <p className="empty-hint">Type an item below and hit enter.</p>
  }

  return (
    <div className="shop-wrap">
      <ul className="shop-list">
        {openItems.map((item) => (
          <ShopRow
            key={item.id}
            item={item}
            done={false}
            scope={scope}
          />
        ))}
      </ul>
      {doneItems.length > 0 && (
        <details className="done-group">
          <summary>Done ({doneItems.length})</summary>
          <ul className="shop-list">
            {doneItems.map((item) => (
              <ShopRow key={item.id} item={item} done scope={scope} />
            ))}
          </ul>
        </details>
      )}
    </div>
  )
}

type ShopRowProps = {
  item: ShopItem
  done: boolean
  scope: ShopScope
}

function ShopRow({ item, done, scope }: ShopRowProps) {
  const { toggleShopItem, deleteShopItem } = useTripData()
  return (
    <li className={`shop-row${done ? ' is-done' : ''}`}>
      <span className="shop-text">{item.text}</span>
      <button
        type="button"
        className={`tick-btn${done ? ' is-on' : ''}`}
        onClick={() => toggleShopItem(scope, item.id)}
        aria-label={done ? `Mark ${item.text} not done` : `Mark ${item.text} done`}
      >
        ✓
      </button>
      <button
        type="button"
        className="icon-btn"
        onClick={() => deleteShopItem(scope, item.id)}
        aria-label={`Remove ${item.text}`}
      >
        ×
      </button>
    </li>
  )
}
