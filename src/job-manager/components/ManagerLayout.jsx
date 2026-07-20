import { Bot, CalendarDays, ChevronDown, CreditCard, Files, FolderKanban, LayoutDashboard, LogOut, Settings, X } from 'lucide-react'
import { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useJobManager } from '../context/JobManagerContext'

const nav = [
  { to: '/job-manager', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/job-manager/assistant', label: 'Assistant', icon: Bot },
  { to: '/job-manager/calendar', label: 'Calendar', icon: CalendarDays },
  { to: '/job-manager/projects', label: 'Projects', icon: FolderKanban },
  { to: '/job-manager/files', label: 'Files', icon: Files },
  { to: '/job-manager/payments', label: 'Payments', icon: CreditCard },
  { to: '/job-manager/settings', label: 'Settings', icon: Settings, mobile: false },
]

export default function ManagerLayout() {
  const { user, logout, error, setError, authMode, realtimeStatus } = useJobManager()
  const [profileOpen, setProfileOpen] = useState(false)
  const location = useLocation()
  const current = nav.slice().reverse().find((item) => location.pathname.startsWith(item.to) && item.to !== '/job-manager') || nav[0]
  return <div className="jm-shell">
    <aside className="jm-sidebar">
      <div className="jm-brand"><div className="jm-brand-mark">I</div><div><strong>Ictinus</strong><span>Job Manager</span></div></div>
      <nav aria-label="Main navigation">{nav.map(({ to, label, icon: Icon, end }) => <NavLink key={to} to={to} end={end}><Icon size={20} /><span>{label}</span></NavLink>)}</nav>
      <div className="jm-sidebar-note"><strong>Private workspace</strong><span>{authMode === 'supabase' ? (realtimeStatus === 'live' ? 'Supabase · Live' : 'Supabase connected') : 'Local demo data'}</span></div>
    </aside>
    <div className="jm-workspace">
      <header className="jm-topbar"><div><span className="jm-topbar-mobile">{current.label}</span><span className="jm-topbar-desktop">Ictinus Contractors · Operations</span></div><div className="jm-profile-wrap"><button className="jm-profile" onClick={() => setProfileOpen((value) => !value)} aria-expanded={profileOpen}><span>{user.name[0]}</span><div><strong>{user.name}</strong><small>{user.role === 'administrator' ? 'Administrator' : 'Site manager'}</small></div><ChevronDown size={16} /></button>{profileOpen && <div className="jm-profile-menu"><button onClick={logout}><LogOut size={16} />Sign out</button></div>}</div></header>
      {error && <div className="jm-alert" role="alert"><span>{error}</span><button onClick={() => setError('')} aria-label="Dismiss"><X size={17} /></button></div>}
      <main className="jm-main"><Outlet /></main>
    </div>
    <nav className="jm-bottom-nav" aria-label="Mobile navigation">{nav.filter((item) => item.mobile !== false).map(({ to, label, icon: Icon, end }) => <NavLink key={to} to={to} end={end}><Icon size={20} /><span>{label}</span></NavLink>)}</nav>
  </div>
}
