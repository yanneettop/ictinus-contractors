import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Save } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { z } from 'zod'
import { useJobManager } from '../context/JobManagerContext'
import { PageHeader, statuses } from '../components/UI'

const schema = z.object({
  clientId: z.string().optional(), clientName: z.string().min(2, 'Enter the client name'), clientPhone: z.string().optional(), clientEmail: z.string().email('Enter a valid email').or(z.literal('')),
  title: z.string().min(3, 'Enter a project title'), projectType: z.string().min(2, 'Enter the project type'), description: z.string().optional(), status: z.string(),
  address: z.string().min(5, 'Enter the full address'), postcode: z.string().min(5, 'Enter a valid postcode'), startDate: z.string().min(1, 'Choose a start date'), endDate: z.string().min(1, 'Choose an end date'),
  estimatedDuration: z.string().optional(), assignedTo: z.string().min(1), contractValue: z.coerce.number().min(0), accessNotes: z.string().optional(), parkingNotes: z.string().optional(), keyStatus: z.string().optional(),
  internalNotes: z.string().optional(), nextAction: z.string().optional(), scopeText: z.string().optional(), provisional: z.boolean().optional(),
}).refine((values) => !values.endDate || !values.startDate || values.endDate >= values.startDate, { path: ['endDate'], message: 'End date must be on or after the start date' })

const defaults = { clientId: '', clientName: '', clientPhone: '', clientEmail: '', title: '', projectType: '', description: '', status: 'Enquiry', address: '', postcode: '', startDate: '', endDate: '', estimatedDuration: '', assignedTo: 'user-konstantinos', contractValue: 0, accessNotes: '', parkingNotes: '', keyStatus: 'Not collected', internalNotes: '', nextAction: '', scopeText: '', provisional: false }

export default function ProjectFormPage() {
  const { id } = useParams(); const navigate = useNavigate(); const { data, users, can, saveProject } = useJobManager()
  const project = id ? data.projects.find((item) => item.id === id) : null
  const client = project ? data.clients.find((item) => item.id === project.clientId) : null
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema), defaultValues: defaults })
  useEffect(() => { if (project) reset({ ...defaults, ...project, clientName: client?.name || '', clientPhone: client?.phone || '', clientEmail: client?.email || '', scopeText: project.scope?.join('\n') || '' }) }, [project, client, reset])
  if (!can('edit_projects')) return <Navigate to={project ? `/job-manager/projects/${id}` : '/job-manager/projects'} replace />
  const submit = async (values) => { const savedId = await saveProject(values, id); navigate(`/job-manager/projects/${savedId}`) }
  const field = (name, label, input) => <label className="jm-field"><span>{label}</span>{input}{errors[name] && <small className="jm-form-error">{errors[name].message}</small>}</label>
  return <>
    <Link className="jm-back-link" to={project ? `/job-manager/projects/${id}` : '/job-manager/projects'}><ArrowLeft size={17} />Back to {project ? 'project' : 'projects'}</Link>
    <PageHeader eyebrow={project ? 'Edit project' : 'New project'} title={project ? project.title : 'Add a project'} description="Keep the core job details concise and useful on site." />
    <form className="jm-project-form" onSubmit={handleSubmit(submit)} noValidate>
      <section className="jm-form-section"><div><h2>Client</h2><p>Contact and ownership details.</p></div><div className="jm-form-grid">{field('clientName', 'Client name', <input {...register('clientName')} />)}{field('clientPhone', 'Phone', <input type="tel" {...register('clientPhone')} />)}{field('clientEmail', 'Email', <input type="email" {...register('clientEmail')} />)}</div></section>
      <section className="jm-form-section"><div><h2>Project details</h2><p>What the job is and where it stands.</p></div><div className="jm-form-grid">{field('title', 'Project title', <input {...register('title')} />)}{field('projectType', 'Project type', <input {...register('projectType')} />)}{field('status', 'Status', <select {...register('status')}>{statuses.map((item) => <option key={item}>{item}</option>)}</select>)}<label className="jm-field jm-field--full"><span>Description</span><textarea rows="3" {...register('description')} /></label><label className="jm-field jm-field--full"><span>Scope · one item per line</span><textarea rows="5" {...register('scopeText')} /></label></div></section>
      <section className="jm-form-section"><div><h2>Location & dates</h2><p>Site, programme and assignment.</p></div><div className="jm-form-grid"><label className="jm-field jm-field--full"><span>Full address</span><input {...register('address')} />{errors.address && <small className="jm-form-error">{errors.address.message}</small>}</label>{field('postcode', 'Postcode', <input {...register('postcode')} />)}{field('startDate', 'Start date', <input type="date" {...register('startDate')} />)}{field('endDate', 'End date', <input type="date" {...register('endDate')} />)}{field('estimatedDuration', 'Estimated duration', <input {...register('estimatedDuration')} />)}{field('assignedTo', 'Assigned to', <select {...register('assignedTo')}>{users.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}</select>)}<label className="jm-checkbox"><input type="checkbox" {...register('provisional')} /><span>Dates are provisional</span></label></div></section>
      <section className="jm-form-section"><div><h2>Operations</h2><p>Useful notes for arriving and working.</p></div><div className="jm-form-grid">{field('contractValue', 'Contract value (£)', <input type="number" min="0" step="1" {...register('contractValue')} />)}{field('keyStatus', 'Key status', <input {...register('keyStatus')} />)}{field('nextAction', 'Next action', <input {...register('nextAction')} />)}<label className="jm-field jm-field--full"><span>Access instructions</span><textarea rows="3" {...register('accessNotes')} /></label><label className="jm-field jm-field--full"><span>Parking information</span><textarea rows="3" {...register('parkingNotes')} /></label><label className="jm-field jm-field--full"><span>Internal notes</span><textarea rows="4" {...register('internalNotes')} /></label></div></section>
      <div className="jm-form-actions"><Link className="jm-button jm-button--secondary" to={project ? `/job-manager/projects/${id}` : '/job-manager/projects'}>Cancel</Link><button className="jm-button jm-button--primary" disabled={isSubmitting} type="submit"><Save size={18} />{isSubmitting ? 'Saving…' : 'Save project'}</button></div>
    </form>
  </>
}
