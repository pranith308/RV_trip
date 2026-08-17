const URL_SPLIT = /(https?:\/\/[^\s]+)/g

export function LinkifiedText({ text }: { text: string }) {
  if (!text.trim()) return null
  const parts = text.split(URL_SPLIT)
  return (
    <p className="note-text">
      {parts.map((part, index) =>
        part.startsWith('http') ? (
          <a key={`${part}-${index}`} href={part} target="_blank" rel="noreferrer">
            {part}
          </a>
        ) : (
          <span key={`${index}-${part.slice(0, 8)}`}>{part}</span>
        ),
      )}
    </p>
  )
}
