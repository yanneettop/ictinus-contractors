import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'

const links = [
  { label: 'HOME',         route: '/' },
  { label: 'ABOUT',        route: '/about' },
  { label: 'SERVICES',     route: '/services' },
  { label: 'PORTFOLIO',    route: '/portfolio' },
  { label: 'TESTIMONIALS', id: 'testimonials', route: null },
  { label: 'CONTACT',      route: '/contact' },
]

function ColumnIcon({ className }) {
  return (
    <img
      src="/logo_trans.png"
      alt="Ictinus Contractors logo"
      className={`h-14 md:h-16 w-auto ${className}`}
    />
  )
}

export default function Nav() {
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)
  const navigate                  = useNavigate()
  const location                  = useLocation()
  const isHome                    = location.pathname === '/'

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  const handleLink = (link) => {
    setMenuOpen(false)

    // Section anchor on homepage (e.g. testimonials)
    if (link.id && !link.route) {
      if (isHome) {
        document.getElementById(link.id)?.scrollIntoView({ behavior: 'smooth' })
      } else {
        navigate(`/#${link.id}`)
      }
      return
    }

    // HOME — go to top of homepage
    if (link.route === '/') {
      if (isHome) {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        navigate('/')
      }
      return
    }

    // Page route
    if (link.route) {
      navigate(link.route)
      return
    }
  }

  const navSolid = scrolled || !isHome

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        navSolid
          ? 'bg-[#1C1714]/96 backdrop-blur-lg border-b border-[#D4AF37]/15 shadow-lg shadow-black/10'
          : 'bg-transparent'
      }`}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-[#1C1714]"
      >
        Skip to main content
      </a>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-[4.5rem] flex items-center justify-between gap-6">

        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 flex-shrink-0 group"
          aria-label="Go to homepage"
          onClick={(e) => {
            if (isHome) {
              e.preventDefault()
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }
          }}
        >
          <ColumnIcon className="text-[#D4AF37] transition-colors duration-300" />
          <div className="flex flex-col leading-none text-left">
            <span className="font-['Cormorant_Garamond'] text-[1.3rem] font-semibold tracking-[0.24em] uppercase text-[#D4AF37]">
              ICTINUS
            </span>
            <span className="font-['Cormorant_Garamond'] text-[0.95rem] font-semibold uppercase tracking-[0.10em] mt-[2px] text-[#D4AF37]">
              CONTRACTORS
            </span>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-7 flex-1 justify-center">
          {links.map((link) => {
            const active =
              (link.route && link.route !== '/' && location.pathname === link.route) ||
              (link.route === '/' && isHome)
            return (
              link.route ? (
                <Link
                  key={link.label}
                  to={link.route}
                  onClick={(e) => {
                    if (link.route === '/' && isHome) {
                      e.preventDefault()
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }
                  }}
                  className={`font-['Source_Serif_4'] text-[0.75rem] tracking-[0.14em] uppercase transition-colors duration-200 ${
                    active
                      ? 'text-[#D4AF37]'
                      : navSolid
                      ? 'text-[#C9B09A] hover:text-[#D4AF37]'
                      : 'text-[#E6DCC8]/80 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              ) : (
                <button
                  key={link.label}
                  onClick={() => handleLink(link)}
                  className={`font-['Source_Serif_4'] text-[0.75rem] tracking-[0.14em] uppercase transition-colors duration-200 ${
                    active
                      ? 'text-[#D4AF37]'
                      : navSolid
                      ? 'text-[#C9B09A] hover:text-[#D4AF37]'
                      : 'text-[#E6DCC8]/80 hover:text-white'
                  }`}
                >
                  {link.label}
                </button>
              )
            )
          })}
        </div>

        {/* Phone + GET A QUOTE — desktop */}
        <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
          <a
            href="tel:07586480417"
            className="flex items-center gap-1.5 font-['Source_Serif_4'] text-[0.8rem] tracking-wide text-[#D4AF37] hover:text-[#E8C94A] transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
            </svg>
            07586 480417
          </a>
          <motion.div
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.97 }}
          >
            <Link
              to="/contact"
              className="block font-['Source_Serif_4'] text-[0.75rem] font-semibold tracking-[0.14em] uppercase px-6 py-[0.65rem] rounded-lg bg-gradient-gold text-[#0F1923] shadow-[0_4px_16px_rgba(212,175,55,0.25)]"
            >
              GET A QUOTE
            </Link>
          </motion.div>
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden p-2 ml-auto"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6 text-white transition-colors"
            fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
          >
            {menuOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="lg:hidden bg-[#1C1714] border-t border-[#D4AF37]/15 overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="px-5 py-4 space-y-0.5">
              {links.map((link, i) => (
                link.route ? (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.3 }}
                  >
                    <Link
                      to={link.route}
                      onClick={(e) => {
                        setMenuOpen(false)
                        if (link.route === '/' && isHome) {
                          e.preventDefault()
                          window.scrollTo({ top: 0, behavior: 'smooth' })
                        }
                      }}
                      className="block w-full text-left font-['Source_Serif_4'] text-[0.75rem] tracking-[0.14em] uppercase text-[#C9B09A] py-2.5 hover:text-[#D4AF37] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ) : (
                  <motion.button
                    key={link.label}
                    onClick={() => handleLink(link)}
                    className="block w-full text-left font-['Source_Serif_4'] text-[0.75rem] tracking-[0.14em] uppercase text-[#C9B09A] py-2.5 hover:text-[#D4AF37] transition-colors"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.3 }}
                  >
                    {link.label}
                  </motion.button>
                )
              ))}
              <a
                href="tel:07586480417"
                className="flex items-center justify-center gap-2 w-full font-['Source_Serif_4'] text-[0.8rem] tracking-wide text-[#D4AF37] py-2.5 mt-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
                07586 480417
              </a>
              <Link
                to="/contact"
                onClick={() => setMenuOpen(false)}
                className="block w-full font-['Source_Serif_4'] text-[0.75rem] font-semibold tracking-[0.14em] uppercase px-5 py-3 rounded-lg bg-gradient-gold text-[#1C1714] text-center mt-1"
              >
                GET A QUOTE
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
