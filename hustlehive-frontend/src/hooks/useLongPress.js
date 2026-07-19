import { useRef, useCallback, useState, useEffect } from 'react'

const useLongPress = (delay = 500, revertAfter = 3000) => {
  const timerRef = useRef(null)
  const revertRef = useRef(null)
  const [revealed, setRevealed] = useState(false)

  const start = useCallback(() => {
    timerRef.current = setTimeout(() => {
      setRevealed(true)
    }, delay)
  }, [delay])

  const clear = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  useEffect(() => {
    if (revealed) {
      revertRef.current = setTimeout(() => setRevealed(false), revertAfter)
    }
    return () => {
      if (revertRef.current) clearTimeout(revertRef.current)
    }
  }, [revealed, revertAfter])

  return {
    revealed,
    setRevealed,
    handlers: {
      onTouchStart: start,
      onTouchEnd: clear,
      onTouchMove: clear,
    },
  }
}

export default useLongPress