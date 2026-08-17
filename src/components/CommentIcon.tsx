export function CommentIcon({ filled = false }: { filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        d="M5 4.75h14A1.25 1.25 0 0 1 20.25 6v9.5A1.25 1.25 0 0 1 19 16.75H9.2L4.75 20.5V6A1.25 1.25 0 0 1 6 4.75Z"
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  )
}
