import { useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import { useDeletePress } from '../components/DeleteMenu'
import { Sheet } from '../components/Sheet'
import { fileToJpegDataUrl } from '../data/images'
import { useTripData } from '../data/trip'
import { billBalances, money, sharesFor } from '../bills/split'
import type { BillExpense, Person } from '../types'

type BillsSectionProps = {
  composeOpen: boolean
  onCloseCompose: () => void
}

export function BillsSection({ composeOpen, onCloseCompose }: BillsSectionProps) {
  const { bills = [], addBill, deleteBill } = useTripData()
  const { people } = useAuth()
  const [lightbox, setLightbox] = useState<string | null>(null)

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
              onDelete={() => deleteBill(expense.id)}
              onOpenImage={setLightbox}
            />
          ))}
        </ul>
      )}

      {composeOpen && (
        <AddExpenseSheet
          people={people}
          onClose={onCloseCompose}
          onSave={(expense) => {
            addBill(expense)
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
  const { bills = [] } = useTripData()
  const { people } = useAuth()
  const owed = billBalances(bills, people)

  return (
    <details className="bills-balances">
      <summary>Balances</summary>
      <div className="bills-balances-body">
        {owed.length === 0 ? (
          <p className="bills-balance-row">All square.</p>
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
  )
}

function ExpenseRow({
  expense,
  people,
  onDelete,
  onOpenImage,
}: {
  expense: BillExpense
  people: Person[]
  onDelete: () => void
  onOpenImage: (src: string) => void
}) {
  const payer = people.find((person) => person.id === expense.paidBy)?.name ?? 'Traveler'
  const { press, menu } = useDeletePress(expense.title, onDelete)

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
  onClose,
  onSave,
}: {
  people: Person[]
  onClose: () => void
  onSave: (expense: Omit<BillExpense, 'id' | 'createdAt'>) => void
}) {
  const { current } = useAuth()
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [paidBy, setPaidBy] = useState(current?.id ?? people[0]?.id ?? '')
  const [splitIds, setSplitIds] = useState<string[]>(people.map((person) => person.id))
  const [custom, setCustom] = useState(false)
  const [ratios, setRatios] = useState<Record<string, number>>(
    Object.fromEntries(people.map((person) => [person.id, 1])),
  )
  const [image, setImage] = useState<string | null>(null)
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
      title="Add expense"
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
