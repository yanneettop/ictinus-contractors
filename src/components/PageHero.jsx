import { useState, useEffect } from 'react'

export default function PageHero({ title, subtitle, breadcrumb }) {
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 50)
    return () => clearTimeout(t)
  }, [])

  return (
    <section className="relative bg-[#1C1714] overflow-hidden">
      {/* Subtle texture */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
      {/* Gold accent line at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-14 sm:pb-20 text-center">
        {breadcrumb && (
          <p className={`font-['Plus_Jakarta_Sans'] text-[0.75rem] uppercase tracking-[0.15em] text-[#D4AF37]/70 mb-4 transition-all duration-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
            {breadcrumb}
          </p>
        )}
        <h1 className={`font-['Cormorant_Garamond'] text-[2rem] sm:text-[2.75rem] lg:text-[3.5rem] font-bold text-white leading-[1.1] tracking-[-0.01em] mb-5 transition-all duration-700 delay-100 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {title}
        </h1>
        {subtitle && (
          <p className={`font-['Source_Serif_4'] text-[1rem] sm:text-[1.0625rem] text-[#B8AFA6] leading-[1.75] max-w-2xl mx-auto transition-all duration-700 delay-200 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {subtitle}
          </p>
        )}
      </div>
    </section>
  )
}
