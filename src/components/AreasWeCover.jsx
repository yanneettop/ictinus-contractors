import { Link } from 'react-router-dom'

const areas = [
  'Hackney', 'Shoreditch', 'Bethnal Green', 'Canary Wharf',
  'Stratford', 'Islington', 'Greenwich', 'Tower Hamlets',
  'Camden', 'Kensington', 'Chelsea', 'Fulham',
  'Southwark', 'Lewisham', 'Brixton', 'Central London',
]

export default function AreasWeCover() {
  return (
    <section className="ict-areas-section">
      <div className="ict-areas-inner">
        <p className="ict-section-label">Coverage</p>
        <h2 className="ict-section-heading">Areas We Cover</h2>
        <p className="ict-areas-copy">
          Based in East London, Ictinus Contractors provides professional decorating, refurbishment, and finishing services across all London boroughs including:
        </p>

        <div className="ict-areas-list" data-reveal>
          {areas.map((area) => (
            <span key={area} className="ict-area-tag">{area}</span>
          ))}
        </div>

        <p className="ict-areas-cta" data-reveal style={{ transitionDelay: '120ms' }}>
          Not sure if we cover your area?{' '}
          <Link to="/contact" style={{ color: '#B08D2A', fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: '2px' }}>
            Submit your postcode
          </Link>{' '}
          and we&rsquo;ll confirm availability.
        </p>
      </div>
    </section>
  )
}
