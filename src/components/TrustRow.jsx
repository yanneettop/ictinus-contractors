const items = [
  {
    stat: '9.97/10',
    text: 'Checkatrade',
    icon: (
      <path
        strokeLinecap="round" strokeLinejoin="round"
        d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
      />
    ),
  },
  {
    stat: '4.9/5',
    text: 'MyBuilder',
    icon: (
      <path
        strokeLinecap="round" strokeLinejoin="round"
        d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3.75a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 5.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.228.22.442.396.632a2.248 2.248 0 002.269.869l.164-.042c.025-.334.18-.654.43-.86a.5.5 0 00-.212-.87l-.164-.041a3.75 3.75 0 01-2.883-2.688M5.904 18.75l-.071.252"
      />
    ),
  },
  {
    stat: '30+',
    text: 'Verified Reviews',
    icon: (
      <path
        strokeLinecap="round" strokeLinejoin="round"
        d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
      />
    ),
  },
  {
    stat: '12+',
    text: 'Years Experience',
    icon: (
      <path
        strokeLinecap="round" strokeLinejoin="round"
        d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    ),
  },
  {
    stat: '',
    text: 'Free Estimates',
    icon: (
      <path
        strokeLinecap="round" strokeLinejoin="round"
        d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
      />
    ),
  },
]

export default function TrustRow() {
  return (
    <div className="ict-trust-row">
      <div className="trust-inner trust-inner-5">
        {items.map(({ stat, text, icon }, i) => (
          <div key={text} className="ict-trust-item" data-reveal style={{ transitionDelay: `${i * 80}ms` }}>
            <div className="ict-trust-icon">
              <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                {icon}
              </svg>
            </div>
            <div className="ict-trust-content">
              {stat && <span className="ict-trust-stat">{stat}</span>}
              <span className="ict-trust-text">{text}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
