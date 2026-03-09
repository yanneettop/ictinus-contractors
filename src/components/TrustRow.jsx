const items = [
  {
    text: 'Fully Insured',
    icon: (
      <path
        strokeLinecap="round" strokeLinejoin="round"
        d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
      />
    ),
  },
  {
    text: 'Clean & Respectful Work',
    icon: (
      <path
        strokeLinecap="round" strokeLinejoin="round"
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    ),
  },
  {
    text: 'Transparent Quote Before Work Starts',
    icon: (
      <path
        strokeLinecap="round" strokeLinejoin="round"
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
      />
    ),
  },
]

export default function TrustRow() {
  return (
    <div className="ict-trust-row">
      <div className="trust-inner">
        {items.map(({ text, icon }, i) => (
          <div key={text} className="ict-trust-item" data-reveal style={{ transitionDelay: `${i * 100}ms` }}>
            <div className="ict-trust-icon">
              <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                {icon}
              </svg>
            </div>
            <span className="ict-trust-text">{text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
