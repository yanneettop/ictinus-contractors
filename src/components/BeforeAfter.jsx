const pairs = [
  {
    title: 'Kitchen Refresh',
    before: {
      src: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?q=80&w=800&auto=format&fit=crop',
      alt: 'Kitchen before renovation',
    },
    after: {
      src: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=800&auto=format&fit=crop',
      alt: 'Kitchen after renovation',
    },
    caption: 'Full strip-out and refit with new cabinetry, worktops, and integrated lighting.',
  },
  {
    title: 'Bathroom Re-sealing & Repair',
    before: {
      src: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop',
      alt: 'Bathroom before repair',
    },
    after: {
      src: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=800&auto=format&fit=crop',
      alt: 'Bathroom after repair',
    },
    caption: 'Professional re-sealing, grout repair, and fixture replacement for a clean, lasting finish.',
  },
]

export default function BeforeAfter() {
  return (
    <section className="ict-ba-section">
      <div className="ict-ba-inner">
        <p className="ict-section-label">Transformations</p>
        <h2 className="ict-section-heading">Before &amp; After</h2>
        <p className="ict-section-subtitle">Real improvements. Clean execution. Attention to detail.</p>

        {pairs.map(({ title, before, after, caption }, i) => (
          <div key={title} className="ict-ba-block" data-reveal style={{ transitionDelay: `${i * 120}ms` }}>
            <h3 className="ict-ba-block-title">{title}</h3>
            <div className="ict-ba-images">
              <div className="ict-ba-img-wrap">
                <span className="ict-ba-label before">Before</span>
                <img src={before.src} alt={before.alt} loading="lazy" />
              </div>
              <div className="ict-ba-img-wrap">
                <span className="ict-ba-label after">After</span>
                <img src={after.src} alt={after.alt} loading="lazy" />
              </div>
            </div>
            <p className="ict-ba-caption">{caption}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
