import { CalendarDays, ChevronDown, CreditCard, Files, FolderKanban, LayoutDashboard, LogOut, Settings, UserRoundSearch, X } from 'lucide-react'
import { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useJobManager } from '../context/JobManagerContext'
import AssistantWidget from './AssistantWidget'

const nav = [
  { to: '/job-manager', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/job-manager/calendar', label: 'Calendar', icon: CalendarDays },
  { to: '/job-manager/leads', label: 'Leads', icon: UserRoundSearch },
  { to: '/job-manager/projects', label: 'Projects', icon: FolderKanban },
  { to: '/job-manager/files', label: 'Files', icon: Files },
  { to: '/job-manager/payments', label: 'Payments', icon: CreditCard, permission: 'view_financials' },
  { to: '/job-manager/settings', label: 'Settings', icon: Settings, mobile: false },
]

export default function ManagerLayout() {
  const { user, logout, error, setError, authMode, realtimeStatus, data, can } = useJobManager()
  const [profileOpen, setProfileOpen] = useState(false)
  const location = useLocation()
  const visibleNav = nav.filter((item) => !item.permission || can(item.permission))
  const current = visibleNav.slice().reverse().find((item) => location.pathname.startsWith(item.to) && item.to !== '/job-manager') || visibleNav[0]
  return <div className="jm-shell">
    <aside className="jm-sidebar">
      <div className="jm-brand"><div className="jm-brand-mark jm-brand-mark--logo"><img src="/logo_trans-120.webp" alt="" /></div><div><strong>Ictinus</strong><span>Job Manager</span></div></div>
      <nav aria-label="Main navigation">{visibleNav.map(({ to, label, icon: Icon, end }) => <NavLink key={to} to={to} end={end}><Icon size={20} /><span>{label}</span>{label === 'Leads' && attentionCount(data, user) > 0 && <b className="jm-nav-badge">{attentionCount(data, user)}</b>}</NavLink>)}</nav>
      <div className="jm-sidebar-note"><strong>Private workspace</strong><span>{authMode === 'supabase' ? (realtimeStatus === 'live' ? 'Supabase · Live' : 'Supabase connected') : 'Local demo data'}</span></div>
    </aside>
    <div className="jm-workspace">
      <header className="jm-topbar"><div><span className="jm-topbar-mobile">{current.label}</span><span className="jm-topbar-desktop">Ictinus Contractors · Operations</span></div><div className="jm-profile-wrap"><button className="jm-profile" onClick={() => setProfileOpen((value) => !value)} aria-expanded={profileOpen}><span>{user.name[0]}</span><div><strong>{user.name}</strong><small>{user.role === 'administrator' ? 'Administrator' : 'Site manager'}</small></div><ChevronDown size={16} /></button>{profileOpen && <div className="jm-profile-menu"><button onClick={logout}><LogOut size={16} />Sign out</button></div>}</div></header>
      {error && <div className="jm-alert" role="alert"><span>{error}</span><button onClick={() => setError('')} aria-label="Dismiss"><X size={17} /></button></div>}
      <main className="jm-main"><Outlet /></main>
    </div>
    <nav className="jm-bottom-nav" aria-label="Mobile navigation">{visibleNav.filter((item) => ['Dashboard','Calendar','Leads','Projects','Files'].includes(item.label)).map(({ to, label, icon: Icon, end }) => <NavLink key={to} to={to} end={end}><Icon size={20} /><span>{label}</span>{label === 'Leads' && attentionCount(data, user) > 0 && <b className="jm-nav-badge">{attentionCount(data, user)}</b>}</NavLink>)}</nav>
    <AssistantWidget />
  </div>
}

function attentionCount(data, user) { const now = Date.now(); return data?.leads?.filter((lead) => (user.role === 'administrator' || lead.assignedTo === user.id) && !['Won','Lost','Archived'].includes(lead.stage) && lead.nextActionDueAt && new Date(lead.nextActionDueAt).getTime() <= now).length || 0 }
