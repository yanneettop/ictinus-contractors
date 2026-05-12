import { motion } from 'motion/react'

const CHECKATRADE_URL = 'https://www.checkatrade.com/trades/ictinuscontractors'
const MYBUILDER_URL = 'https://www.mybuilder.com/profile/ictinus-contractors'

const trustItems = [
  { label: 'Checkatrade 9.97/10', href: CHECKATRADE_URL },
  { label: '33 customer reviews' },
  { label: 'Find us on MyBuilder', href: MYBUILDER_URL },
  { label: 'Free, no-obligation quotes' },
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
          item.href ? (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="ict-hero-trust-item transition-colors hover:text-[#D4AF37] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D4AF37]"
            >
              {item.label}
            </a>
          ) : (
            <span key={item.label} className="ict-hero-trust-item">
              {item.label}
            </span>
          )
        ))}
      </motion.div>
    </section>
  )
}
