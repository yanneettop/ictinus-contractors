import { Edit3, Plus, Search, Trash2, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { formatDate } from '../utils/format'

export const journalCategories = ['General', 'Client', 'Materials', 'Payments', 'Site', 'Issue', 'Variation', 'Completion']

export default function ProjectJournal({ entries, users, canManage = () => true, onAdd, onUpdate, onDelete, startOpen = false }) {
  const [search, setSearch] = useState(''); const [category, setCategory] = useState('All'); const [editing, setEditing] = useState(null); const [adding, setAdding] = useState(startOpen)
  const filtered = useMemo(() => entries.filter((entry) => (category === 'All' || entry.category === category) && (!search || entry.message.toLowerCase().includes(search.toLowerCase()))).sort((a, b) => b.createdAt.localeCompare(a.createdAt)), [entries, category, search])
  const submit = (event) => { event.preventDefault(); const values = Object.fromEntries(new FormData(event.currentTarget)); if (editing) onUpdate(editing.id, values); else onAdd(values); setAdding(false); setEditing(null) }
  return <section id="project-journal" className="jm-detail-card jm-journal">
    <div className="jm-card-heading"><div><h2>Project journal</h2><p>Chronological site and client notes.</p></div><button className="jm-button jm-button--small jm-button--primary" onClick={() => { setAdding(true); setEditing(null) }}><Plus size={15} />Add note</button></div>
    <div className="jm-journal-tools"><label><Search size={15} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search notes" /></label><select value={category} onChange={(event) => setCategory(event.target.value)}><option>All</option>{journalCategories.map((item) => <option key={item}>{item}</option>)}</select></div>
    {(adding || editing) && <form className="jm-journal-form" onSubmit={submit}><div><select name="category" defaultValue={editing?.category || 'General'}>{journalCategories.map((item) => <option key={item}>{item}</option>)}</select><button type="button" onClick={() => { setAdding(false); setEditing(null) }} aria-label="Close"><X size={17} /></button></div><textarea name="message" defaultValue={editing?.message || ''} placeholder="What happened on the project?" rows="3" required /><button className="jm-button jm-button--primary" type="submit">{editing ? 'Save note' : 'Add to journal'}</button></form>}
    <div className="jm-journal-list">{filtered.map((entry) => { const author = users.find((user) => user.id === entry.userId); const [date, time] = formatDate(entry.createdAt, true).split(','); return <article key={entry.id}><div className="jm-journal-date"><strong>{date}</strong><span>{time}</span></div><div className="jm-journal-entry"><div><span className={`jm-journal-category jm-journal-category--${entry.category.toLowerCase()}`}>{entry.category}</span><small>{author?.name}</small></div><p>{entry.message}</p>{entry.updatedAt !== entry.createdAt && <em>Edited</em>}</div>{canManage(entry) && <div className="jm-row-actions"><button onClick={() => { setEditing(entry); setAdding(false) }} aria-label="Edit note"><Edit3 size={15} /></button><button onClick={() => onDelete(entry.id)} aria-label="Delete note"><Trash2 size={15} /></button></div>}</article> })}{filtered.length === 0 && <p className="jm-empty-copy">No journal notes match these filters.</p>}</div>
  </section>
}
