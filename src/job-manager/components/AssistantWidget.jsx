import { Bot, Check, LoaderCircle, MessageCircle, Minus, RefreshCw, Send, ShieldCheck, Sparkles } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useJobManager } from '../context/JobManagerContext'
import { sendChatMessages } from '../services/chatService'

const welcome = { id: 'welcome', role: 'assistant', content: 'Hello — I can help with projects, tasks, payments, journal notes and the live calendar. What would you like to do?' }
const suggestions = ['Show today’s priorities', 'List overdue tasks', 'Show active projects', 'Show outstanding payments']

function storedValue(key, fallback) {
  try {
    const stored = localStorage.getItem(key) ?? sessionStorage.getItem(key)
    return JSON.parse(stored) ?? fallback
  } catch { return fallback }
}

export default function AssistantWidget() {
  const { user, authMode, refreshData } = useJobManager()
  const messagesKey = `ictinus-assistant-${user.id}`
  const openKey = `ictinus-assistant-open-${user.id}`
  const [open, setOpen] = useState(() => storedValue(openKey, false))
  const [messages, setMessages] = useState(() => storedValue(messagesKey, [welcome]))
  const [draft, setDraft] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const endRef = useRef(null)
  const inputRef = useRef(null)
  const pendingConfirmation = useMemo(() => messages.at(-1)?.confirmationRequired, [messages])

  useEffect(() => { localStorage.setItem(messagesKey, JSON.stringify(messages.slice(-30))) }, [messages, messagesKey])
  useEffect(() => { localStorage.setItem(openKey, JSON.stringify(open)) }, [open, openKey])
  useEffect(() => {
    if (!open) return undefined
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 120)
    const closeOnEscape = (event) => { if (event.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', closeOnEscape)
    return () => { window.clearTimeout(focusTimer); window.removeEventListener('keydown', closeOnEscape) }
  }, [open, messages, sending])

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

  const clear = () => { setMessages([welcome]); setDraft(''); setError(''); localStorage.removeItem(messagesKey) }

  if (!open) return <button className="jm-assistant-launcher" type="button" onClick={() => setOpen(true)} aria-label="Open Ictinus Assistant">
    <MessageCircle size={24} /><span>Assistant</span><i aria-hidden="true" />
  </button>

  return <aside className="jm-assistant-widget" aria-label="Ictinus Assistant" aria-live="polite">
    <section className="jm-assistant-shell jm-assistant-shell--widget">
      <header className="jm-assistant-status">
        <span><Sparkles size={16} /></span>
        <div><strong>Ictinus Assistant</strong><small>Live project tools · Available on every page</small></div>
        <em><i />Online</em>
        <button type="button" onClick={clear} title="New chat" aria-label="Start a new chat"><RefreshCw size={16} /></button>
        <button type="button" onClick={() => setOpen(false)} title="Minimise" aria-label="Minimise assistant"><Minus size={18} /></button>
      </header>
      <div className="jm-assistant-messages">
        {messages.map((message) => <article key={message.id} className={`jm-assistant-message jm-assistant-message--${message.role}`}>
          {message.role === 'assistant' && <span><Bot size={17} /></span>}
          <div><p>{message.content}</p>{message.actions?.length > 0 && <small><Check size={12} />{message.actions.some((action) => action.success) ? 'Live data updated' : 'No changes made'}</small>}</div>
        </article>)}
        {sending && <article className="jm-assistant-message jm-assistant-message--assistant"><span><Bot size={17} /></span><div className="jm-assistant-thinking"><i /><i /><i /></div></article>}
        <div ref={endRef} />
      </div>
      {messages.length === 1 && <div className="jm-assistant-suggestions">{suggestions.filter((item) => user.role === 'administrator' || !/payment/i.test(item)).map((item) => <button type="button" key={item} onClick={() => send(item)}>{item}</button>)}</div>}
      {pendingConfirmation && <div className="jm-assistant-confirm"><ShieldCheck size={18} /><div><strong>Explicit confirmation required</strong><span>Review the assistant’s message before continuing.</span></div><button type="button" onClick={() => send('I explicitly confirm the proposed action. Please retry it with confirmed=true.')}>Confirm change</button></div>}
      {error && <div className="jm-assistant-error" role="alert">{error}</div>}
      <form className="jm-assistant-composer" onSubmit={(event) => { event.preventDefault(); send(draft) }}>
        <textarea ref={inputRef} value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); send(draft) } }} placeholder={authMode === 'supabase' ? 'Ask about a project or request an update…' : 'Connect Supabase to use the assistant.'} rows="2" disabled={sending || authMode !== 'supabase'} maxLength="8000" />
        <button type="submit" disabled={!draft.trim() || sending || authMode !== 'supabase'} aria-label="Send message">{sending ? <LoaderCircle className="jm-spin" size={19} /> : <Send size={19} />}</button>
      </form>
      <footer><ShieldCheck size={13} />Sensitive changes require confirmation. Verify important details.</footer>
    </section>
  </aside>
}
