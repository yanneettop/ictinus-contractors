import { motion } from 'motion/react'

const trustItems = [
  'Rated 5★ across MyBuilder & Checkatrade',
  'London refurbishment specialists',
  'Free consultation',
  'Professional, insured workmanship',
]

export default function TrustRow() {
  return (
    <section className="ict-hero-trust-row" aria-label="Ictinus Contractors trust indicators">
      <motion.div
        className="ict-hero-trust-inner"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        {trustItems.map((item) => (
          <span key={item} className="ict-hero-trust-item">
            {item}
          </span>
        ))}
      </motion.div>
    </section>
  )
}
