import { useEffect, useState } from 'react'
import { Sheet } from '../components/Sheet'
import { useDeletePress } from '../components/DeleteMenu'
import { useAuth } from '../auth/AuthContext'
import {
  categoriesForScope,
  itemsForScope,
  parseShopScope,
  useTripData,
} from '../data/trip'
import type { ShopItem, ShopScope } from '../types'

type ShopSectionProps = {
  sub: string
  personId: string
  openCategoryId: string | null
  onOpenCategory: (id: string | null) => void
  categoryComposeOpen: boolean
  onCloseCategoryCompose: () => void
}

export function ShopSection({
  sub,
  personId,
  openCategoryId,
  onOpenCategory,
  categoryComposeOpen,
  onCloseCategoryCompose,
}: ShopSectionProps) {
  const data = useTripData()
  const { deleteShopCategory } = data
  const scope = parseShopScope(sub, personId)
  const categories = categoriesForScope(data, scope)
  const shopItems = itemsForScope(data, scope)
  const doneItems = shopItems.filter((item) => item.done)

  useEffect(() => {
    if (openCategoryId && !categories.some((category) => category.id === openCategoryId)) {
      onOpenCategory(null)
    }
  }, [categories, openCategoryId, onOpenCategory])

  if (categories.length === 0 && doneItems.length === 0) {
    return (
      <>
        <p className="empty-hint">Tap + Add category to start a list.</p>
        {categoryComposeOpen && (
          <AddCategorySheet
            scope={scope}
            onClose={onCloseCategoryCompose}
            onCreated={(id) => {
              onOpenCategory(id)
              onCloseCategoryCompose()
            }}
          />
        )}
      </>
    )
  }

  return (
    <div className="shop-wrap">
      {categories.length === 0 ? (
        <p className="empty-hint">Tap + Add category. Done items stay below.</p>
      ) : (
        <ol className="day-stack">
          {categories.map((category) => {
            const openItems = shopItems.filter(
              (item) => !item.done && item.categoryId === category.id,
            )
            const isOpen = openCategoryId === category.id
            return (
              <li key={category.id} className="card day-block">
                <CategoryHead
                  title={category.title}
                  open={isOpen}
                  onToggle={() => onOpenCategory(isOpen ? null : category.id)}
                  onDelete={() => deleteShopCategory(scope, category.id)}
                />
                {isOpen &&
                  (openItems.length === 0 ? (
                    <p className="shop-cat-empty">Type an item below to add it here.</p>
                  ) : (
                    <ul className="shop-list shop-cat-list">
                      {openItems.map((item) => (
                        <ShopRow key={item.id} item={item} done={false} scope={scope} />
                      ))}
                    </ul>
                  ))}
              </li>
            )
          })}
        </ol>
      )}
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
      {categoryComposeOpen && (
        <AddCategorySheet
          scope={scope}
          onClose={onCloseCategoryCompose}
          onCreated={(id) => {
            onOpenCategory(id)
            onCloseCategoryCompose()
          }}
        />
      )}
    </div>
  )
}

function CategoryHead({
  title,
  open,
  onToggle,
  onDelete,
}: {
  title: string
  open: boolean
  onToggle: () => void
  onDelete: () => void
}) {
  const { press, menu } = useDeletePress(title, onDelete)
  return (
    <>
      <button
        type="button"
        className={`card-summary${open ? ' is-open' : ''}`}
        aria-expanded={open}
        onClick={onToggle}
        {...press}
      >
        <h2 className="day-heading">{title}</h2>
      </button>
      {menu}
    </>
  )
}

function AddCategorySheet({
  scope,
  onClose,
  onCreated,
}: {
  scope: ShopScope
  onClose: () => void
  onCreated: (id: string) => void
}) {
  const { addShopCategory } = useTripData()
  const [title, setTitle] = useState('')

  return (
    <Sheet
      title="New category"
      onClose={onClose}
      onSubmit={() => {
        const category = addShopCategory(scope, title)
        if (category) onCreated(category.id)
      }}
      submitLabel="Save"
      disableSubmit={!title.trim()}
    >
      <label className="field-label" htmlFor="shop-category-title">
        Name
      </label>
      <input
        id="shop-category-title"
        className="field"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Food, gear, kids…"
        autoFocus
      />
    </Sheet>
  )
}

type ShopRowProps = {
  item: ShopItem
  done: boolean
  scope: ShopScope
}

function ShopRow({ item, done, scope }: ShopRowProps) {
  const { current } = useAuth()
  const { toggleShopItem, deleteShopItem } = useTripData()
  const { press, menu } = useDeletePress(item.text, () => deleteShopItem(scope, item.id))
  return (
    <li className={`shop-row${done ? ' is-done' : ''}`} {...press}>
      <div className="shop-copy">
        <span className="shop-text">{item.text}</span>
        {done && item.doneBy ? <span className="shop-by">by {item.doneBy}</span> : null}
      </div>
      <button
        type="button"
        className={`tick-btn${done ? ' is-on' : ''}`}
        onPointerDown={(event) => event.stopPropagation()}
        onClick={() => toggleShopItem(scope, item.id, current?.name)}
        aria-label={done ? `Mark ${item.text} not done` : `Mark ${item.text} done`}
      >
        ✓
      </button>
      {menu}
    </li>
  )
}
