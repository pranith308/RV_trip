export function DirectionsIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        d="M12 3 L20 20 L12 16 L4 20 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function TurnIcon({ size = 13 }: { size?: number }) {
  return (
    <svg className="turn-icon" viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path
        d="M8 19 V11 A4 4 0 0 1 12 7 H18 M14.5 4 L18 7 L14.5 10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
