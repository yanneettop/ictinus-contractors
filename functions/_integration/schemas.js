import { z } from 'zod'

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use an ISO date in YYYY-MM-DD format.')
const dateTime = z.string().datetime({ offset: true })
const money = z.number().finite().nonnegative().max(100000000)
const shortText = z.string().trim().min(1).max(240)
const optionalText = (maximum = 4000) => z.string().trim().max(maximum).optional()
const ukPostcode = z.string().trim().min(2).max(16).regex(/^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i, 'Use a valid UK postcode.')

export const projectLookupSchema = z.object({
  id: z.string().uuid().optional(),
  clientName: z.string().trim().min(1).max(160).optional(),
  postcode: ukPostcode.optional(),
  name: z.string().trim().min(1).max(240).optional(),
}).strict().refine((value) => value.id || value.clientName || value.postcode || value.name, {
  message: 'Provide id, clientName, postcode, or name.',
})

const projectStatuses = ['Enquiry', 'Quoted', 'Confirmed', 'Scheduled', 'In Progress', 'On Hold', 'Completed', 'Cancelled']
const statusLookup = new Map(projectStatuses.map((status) => [status.toLowerCase(), status]))
const projectStatus = z.string().transform((value, context) => {
  const status = statusLookup.get(value.trim().toLowerCase())
  if (!status) context.addIssue({ code: 'custom', message: `Use one of: ${projectStatuses.join(', ')}.` })
  return status
})

export const projectPatchSchema = z.object({
  project: projectLookupSchema.optional(),
  title: shortText.optional(),
  projectType: shortText.optional(),
  description: optionalText(),
  status: projectStatus.optional(),
  address: shortText.optional(),
  postcode: ukPostcode.optional(),
  startDate: isoDate.optional(),
  endDate: isoDate.optional(),
  estimatedDuration: z.string().trim().max(120).optional(),
  contractValue: money.optional(),
  accessNotes: optionalText(),
  parkingNotes: optionalText(),
  keyStatus: z.string().trim().max(120).optional(),
  internalNotes: optionalText(),
  nextAction: z.string().trim().max(500).optional(),
  scope: z.array(z.string().trim().min(1).max(240)).max(100).optional(),
  provisional: z.boolean().optional(),
  confirmed: z.boolean().optional(),
}).strict().refine((value) => Object.keys(value).some((key) => !['project', 'confirmed'].includes(key)), {
  message: 'Provide at least one project field to update.',
})

export const taskCreateSchema = z.object({
  project: projectLookupSchema.optional(),
  title: shortText,
  dueDate: isoDate,
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  assignedTo: z.string().trim().min(1).max(160).nullable().optional(),
  completed: z.boolean().default(false),
}).strict()

export const taskPatchSchema = z.object({
  title: shortText.optional(),
  dueDate: isoDate.optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  assignedTo: z.string().trim().min(1).max(160).nullable().optional(),
  completed: z.boolean().optional(),
}).strict().refine((value) => Object.keys(value).length > 0, { message: 'Provide at least one task field to update.' })

export const paymentCreateSchema = z.object({
  project: projectLookupSchema.optional(),
  title: shortText,
  percentage: z.number().finite().min(0).max(100).default(0),
  amount: money.positive(),
  dueDate: isoDate,
  paidDate: isoDate.nullable().optional(),
  status: z.enum(['due', 'pending', 'paid']).default('due'),
  invoiceReference: z.string().trim().max(120).optional(),
  notes: optionalText(),
  confirmed: z.boolean().optional(),
}).strict()

export const paymentPatchSchema = z.object({
  title: shortText.optional(),
  percentage: z.number().finite().min(0).max(100).optional(),
  amount: money.positive().optional(),
  dueDate: isoDate.optional(),
  paidDate: isoDate.nullable().optional(),
  status: z.enum(['due', 'pending', 'paid']).optional(),
  invoiceReference: z.string().trim().max(120).optional(),
  notes: optionalText(),
  confirmed: z.boolean().optional(),
}).strict().refine((value) => Object.keys(value).some((key) => key !== 'confirmed'), { message: 'Provide at least one payment field to update.' })

const journalCategories = ['General', 'Client', 'Materials', 'Payments', 'Site', 'Issue', 'Variation', 'Completion']
const journalCategory = z.string().transform((value, context) => {
  const category = journalCategories.find((item) => item.toLowerCase() === value.trim().toLowerCase())
  if (!category) context.addIssue({ code: 'custom', message: `Use one of: ${journalCategories.join(', ')}.` })
  return category
})

export const journalCreateSchema = z.object({
  project: projectLookupSchema.optional(),
  category: journalCategory.default('General'),
  message: z.string().trim().min(1).max(10000),
}).strict()

export const eventCreateSchema = z.object({
  project: projectLookupSchema.optional(),
  type: shortText,
  title: shortText,
  startDate: dateTime,
  endDate: dateTime,
  allDay: z.boolean().default(false),
  location: z.string().trim().max(500).optional(),
  notes: optionalText(),
  colourCategory: z.enum(['green', 'blue', 'orange', 'red', 'purple', 'grey']).default('green'),
}).strict()

export const eventPatchSchema = eventCreateSchema.omit({ project: true }).partial().strict().refine(
  (value) => Object.keys(value).length > 0,
  { message: 'Provide at least one event field to update.' },
)

export function validateDateRange(startDate, endDate) {
  return !startDate || !endDate || new Date(endDate).getTime() >= new Date(startDate).getTime()
}
