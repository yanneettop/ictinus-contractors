import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { trackServiceCtaClick } from '../utils/tracking'

const CHECKATRADE_URL = 'https://www.checkatrade.com/trades/ictinuscontractors'
const MYBUILDER_URL = 'https://www.mybuilder.com/profile/ictinus-contractors'
const GOOGLE_URL = 'https://www.google.com/maps/place/Ictinus+Contractors/@51.565339,0.1147425,11z/data=!3m1!4b1!4m6!3m5!1s0x63d2cc228ef76369:0x5eabc14ee3673111!8m2!3d51.565339!4d0.1147425!16s%2Fg%2F11nj9z39xx?entry=ttu&g_ep=EgoyMDI2MDYyNC4wIKXMDSoASAFQAw%3D%3D'

const trustItems = [
  { label: 'MyBuilder 4.9/5', href: MYBUILDER_URL },
  { label: 'Checkatrade 10/10', href: CHECKATRADE_URL },
  { label: 'Google 5.0/5', href: GOOGLE_URL },
  { label: '12+ years experience', to: '/about' },
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
          ) : item.to ? (
            <Link
              key={item.label}
              to={item.to}
              onClick={() => trackServiceCtaClick({ cta_label: item.label, target_path: item.to, cta_location: 'hero trust row' })}
              className="ict-hero-trust-item transition-colors hover:text-[#D4AF37] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D4AF37]"
            >
              {item.label}
            </Link>
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
