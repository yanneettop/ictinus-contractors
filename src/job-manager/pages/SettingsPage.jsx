import { Database, KeyRound, RefreshCcw, ShieldCheck, UserCog } from 'lucide-react'
import { useState } from 'react'
import { useJobManager } from '../context/JobManagerContext'
import { PageHeader } from '../components/UI'

export default function SettingsPage() {
  const { user, users, can, resetData } = useJobManager(); const [confirmReset, setConfirmReset] = useState(false)
  return <>
    <PageHeader eyebrow="Workspace" title="Settings" description="People, permissions and integration readiness." />
    <div className="jm-settings-grid"><section className="jm-settings-card"><div className="jm-settings-icon"><UserCog size={22} /></div><div><h2>Team access</h2><p>The demo uses a simple role model that can map directly to Supabase user profiles.</p><div className="jm-user-list">{users.map((item) => <div key={item.id}><span>{item.name[0]}</span><div><strong>{item.name}{item.id === user.id && <em>You</em>}</strong><small>{item.email}</small></div><b>{item.role === 'administrator' ? 'Administrator' : 'Site manager'}</b></div>)}</div></div></section>
      <section className="jm-settings-card"><div className="jm-settings-icon"><ShieldCheck size={22} /></div><div><h2>Permissions</h2><p>Administrator access includes projects, finances, users and settings. Site managers can update status, tasks and site notes without deleting jobs or editing money.</p><div className="jm-permission-lines"><span><strong>Financial editing</strong><b>{can('edit_financials') ? 'Allowed' : 'Restricted'}</b></span><span><strong>Delete projects</strong><b>{can('delete_projects') ? 'Allowed' : 'Restricted'}</b></span><span><strong>Operational updates</strong><b>Allowed</b></span></div></div></section>
      <section className="jm-settings-card"><div className="jm-settings-icon"><Database size={22} /></div><div><h2>Data storage</h2><p>This version saves to this browser’s localStorage through a repository interface. It is suitable for the demo, not multi-device production use.</p><span className="jm-integration-status"><i />Local data active</span>{can('manage_settings') && (confirmReset ? <div className="jm-reset-confirm"><p>Restore the four seed projects and discard local changes?</p><button className="jm-button jm-button--danger" onClick={() => { resetData(); setConfirmReset(false) }}>Reset demo data</button><button className="jm-button jm-button--secondary" onClick={() => setConfirmReset(false)}>Cancel</button></div> : <button className="jm-button jm-button--secondary" onClick={() => setConfirmReset(true)}><RefreshCcw size={16} />Reset demo data</button>)}</div></section>
      <section className="jm-settings-card"><div className="jm-settings-icon"><KeyRound size={22} /></div><div><h2>Google Calendar</h2><p>The event model and server-side service boundary are ready, but no fake sync is enabled. OAuth and Calendar API credentials must be added securely before connection.</p><span className="jm-integration-status jm-integration-status--off"><i />Not connected</span><button className="jm-button jm-button--secondary" disabled>Connect Google Calendar</button></div></section>
    </div>
  </>
}
