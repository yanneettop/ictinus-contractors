import { Bot, Check, LoaderCircle, RefreshCw, Send, ShieldCheck, Sparkles } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { PageHeader } from '../components/UI'
import { useJobManager } from '../context/JobManagerContext'
import { sendChatMessages } from '../services/chatService'

const welcome = { id: 'welcome', role: 'assistant', content: 'Hello — I can help with projects, tasks, payments, journal notes and the live calendar. What would you like to do?' }
const suggestions = ['Show today’s priorities', 'List overdue tasks', 'Show active projects', 'Show outstanding payments']

export default function AssistantPage() {
  const { user, authMode, refreshData } = useJobManager()
  const storageKey = `ictinus-assistant-${user.id}`
  const [messages, setMessages] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem(storageKey)) || [welcome] } catch { return [welcome] }
  })
  const [draft, setDraft] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const endRef = useRef(null)
  const pendingConfirmation = useMemo(() => messages.at(-1)?.confirmationRequired, [messages])

  useEffect(() => { sessionStorage.setItem(storageKey, JSON.stringify(messages.slice(-30))); endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, storageKey])

  const send = async (text) => {
    const content = text.trim()
    if (!content || sending || authMode !== 'supabase') return
    const userMessage = { id: crypto.randomUUID(), role: 'user', content }
    const conversation = [...messages, userMessage]
    setMessages(conversation); setDraft(''); setSending(true); setError('')
    try {
      const result = await sendChatMessages(conversation)
      const confirmationRequired = result.actions?.some((action) => action.code === 'CONFIRMATION_REQUIRED')
      setMessages((current) => [...current, { id: result.responseId || crypto.randomUUID(), role: 'assistant', content: result.message, actions: result.actions || [], confirmationRequired }])
      if (result.actions?.some((action) => action.success)) await refreshData()
    } catch (chatError) { setError(chatError.message) }
    finally { setSending(false) }
  }

  const clear = () => { setMessages([welcome]); setError(''); sessionStorage.removeItem(storageKey) }

  return <div className="jm-assistant-page">
    <PageHeader eyebrow="Private AI workspace" title="Operations Assistant" description="Ask about live jobs or make audited updates in English, Greek or Greeklish." action={<button className="jm-button jm-button--secondary" onClick={clear}><RefreshCw size={16} />New chat</button>} />
    <section className="jm-assistant-shell">
      <header className="jm-assistant-status"><span><Sparkles size={16} /></span><div><strong>Ictinus Assistant</strong><small>Live project tools · Role-aware access</small></div><em><i />Online</em></header>
      <div className="jm-assistant-messages" aria-live="polite">
        {messages.map((message) => <article key={message.id} className={`jm-assistant-message jm-assistant-message--${message.role}`}>
          {message.role === 'assistant' && <span><Bot size={17} /></span>}
          <div><p>{message.content}</p>{message.actions?.length > 0 && <small><Check size={12} />{message.actions.filter((action) => action.success).length ? 'Live data updated' : 'No changes made'}</small>}</div>
        </article>)}
        {sending && <article className="jm-assistant-message jm-assistant-message--assistant"><span><Bot size={17} /></span><div className="jm-assistant-thinking"><i /><i /><i /></div></article>}
        <div ref={endRef} />
      </div>
      {messages.length === 1 && <div className="jm-assistant-suggestions">{suggestions.filter((item) => user.role === 'administrator' || !/payment/i.test(item)).map((item) => <button key={item} onClick={() => send(item)}>{item}</button>)}</div>}
      {pendingConfirmation && <div className="jm-assistant-confirm"><ShieldCheck size={18} /><div><strong>Explicit confirmation required</strong><span>Review the assistant’s message before continuing.</span></div><button onClick={() => send('I explicitly confirm the proposed action. Please retry it with confirmed=true.')}>Confirm change</button></div>}
      {error && <div className="jm-assistant-error" role="alert">{error}</div>}
      <form className="jm-assistant-composer" onSubmit={(event) => { event.preventDefault(); send(draft) }}>
        <textarea value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); send(draft) } }} placeholder={authMode === 'supabase' ? 'Ask about a project or request an update…' : 'Connect Supabase to use the assistant.'} rows="2" disabled={sending || authMode !== 'supabase'} maxLength="8000" />
        <button type="submit" disabled={!draft.trim() || sending || authMode !== 'supabase'} aria-label="Send message">{sending ? <LoaderCircle className="jm-spin" size={19} /> : <Send size={19} />}</button>
      </form>
      <footer><ShieldCheck size={13} />Sensitive changes always require confirmation. Responses may contain mistakes; verify important details.</footer>
    </section>
  </div>
}

