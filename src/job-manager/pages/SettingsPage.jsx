import { CalendarDays, Database, RefreshCcw, ShieldCheck, UserCog, UserPlus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '../components/UI'
import { useJobManager } from '../context/JobManagerContext'
import { teamService } from '../services/teamService'
import { calendarService } from '../services/calendarService'

export default function SettingsPage() {
  const { user, users, can, resetData, refreshData, authMode } = useJobManager()
  const [confirmReset, setConfirmReset] = useState(false)
  const [teamMessage, setTeamMessage] = useState('')
  const [calendarStatus, setCalendarStatus] = useState(null)
  const [calendars, setCalendars] = useState([])
  const [calendarMessage, setCalendarMessage] = useState(() => {
    const outcome = new URLSearchParams(window.location.search).get('googleCalendar')
    return outcome ? (outcome === 'connected' ? 'Google account connected. Choose the project calendar below.' : 'Google Calendar connection failed. Please try again.') : ''
  })
  const [calendarBusy, setCalendarBusy] = useState(false)

  useEffect(() => {
    if (authMode !== 'supabase' || user.role !== 'administrator') return
    let active = true
    const load = async () => {
      try {
        const status = await calendarService.status()
        if (!active) return
        setCalendarStatus(status)
        if (status.connected) setCalendars((await calendarService.calendars()).calendars)
      } catch (error) {
        if (active) setCalendarMessage(error.message)
      }
    }
    load()
    return () => { active = false }
  }, [authMode, user.role])

  const connectCalendar = async () => {
    setCalendarBusy(true); setCalendarMessage('')
    try { await calendarService.connect() }
    catch (error) { setCalendarMessage(error.message); setCalendarBusy(false) }
  }

  const chooseCalendar = async (event) => {
    const calendarId = event.target.value
    setCalendarBusy(true); setCalendarMessage('')
    try {
      const selection = await calendarService.selectCalendar(calendarId)
      setCalendarStatus((current) => ({ ...current, connected: true, ...selection })); setCalendarMessage('Project calendar saved.')
    } catch (error) { setCalendarMessage(error.message) }
    finally { setCalendarBusy(false) }
  }

  const invite = async (event) => {
    event.preventDefault(); setTeamMessage('')
    const form = event.currentTarget
    try { await teamService.invite(Object.fromEntries(new FormData(form))); await refreshData(); setTeamMessage('Invitation sent successfully.'); form.reset() }
    catch (error) { setTeamMessage(error.message) }
  }

  const toggleAccess = async (member) => {
    setTeamMessage('')
    try { await teamService.setActive(member.id, !member.active); await refreshData(); setTeamMessage(`${member.name} ${member.active ? 'deactivated' : 'activated'}.`) }
    catch (error) { setTeamMessage(error.message) }
  }

  return <>
    <PageHeader eyebrow="Workspace" title="Settings" description="People, permissions and integration readiness." />
    <div className="jm-settings-grid">
      <section className="jm-settings-card"><div className="jm-settings-icon"><UserCog size={22} /></div><div>
        <h2>Team access</h2><p>{authMode === 'supabase' ? 'Invited users authenticate securely and receive permissions from their database profile.' : 'Local demo users are available only on this browser.'}</p>
        <div className="jm-user-list">{users.map((member) => <div key={member.id}><span>{member.name[0]}</span><div><strong>{member.name}{member.id === user.id && <em>You</em>}</strong><small>{member.email}</small></div><b>{member.active === false ? 'Inactive' : member.role === 'administrator' ? 'Administrator' : 'Site manager'}</b>{authMode === 'supabase' && can('manage_settings') && member.id !== user.id && <button className="jm-button jm-button--small jm-button--secondary" type="button" onClick={() => toggleAccess(member)}>{member.active === false ? 'Activate' : 'Deactivate'}</button>}</div>)}</div>
        {authMode === 'supabase' && can('manage_settings') && <form className="jm-team-invite" onSubmit={invite}><h3><UserPlus size={16} />Invite team member</h3><input name="displayName" placeholder="Full name" required minLength="2" /><input name="email" type="email" placeholder="Email address" required /><select name="role"><option value="site_manager">Site manager</option><option value="administrator">Administrator</option></select><button className="jm-button jm-button--primary" type="submit">Send invitation</button>{teamMessage && <p>{teamMessage}</p>}</form>}
      </div></section>
      <section className="jm-settings-card"><div className="jm-settings-icon"><ShieldCheck size={22} /></div><div><h2>Permissions</h2><p>Administrator access includes projects, finances, users and settings. Site managers can update status, tasks and site notes without deleting jobs or editing money.</p><div className="jm-permission-lines"><span><strong>Financial editing</strong><b>{can('edit_financials') ? 'Allowed' : 'Restricted'}</b></span><span><strong>Delete projects</strong><b>{can('delete_projects') ? 'Allowed' : 'Restricted'}</b></span><span><strong>Operational updates</strong><b>Allowed</b></span></div></div></section>
      <section className="jm-settings-card"><div className="jm-settings-icon"><Database size={22} /></div><div><h2>Data storage</h2><p>{authMode === 'supabase' ? 'Projects, tasks, payments and records are stored in the shared Supabase database with row-level security and realtime updates.' : 'Local development mode stores data in this browser. Connect Supabase before production use.'}</p><span className={`jm-integration-status ${authMode === 'supabase' ? '' : 'jm-integration-status--off'}`}><i />{authMode === 'supabase' ? 'Supabase connected' : 'Local data active'}</span>{authMode === 'local' && can('manage_settings') && (confirmReset ? <div className="jm-reset-confirm"><p>Restore the sample project and discard local changes?</p><button className="jm-button jm-button--danger" onClick={() => { resetData(); setConfirmReset(false) }}>Reset demo data</button><button className="jm-button jm-button--secondary" onClick={() => setConfirmReset(false)}>Cancel</button></div> : <button className="jm-button jm-button--secondary" onClick={() => setConfirmReset(true)}><RefreshCcw size={16} />Reset demo data</button>)}</div></section>
      <section className="jm-settings-card"><div className="jm-settings-icon"><CalendarDays size={22} /></div><div><h2>Google Calendar</h2><p>Project events are saved to Ictinus first, then synced to the selected Google calendar in the Europe/London timezone.</p>{authMode === 'supabase' && can('manage_settings') ? <><span className={`jm-integration-status ${calendarStatus?.connected ? '' : 'jm-integration-status--off'}`}><i />{calendarStatus?.connected ? 'Google account connected' : 'Google Calendar not connected'}</span>{calendarStatus?.connected ? <label className="jm-calendar-select"><span>Project events calendar</span><select value={calendarStatus.calendarId || ''} onChange={chooseCalendar} disabled={calendarBusy}><option value="" disabled>Choose a calendar</option>{calendars.map((calendar) => <option value={calendar.id} key={calendar.id}>{calendar.name}{calendar.primary ? ' (Primary)' : ''}</option>)}</select></label> : <button className="jm-button jm-button--secondary" type="button" onClick={connectCalendar} disabled={calendarBusy}>{calendarBusy ? 'Connecting…' : 'Connect Google Calendar'}</button>}{calendarMessage && <p role="status">{calendarMessage}</p>}</> : <span className="jm-integration-status jm-integration-status--off"><i />Administrator setup required</span>}<Link className="jm-button jm-button--secondary" to="/job-manager/calendar">Open calendar</Link></div></section>
    </div>
  </>
}
