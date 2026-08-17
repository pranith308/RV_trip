import { newId, updateTrip } from './store'

export function seedShopEveryone(lines: string[]) {
  const texts = lines.map((line) => line.trim()).filter(Boolean)
  if (texts.length === 0) return 0
  let added = 0
  updateTrip((current) => {
    const categories = [...(current.shopEveryoneCategories ?? [])]
    let food = categories.find((category) => category.title.trim().toLowerCase() === 'food')
    if (!food) {
      food = { id: newId(), title: 'Food', createdAt: new Date().toISOString() }
      categories.push(food)
    }
    const foodId = food.id
    const existing = new Set(
      current.shopEveryone.map((item) => item.text.trim().toLowerCase()),
    )
    const nextItems = [...current.shopEveryone]
    for (const text of texts) {
      if (existing.has(text.toLowerCase())) continue
      existing.add(text.toLowerCase())
      nextItems.push({
        id: newId(),
        text,
        done: false,
        createdAt: new Date().toISOString(),
        categoryId: foodId,
      })
      added += 1
    }
    return {
      ...current,
      shopEveryone: nextItems,
      shopEveryoneCategories: categories,
    }
  })
  return added
}
