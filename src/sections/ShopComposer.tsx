import { useState } from 'react'
import { parseShopScope, useTripData } from '../data/trip'

type ShopComposerProps = {
  sub: string
  personId: string
}

export function ShopComposer({ sub, personId }: ShopComposerProps) {
  const { addShopItem } = useTripData()
  const [text, setText] = useState('')
  const scope = parseShopScope(sub, personId)

  return (
    <form
      className="shop-composer"
      onSubmit={(event) => {
        event.preventDefault()
        addShopItem(scope, text)
        setText('')
      }}
    >
      <input
        className="field shop-input"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Add an item"
        aria-label="Add a shopping item"
      />
      <button type="submit" className="mini-btn is-solid" disabled={!text.trim()}>
        Add
      </button>
    </form>
  )
}
