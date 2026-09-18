import { useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import { useDeletePress } from '../components/DeleteMenu'
import { Sheet } from '../components/Sheet'
import { fileToJpegDataUrl } from '../data/images'
import { useTripData } from '../data/trip'
import {
  billBalances,
  billBalancesAfterSettlements,
  money,
  resolvedSettlementPlan,
  sharesFor,
} from '../bills/split'
import type { BillExpense, BillSettlement, Person } from '../types'

type BillsSectionProps = {
  composeOpen: boolean
  onCloseCompose: () => void
}

export function BillsSection({ composeOpen, onCloseCompose }: BillsSectionProps) {
  const { bills = [], addBill, updateBill, deleteBill } = useTripData()
  const { people } = useAuth()
  const [lightbox, setLightbox] = useState<string | null>(null)
  const [editing, setEditing] = useState<BillExpense | null>(null)

  return (
    <>
      {bills.length === 0 ? (
        <p className="empty-hint">Tap + Add expense to log the first bill.</p>
      ) : (
        <ul className="bills-list">
          {bills.map((expense) => (
            <ExpenseRow
              key={expense.id}
              expense={expense}
              people={people}
              onEdit={() => setEditing(expense)}
              onDelete={() => deleteBill(expense.id)}
              onOpenImage={setLightbox}
            />
          ))}
        </ul>
      )}

      {(composeOpen || editing) && (
        <AddExpenseSheet
          people={people}
          expense={editing}
          onClose={() => {
            setEditing(null)
            onCloseCompose()
          }}
          onSave={(draft) => {
            if (editing) updateBill(editing.id, draft)
            else addBill(draft)
            setEditing(null)
            onCloseCompose()
          }}
        />
      )}

      {lightbox && (
        <button type="button" className="bills-lightbox" onClick={() => setLightbox(null)}>
          <img src={lightbox} alt="Bill" />
        </button>
      )}
    </>
  )
}

export function BillsDock() {
  const { bills = [], billSettlements = [], addBillSettlement, deleteBillSettlement } =
    useTripData()
  const { people, current } = useAuth()
  const [settlementOpen, setSettlementOpen] = useState(false)
  const owed = billBalances(bills, people)
  const afterSettlements = billBalancesAfterSettlements(bills, billSettlements, people)
  const resolved = resolvedSettlementPlan(bills, billSettlements, people)

  return (
    <>
      <details className="bills-balances">
        <summary>Balances</summary>
        <div className="bills-balances-body">
          {owed.length === 0 ? (
            <p className="bills-balance-row">All square from expenses.</p>
          ) : (
            owed.map((person) => (
              <div
                key={person.id}
                className={`bills-balance-row${person.net > 0 ? ' is-owed' : ' is-owes'}`}
              >
                <span>{person.name}</span>
                <span>
                  {person.net > 0 ? `is owed ${money(person.net)}` : `owes ${money(-person.net)}`}
                </span>
              </div>
            ))
          )}
        </div>
      </details>

      <details className="bills-balances">
        <summary>Settlements ({billSettlements.length})</summary>
        <div className="bills-balances-body">
          {billSettlements.length === 0 ? (
            <p className="bills-balance-row">No payments recorded yet.</p>
          ) : (
            billSettlements.map((settlement) => (
              <SettlementRow
                key={settlement.id}
                settlement={settlement}
                people={people}
                onDelete={() => deleteBillSettlement(settlement.id)}
              />
            ))
          )}
          <button
            type="button"
            className="text-btn bills-settlement-add"
            onClick={() => setSettlementOpen(true)}
          >
            + Record payment
          </button>
        </div>
      </details>

      <details className="bills-balances">
        <summary>Resolved</summary>
        <div className="bills-balances-body">
          {afterSettlements.length === 0 ? (
            <p className="bills-balance-row">All square.</p>
          ) : resolved.length === 0 ? (
            <p className="bills-balance-row">Balances still need manual cleanup.</p>
          ) : (
            resolved.map((transfer) => (
              <div key={`${transfer.fromId}-${transfer.toId}`} className="bills-balance-row is-owes">
                <span>
                  {transfer.fromName} → {transfer.toName}
                </span>
                <span>{money(transfer.amount)}</span>
              </div>
            ))
          )}
          {afterSettlements.length > 0 && resolved.length > 0 ? (
            <p className="field-hint">Suggested payments to settle what is left.</p>
          ) : null}
        </div>
      </details>

      {settlementOpen && (
        <AddSettlementSheet
          people={people}
          onClose={() => setSettlementOpen(false)}
          onSave={(draft) => {
            addBillSettlement({ ...draft, createdBy: current?.name })
            setSettlementOpen(false)
          }}
        />
      )}
    </>
  )
}

function SettlementRow({
  settlement,
  people,
  onDelete,
}: {
  settlement: BillSettlement
  people: Person[]
  onDelete: () => void
}) {
  const from = people.find((person) => person.id === settlement.fromPersonId)?.name ?? 'Traveler'
  const to = people.find((person) => person.id === settlement.toPersonId)?.name ?? 'Traveler'
  const { press, menu } = useDeletePress(`${from} paid ${to}`, onDelete)
  return (
    <div className="bills-balance-row is-owes" {...press}>
      <span>
        {from} paid {to}
      </span>
      <span>{money(settlement.amount)}</span>
      {menu}
    </div>
  )
}

function AddSettlementSheet({
  people,
  onClose,
  onSave,
}: {
  people: Person[]
  onClose: () => void
  onSave: (settlement: Omit<BillSettlement, 'id' | 'createdAt' | 'createdBy'>) => void
}) {
  const { current } = useAuth()
  const [fromPersonId, setFromPersonId] = useState(current?.id ?? people[0]?.id ?? '')
  const [toPersonId, setToPersonId] = useState(
    people.find((person) => person.id !== current?.id)?.id ?? people[0]?.id ?? '',
  )
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const parsedAmount = Number.parseFloat(amount)
  const ready =
    Boolean(fromPersonId) &&
    Boolean(toPersonId) &&
    fromPersonId !== toPersonId &&
    Number.isFinite(parsedAmount) &&
    parsedAmount > 0

  return (
    <Sheet
      title="Record payment"
      submitLabel="Save"
      onClose={onClose}
      disableSubmit={!ready}
      onSubmit={() => {
        if (!ready) return
        onSave({
          fromPersonId,
          toPersonId,
          amount: Math.round(parsedAmount * 100) / 100,
          note: note.trim() || undefined,
        })
      }}
    >
      <label className="field-label" htmlFor="settlement-from">
        Who paid
      </label>
      <select
        id="settlement-from"
        className="field"
        value={fromPersonId}
        onChange={(event) => setFromPersonId(event.target.value)}
      >
        {people.map((person) => (
          <option key={person.id} value={person.id}>
            {person.name}
          </option>
        ))}
      </select>

      <label className="field-label" htmlFor="settlement-to">
        Who received
      </label>
      <select
        id="settlement-to"
        className="field"
        value={toPersonId}
        onChange={(event) => setToPersonId(event.target.value)}
      >
        {people.map((person) => (
          <option key={person.id} value={person.id}>
            {person.name}
          </option>
        ))}
      </select>

      <label className="field-label" htmlFor="settlement-amount">
        Amount
      </label>
      <input
        id="settlement-amount"
        className="field"
        inputMode="decimal"
        value={amount}
        onChange={(event) => setAmount(event.target.value)}
        placeholder="0.00"
      />

      <label className="field-label" htmlFor="settlement-note">
        Note (optional)
      </label>
      <input
        id="settlement-note"
        className="field"
        value={note}
        onChange={(event) => setNote(event.target.value)}
        placeholder="Cash, Venmo, etc."
      />
    </Sheet>
  )
}

function ExpenseRow({
  expense,
  people,
  onEdit,
  onDelete,
  onOpenImage,
}: {
  expense: BillExpense
  people: Person[]
  onEdit: () => void
  onDelete: () => void
  onOpenImage: (src: string) => void
}) {
  const payer = people.find((person) => person.id === expense.paidBy)?.name ?? 'Traveler'
  const { press, menu } = useDeletePress(expense.title, onDelete, onEdit)

  return (
    <li className="bills-item" {...press}>
      <div className="bills-item-copy">
        <div className="bills-item-title">
          <span>{expense.title}</span>
          <span>{money(expense.amount)}</span>
        </div>
        <span className="bills-item-meta">{payer}</span>
      </div>
      {expense.image ? (
        <button
          type="button"
          onPointerDown={(event) => event.stopPropagation()}
          onClick={() => onOpenImage(expense.image as string)}
          aria-label={`View bill for ${expense.title}`}
        >
          <img src={expense.image} alt="" className="bills-thumb" />
        </button>
      ) : null}
      {menu}
    </li>
  )
}

function AddExpenseSheet({
  people,
  expense,
  onClose,
  onSave,
}: {
  people: Person[]
  expense?: BillExpense | null
  onClose: () => void
  onSave: (expense: Omit<BillExpense, 'id' | 'createdAt'>) => void
}) {
  const { current } = useAuth()
  const [title, setTitle] = useState(expense?.title ?? '')
  const [amount, setAmount] = useState(expense ? String(expense.amount) : '')
  const [paidBy, setPaidBy] = useState(expense?.paidBy ?? current?.id ?? people[0]?.id ?? '')
  const [splitIds, setSplitIds] = useState<string[]>(
    expense?.splitIds ?? people.map((person) => person.id),
  )
  const equalStart =
    !expense || expense.splitIds.every((id) => (expense.ratios[id] || 1) === 1)
  const [custom, setCustom] = useState(!equalStart)
  const [ratios, setRatios] = useState<Record<string, number>>(
    expense?.ratios ?? Object.fromEntries(people.map((person) => [person.id, 1])),
  )
  const [image, setImage] = useState<string | null>(expense?.image ?? null)
  const [imageError, setImageError] = useState('')

  const parsedAmount = Number.parseFloat(amount)
  const ready =
    Boolean(title.trim()) &&
    Number.isFinite(parsedAmount) &&
    parsedAmount > 0 &&
    splitIds.length > 0 &&
    Boolean(paidBy)

  const preview = ready
    ? sharesFor({
        id: 'preview',
        title,
        amount: parsedAmount,
        paidBy,
        splitIds,
        ratios: custom ? ratios : Object.fromEntries(splitIds.map((id) => [id, 1])),
        image: null,
        createdAt: '',
      })
    : []

  function togglePerson(id: string) {
    setSplitIds((currentIds) => {
      if (currentIds.includes(id)) {
        if (currentIds.length === 1) return currentIds
        return currentIds.filter((item) => item !== id)
      }
      return [...currentIds, id]
    })
  }

  async function onPickFile(file: File | undefined) {
    if (!file) return
    setImageError('')
    try {
      setImage(await fileToJpegDataUrl(file, 1200))
    } catch {
      setImageError('Could not read that image.')
    }
  }

  return (
    <Sheet
      title={expense ? 'Edit expense' : 'Add expense'}
      submitLabel="Save"
      onClose={onClose}
      disableSubmit={!ready}
      onSubmit={() => {
        if (!ready) return
        onSave({
          title: title.trim(),
          amount: Math.round(parsedAmount * 100) / 100,
          paidBy,
          splitIds,
          ratios: Object.fromEntries(
            splitIds.map((id) => [id, custom ? Math.max(0.01, ratios[id] || 1) : 1]),
          ),
          image,
        })
      }}
    >
      <label className="field-label" htmlFor="bill-title">
        What for
      </label>
      <input
        id="bill-title"
        className="field"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Groceries, gas, campsite…"
        autoFocus
      />

      <label className="field-label" htmlFor="bill-amount">
        Total
      </label>
      <input
        id="bill-amount"
        className="field"
        inputMode="decimal"
        value={amount}
        onChange={(event) => setAmount(event.target.value)}
        placeholder="0.00"
      />

      <label className="field-label" htmlFor="bill-payer">
        Who paid
      </label>
      <select
        id="bill-payer"
        className="field"
        value={paidBy}
        onChange={(event) => setPaidBy(event.target.value)}
      >
        {people.map((person) => (
          <option key={person.id} value={person.id}>
            {person.name}
          </option>
        ))}
      </select>

      <p className="field-label">Split with</p>
      <div className="bills-people">
        {people.map((person) => (
          <button
            key={person.id}
            type="button"
            className={`bills-person${splitIds.includes(person.id) ? ' is-on' : ''}`}
            onClick={() => togglePerson(person.id)}
          >
            {person.name}
          </button>
        ))}
      </div>

      <p className="field-label">How to split</p>
      <div className="bills-split-toggle">
        <button type="button" className={!custom ? 'is-on' : ''} onClick={() => setCustom(false)}>
          Equal
        </button>
        <button type="button" className={custom ? 'is-on' : ''} onClick={() => setCustom(true)}>
          Custom shares
        </button>
      </div>

      {custom
        ? splitIds.map((id) => {
            const person = people.find((item) => item.id === id)
            const share = preview.find((item) => item.id === id)?.amount
            return (
              <div key={id} className="bills-share-row">
                <span>{person?.name}</span>
                <input
                  className="field"
                  inputMode="decimal"
                  value={String(ratios[id] ?? 1)}
                  onChange={(event) => {
                    const next = Number.parseFloat(event.target.value)
                    setRatios((currentRatios) => ({
                      ...currentRatios,
                      [id]: Number.isFinite(next) ? next : 0,
                    }))
                  }}
                  aria-label={`${person?.name} share`}
                />
                <span>{share != null ? money(share) : '—'}</span>
              </div>
            )
          })
        : preview.length > 0 && (
            <p className="field-hint">
              {preview
                .map(
                  (item) =>
                    `${people.find((person) => person.id === item.id)?.name} ${money(item.amount)}`,
                )
                .join(' · ')}
            </p>
          )}

      <label className="field-label" htmlFor="bill-photo">
        Bill (optional)
      </label>
      <div className="bills-receipt">
        <input
          id="bill-photo"
          className="field-file"
          type="file"
          accept="image/*"
          onChange={(event) => {
            void onPickFile(event.target.files?.[0])
            event.currentTarget.value = ''
          }}
        />
        {image ? (
          <button type="button" onClick={() => setImage(null)} aria-label="Remove bill photo">
            <img src={image} alt="" className="bills-thumb" />
          </button>
        ) : null}
      </div>
      {imageError ? <p className="gate-error">{imageError}</p> : null}
    </Sheet>
  )
}
