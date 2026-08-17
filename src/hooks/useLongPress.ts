import { useCallback, useRef, type MouseEvent, type PointerEvent } from 'react'

const MOVE_CANCEL_PX = 12

export function useLongPress(onLongPress: () => void, ms = 500) {
  const timer = useRef(0)
  const origin = useRef<{ x: number; y: number } | null>(null)
  const fired = useRef(false)

  const clear = useCallback(() => {
    window.clearTimeout(timer.current)
    timer.current = 0
    origin.current = null
  }, [])

  const onPointerDown = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      if (event.button !== 0) return
      fired.current = false
      origin.current = { x: event.clientX, y: event.clientY }
      timer.current = window.setTimeout(() => {
        fired.current = true
        onLongPress()
      }, ms)
    },
    [ms, onLongPress],
  )

  const onPointerMove = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      if (!origin.current) return
      const dx = event.clientX - origin.current.x
      const dy = event.clientY - origin.current.y
      if (dx * dx + dy * dy > MOVE_CANCEL_PX * MOVE_CANCEL_PX) clear()
    },
    [clear],
  )

  const suppressIfFired = useCallback((event: MouseEvent<HTMLElement>) => {
    if (!fired.current) return
    event.preventDefault()
    event.stopPropagation()
    window.setTimeout(() => {
      fired.current = false
    }, 0)
  }, [])

  const onContextMenu = useCallback((event: MouseEvent<HTMLElement>) => {
    event.preventDefault()
  }, [])

  const onPointerUp = useCallback(() => {
    clear()
    if (fired.current) {
      window.setTimeout(() => {
        fired.current = false
      }, 400)
    }
  }, [clear])

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel: onPointerUp,
    onClickCapture: suppressIfFired,
    onContextMenu,
  }
}
