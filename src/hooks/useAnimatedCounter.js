import { useEffect, useState } from 'react'
import { useInView, useReducedMotion } from 'motion/react'

/**
 * Animates a number from 0 to `end` when the ref enters the viewport.
 * Returns the current display value as a string.
 */
export default function useAnimatedCounter(ref, end, { duration = 1.8, decimals = 0, once = true } = {}) {
  const isInView = useInView(ref, { once, amount: 0.5 })
  const prefersReducedMotion = useReducedMotion()
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!isInView) return
    if (prefersReducedMotion) {
      setValue(end)
      return
    }

    const startTime = performance.now()
    let raf

    function tick(now) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / (duration * 1000), 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(eased * end)

      if (progress < 1) {
        raf = requestAnimationFrame(tick)
      }
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [isInView, end, duration, prefersReducedMotion])

  return value.toFixed(decimals)
}
