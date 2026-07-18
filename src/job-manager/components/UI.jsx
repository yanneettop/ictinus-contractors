import { AlertTriangle, ArrowRight, MapPin, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatGBP, mapsUrl } from '../utils/format'

export const statuses = ['Enquiry', 'Quoted', 'Confirmed', 'Scheduled', 'In Progress', 'On Hold', 'Completed', 'Cancelled']

export function StatusBadge({ status }) {
  return <span className={`jm-status jm-status--${status.toLowerCase().replaceAll(' ', '-')}`}><span aria-hidden="true" />{status}</span>
}

export function ProgressBar({ paid = 0, total = 0 }) {
  const percentage = total ? Math.min(100, Math.round((paid / total) * 100)) : 0
  return <div className="jm-progress-wrap"><div className="jm-progress-copy"><span>{percentage}% paid</span><strong>{formatGBP(paid)} of {formatGBP(total)}</strong></div><div className="jm-progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow={percentage}><span style={{ width: `${percentage}%` }} /></div></div>
}

export function PageHeader({ eyebrow, title, description, action }) {
  return <header className="jm-page-header"><div><p className="jm-eyebrow">{eyebrow}</p><h1>{title}</h1>{description && <p>{description}</p>}</div>{action}</header>
}

export function AddProjectButton({ compact = false }) {
  return <Link className="jm-button jm-button--primary" to="/job-manager/projects/new"><Plus size={18} />{compact ? 'Add' : 'Add project'}</Link>
}

export function EmptyState({ title, text, action }) {
  return <div className="jm-empty"><div className="jm-empty-icon"><AlertTriangle size={22} /></div><h3>{title}</h3><p>{text}</p>{action}</div>
}

export function LoadingState() {
  return <div className="jm-loading" role="status"><span /><p>Loading job manager…</p></div>
}

export function AddressLink({ address, postcode, short = false }) {
  return <a className="jm-link-inline" href={mapsUrl(address, postcode)} target="_blank" rel="noreferrer"><MapPin size={15} />{short ? postcode : `${address}, ${postcode}`}</a>
}

export function MetricCard({ icon: Icon, label, value, detail, tone = 'neutral' }) {
  return <article className={`jm-metric jm-metric--${tone}`}><div className="jm-metric-icon"><Icon size={20} /></div><div><p>{label}</p><strong>{value}</strong>{detail && <small>{detail}</small>}</div></article>
}

export function SectionHeading({ title, link, linkLabel = 'View all' }) {
  return <div className="jm-section-heading"><h2>{title}</h2>{link && <Link to={link}>{linkLabel}<ArrowRight size={15} /></Link>}</div>
}
