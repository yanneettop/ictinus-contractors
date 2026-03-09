const pairs = [
  {
    title: 'Living Room Decoration',
    before: {
      src: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?q=80&w=800&auto=format&fit=crop',
      alt: 'Living room before decoration',
    },
    after: {
      src: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=800&auto=format&fit=crop',
      alt: 'Living room after decoration',
    },
    caption: 'Full preparation, plastering repairs, and professional painting for a clean, modern finish.',
  },
  {
    title: 'Bathroom Refurbishment',
    before: {
      src: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop',
      alt: 'Bathroom before refurbishment',
    },
    after: {
      src: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=800&auto=format&fit=crop',
      alt: 'Bathroom after refurbishment',
    },
    caption: 'Complete strip-out and refit including new tiling, fixtures, and all finishing works.',
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
