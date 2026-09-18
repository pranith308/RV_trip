import type { BillExpense, BillSettlement, Person } from '../types'

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

function netByPerson(expenses: BillExpense[], people: Person[]) {
  const net: Record<string, number> = {}
  for (const person of people) net[person.id] = 0
  for (const expense of expenses) {
    net[expense.paidBy] = (net[expense.paidBy] ?? 0) + expense.amount
    for (const share of sharesFor(expense)) {
      net[share.id] = (net[share.id] ?? 0) - share.amount
    }
  }
  return net
}

export type PersonBalance = {
  id: string
  name: string
  net: number
}

export type SettlementTransfer = {
  fromId: string
  fromName: string
  toId: string
  toName: string
  amount: number
}

export function billBalances(expenses: BillExpense[], people: Person[]): PersonBalance[] {
  const net = netByPerson(expenses, people)
  const names = new Map(people.map((person) => [person.id, person.name]))
  return Object.entries(net)
    .map(([id, value]) => ({
      id,
      name: names.get(id) ?? 'Traveler',
      net: value,
    }))
    .filter((person) => Math.abs(person.net) >= 0.005)
}

export function billBalancesAfterSettlements(
  expenses: BillExpense[],
  settlements: BillSettlement[],
  people: Person[],
): PersonBalance[] {
  const net = netByPerson(expenses, people)
  for (const settlement of settlements) {
    net[settlement.fromPersonId] = (net[settlement.fromPersonId] ?? 0) + settlement.amount
    net[settlement.toPersonId] = (net[settlement.toPersonId] ?? 0) - settlement.amount
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

export function simplifySettlementPlan(balances: PersonBalance[]): SettlementTransfer[] {
  const creditors = balances
    .filter((person) => person.net > 0.005)
    .map((person) => ({ ...person }))
    .sort((a, b) => b.net - a.net)
  const debtors = balances
    .filter((person) => person.net < -0.005)
    .map((person) => ({ ...person }))
    .sort((a, b) => a.net - b.net)

  const transfers: SettlementTransfer[] = []
  let ci = 0
  let di = 0
  while (ci < creditors.length && di < debtors.length) {
    const creditor = creditors[ci]
    const debtor = debtors[di]
    const amount = Math.min(creditor.net, -debtor.net)
    if (amount < 0.005) break
    transfers.push({
      fromId: debtor.id,
      fromName: debtor.name,
      toId: creditor.id,
      toName: creditor.name,
      amount: Math.round(amount * 100) / 100,
    })
    creditor.net -= amount
    debtor.net += amount
    if (creditor.net < 0.005) ci += 1
    if (debtor.net > -0.005) di += 1
  }
  return transfers
}

export function resolvedSettlementPlan(
  expenses: BillExpense[],
  settlements: BillSettlement[],
  people: Person[],
) {
  return simplifySettlementPlan(billBalancesAfterSettlements(expenses, settlements, people))
}
