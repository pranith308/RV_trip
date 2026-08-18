import type { BillExpense, Person } from '../types'

export function money(value: number) {
  return value.toLocaleString(undefined, { style: 'currency', currency: 'USD' })
}

export function sharesFor(expense: BillExpense) {
  const totalRatio = expense.splitIds.reduce((sum, id) => sum + (expense.ratios[id] || 1), 0)
  if (totalRatio <= 0) return []
  return expense.splitIds.map((id) => ({
    id,
    amount: (expense.amount * (expense.ratios[id] || 1)) / totalRatio,
  }))
}

export function billBalances(expenses: BillExpense[], people: Person[]) {
  const net: Record<string, number> = {}
  for (const person of people) net[person.id] = 0
  for (const expense of expenses) {
    net[expense.paidBy] = (net[expense.paidBy] ?? 0) + expense.amount
    for (const share of sharesFor(expense)) {
      net[share.id] = (net[share.id] ?? 0) - share.amount
    }
  }
  const names = new Map(people.map((person) => [person.id, person.name]))
  return Object.entries(net)
    .map(([id, value]) => ({
      id,
      name: names.get(id) ?? 'Traveler',
      net: value,
    }))
    .filter((person) => Math.abs(person.net) >= 0.005)
}
