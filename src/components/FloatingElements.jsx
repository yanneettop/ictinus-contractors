import { motion, useReducedMotion } from 'motion/react'

/**
 * Subtle floating gold shapes for dark sections.
 * Renders a few slowly drifting diamonds/circles to add ambient life.
 */
const shapes = [
  { type: 'diamond', size: 6, x: '12%', y: '18%', duration: 18, delay: 0 },
  { type: 'circle', size: 4, x: '85%', y: '25%', duration: 22, delay: 2 },
  { type: 'diamond', size: 5, x: '70%', y: '72%', duration: 20, delay: 4 },
  { type: 'circle', size: 3, x: '25%', y: '80%', duration: 24, delay: 1 },
  { type: 'diamond', size: 4, x: '50%', y: '45%', duration: 26, delay: 3 },
  { type: 'circle', size: 5, x: '92%', y: '60%', duration: 19, delay: 5 },
]

export default function FloatingElements({ count = 6, color = '#D4AF37', opacity = 0.06 }) {
  const prefersReducedMotion = useReducedMotion()
  if (prefersReducedMotion) return null

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {shapes.slice(0, count).map((shape, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: shape.x,
            top: shape.y,
            width: shape.size,
            height: shape.size,
            background: color,
            opacity,
            borderRadius: shape.type === 'circle' ? '50%' : '1px',
            transform: shape.type === 'diamond' ? 'rotate(45deg)' : 'none',
          }}
          animate={{
            y: [0, -20, 0, 15, 0],
            x: [0, 10, -5, 8, 0],
            opacity: [opacity, opacity * 1.8, opacity, opacity * 1.5, opacity],
            scale: [1, 1.3, 0.9, 1.15, 1],
          }}
          transition={{
            duration: shape.duration,
            delay: shape.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}
