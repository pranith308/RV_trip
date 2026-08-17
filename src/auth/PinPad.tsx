import { useEffect, useState } from 'react'

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'back'] as const

type PinPadProps = {
  value: string
  onChange: (next: string) => void
  disabled?: boolean
  error?: boolean
}

export function PinPad({ value, onChange, disabled, error }: PinPadProps) {
  const [pressed, setPressed] = useState<string | null>(null)

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (disabled) return
      if (event.key >= '0' && event.key <= '9') {
        if (value.length < 4) onChange(value + event.key)
      } else if (event.key === 'Backspace') {
        onChange(value.slice(0, -1))
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [disabled, onChange, value])

  function press(key: string) {
    if (disabled || !key) return
    setPressed(key)
    window.setTimeout(() => setPressed(null), 120)
    if (key === 'back') onChange(value.slice(0, -1))
    else if (value.length < 4) onChange(value + key)
  }

  return (
    <div className="pin-pad">
      <div className={`pin-dots${error ? ' is-error' : ''}`} aria-hidden="true">
        {Array.from({ length: 4 }, (_, index) => (
          <span
            key={index}
            className={`pin-dot${index < value.length ? ' is-filled' : ''}`}
          />
        ))}
      </div>
      <div className="pin-keys">
        {KEYS.map((key, index) =>
          key === '' ? (
            <span key={`spacer-${index}`} className="pin-key-spacer" />
          ) : (
            <button
              key={key}
              type="button"
              className={`pin-key${pressed === key ? ' is-pressed' : ''}${key === 'back' ? ' is-back' : ''}`}
              onClick={() => press(key)}
              disabled={disabled}
              aria-label={key === 'back' ? 'Delete' : key}
            >
              {key === 'back' ? '⌫' : key}
            </button>
          ),
        )}
      </div>
    </div>
  )
}
