import { CheckCircle2, Circle } from 'lucide-react'
import { useMemo, useState } from 'react'
import { formatDate, londonDateKey } from '../utils/format'
import { taskMatchesFilter } from '../utils/taskFilters'

export default function ProjectTasks({ tasks, users, onToggle }) {
  const [filter, setFilter] = useState('All')
  const today = londonDateKey()
  const enhanced = useMemo(() => tasks
    .map((task) => ({ ...task, operationalStatus: task.completed ? 'Completed' : task.dueDate < today ? 'Overdue' : 'Pending' }))
    .filter((task) => taskMatchesFilter(task, filter, today))
    .sort((first, second) => first.dueDate.localeCompare(second.dueDate)), [tasks, filter, today])
  const completed = tasks.filter((task) => task.completed).length
  return <section className="jm-detail-card">
    <div className="jm-card-heading"><div><h2>Task checklist</h2><p>{completed} completed · {tasks.length - completed} remaining</p></div><select className="jm-compact-select" value={filter} onChange={(event) => setFilter(event.target.value)}><option>All</option><option>Pending</option><option>Overdue</option><option>Completed</option><option>This week</option><option>Next week</option><option>This month</option></select></div>
    <div className="jm-task-list jm-task-list--enhanced">{enhanced.map((task) => <div key={task.id} className={task.completed ? 'complete' : ''}><button onClick={() => onToggle(task.id)} aria-label={task.completed ? 'Reopen task' : 'Complete task'}>{task.completed ? <CheckCircle2 size={22} /> : <Circle size={22} />}</button><div><strong>{task.title}</strong><span>Due {formatDate(task.dueDate)} · {users.find((user) => user.id === task.assignedTo)?.name}</span></div><em className={`jm-task-status jm-task-status--${task.operationalStatus.toLowerCase()}`}>{task.operationalStatus}</em><em className={`jm-priority jm-priority--${task.priority.toLowerCase()}`}>{task.priority}</em></div>)}{enhanced.length === 0 && <p className="jm-empty-copy">No tasks match this filter.</p>}</div>
  </section>
}
