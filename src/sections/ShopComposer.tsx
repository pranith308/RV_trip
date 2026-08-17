import { useState } from 'react'
import { parseShopScope, useTripData } from '../data/trip'

type ShopComposerProps = {
  sub: string
  personId: string
  categoryId: string | null
}

export function ShopComposer({ sub, personId, categoryId }: ShopComposerProps) {
  const { addShopItem } = useTripData()
  const [text, setText] = useState('')
  const scope = parseShopScope(sub, personId)
  const canAdd = Boolean(categoryId) && Boolean(text.trim())

  return (
    <form
      className="shop-composer"
      onSubmit={(event) => {
        event.preventDefault()
        if (!categoryId || !text.trim()) return
        addShopItem(scope, text, categoryId)
        setText('')
      }}
    >
      <input
        className="field shop-input"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder={categoryId ? 'Add an item' : 'Open a category first'}
        aria-label="Add a shopping item"
      />
      <button type="submit" className="mini-btn is-solid" disabled={!canAdd}>
        Add
      </button>
    </form>
  )
}
