import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const links = [
  { label: 'HOME',         id: 'top',          route: '/' },
  { label: 'ABOUT',        id: 'about',         route: null },
  { label: 'SERVICES',     id: null,            route: '/services' },
  { label: 'PORTFOLIO',    id: 'portfolio',     route: null },
  { label: 'TESTIMONIALS', id: 'testimonials',  route: null },
  { label: 'CONTACT',      id: 'quote',         route: null },
]

function ColumnIcon({ className }) {
  return (
    <img
      src="/logo2.png"
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
  const isServicesPage            = location.pathname === '/services'

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Close mobile menu and reset scroll position on route change
  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  const handleLink = (link) => {
    setMenuOpen(false)

    // Link has its own page route (e.g. /services)
    if (link.route && link.route !== '/') {
      navigate(link.route)
      return
    }

    // HOME — go to top of homepage
    if (link.id === 'top' || link.route === '/') {
      if (location.pathname === '/') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        navigate('/')
      }
      return
    }

    // Section anchor — scroll if on homepage, navigate with hash otherwise
    if (location.pathname === '/') {
      document.getElementById(link.id)?.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate(`/#${link.id}`)
    }
  }

  const handleQuote = () => {
    setMenuOpen(false)
    if (location.pathname === '/') {
      document.getElementById('quote')?.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate('/#quote')
    }
  }

  const navSolid = scrolled || isServicesPage

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        navSolid
          ? 'bg-[#1C1714]/96 backdrop-blur-lg border-b border-[#D4AF37]/15 shadow-lg shadow-black/10'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-[4.5rem] flex items-center justify-between gap-6">

        {/* Logo */}
        <button
          onClick={() => handleLink({ id: 'top', route: '/' })}
          className="flex items-center gap-3 flex-shrink-0 group"
          aria-label="Go to homepage"
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
        </button>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-7 flex-1 justify-center">
          {links.map((link) => {
            const active =
              (link.route === '/services' && isServicesPage) ||
              (link.route === '/'         && !isServicesPage && location.pathname === '/')
            return (
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
          })}
        </div>

        {/* GET A QUOTE button — desktop */}
        <button
          onClick={handleQuote}
          className="hidden lg:block flex-shrink-0 font-['Source_Serif_4'] text-[0.75rem] font-semibold tracking-[0.14em] uppercase px-6 py-[0.65rem] rounded-lg bg-gradient-gold text-[#0F1923] transition-all duration-200 hover:-translate-y-0.5 shadow-[0_4px_16px_rgba(212,175,55,0.25)]"
        >
          GET A QUOTE
        </button>

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
      <div
        className={`lg:hidden bg-[#1C1714] border-t border-[#D4AF37]/15 overflow-hidden transition-all duration-300 ${
          menuOpen ? 'max-h-96 py-4' : 'max-h-0'
        }`}
      >
        <div className="px-5 space-y-0.5">
          {links.map((link) => (
            <button
              key={link.label}
              onClick={() => handleLink(link)}
              className="block w-full text-left font-['Source_Serif_4'] text-[0.75rem] tracking-[0.14em] uppercase text-[#C9B09A] py-2.5 hover:text-[#D4AF37] transition-colors"
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={handleQuote}
            className="block w-full font-['Source_Serif_4'] text-[0.75rem] font-semibold tracking-[0.14em] uppercase px-5 py-3 rounded-lg bg-gradient-gold text-[#1C1714] text-center mt-3"
          >
            GET A QUOTE
          </button>
        </div>
      </div>
    </nav>
  )
}
