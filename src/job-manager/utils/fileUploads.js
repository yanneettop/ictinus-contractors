const MB = 1024 * 1024

export const STANDARD_FILE_LIMIT = 25 * MB
export const VIDEO_FILE_LIMIT = 50 * MB
export const RESUMABLE_UPLOAD_THRESHOLD = 6 * MB

const imageMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']
const documentMimeTypes = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]
const videoMimeTypes = ['video/mp4', 'video/quicktime', 'video/webm', 'video/x-m4v', 'video/3gpp']
const supportedMimeTypes = new Set([...imageMimeTypes, ...documentMimeTypes, ...videoMimeTypes])
const genericMimeTypes = new Set(['', 'application/octet-stream'])
const mimeByExtension = {
  jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', heic: 'image/heic', heif: 'image/heif',
  pdf: 'application/pdf', doc: 'application/msword', docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  mp4: 'video/mp4', mov: 'video/quicktime', webm: 'video/webm', m4v: 'video/x-m4v', '3gp': 'video/3gpp',
}

const imageExtension = /\.(jpe?g|png|webp|heic|heif)$/i
const pdfExtension = /\.pdf$/i
const wordExtension = /\.(doc|docx)$/i
const videoExtension = /\.(mp4|mov|webm|m4v|3gp)$/i
const supportedExtension = /\.(jpe?g|png|webp|heic|heif|pdf|doc|docx|mp4|mov|webm|m4v|3gp)$/i

export const PROJECT_FILE_ACCEPT = [
  ...imageMimeTypes,
  ...documentMimeTypes,
  ...videoMimeTypes,
  '.jpg', '.jpeg', '.png', '.webp', '.heic', '.heif', '.pdf', '.doc', '.docx', '.mp4', '.mov', '.webm', '.m4v', '.3gp',
].join(',')

export const PROJECT_FILE_HELP = 'PDF, images, Word, MP4, MOV, WebM, M4V or 3GP · 25 MB per file, 50 MB per video'

export function uploadFileKind(fileOrName, declaredType = '') {
  const name = typeof fileOrName === 'string' ? fileOrName : fileOrName?.name || ''
  const mimeType = typeof fileOrName === 'string' ? '' : fileOrName?.type || ''
  if (declaredType === 'Video' || mimeType.startsWith('video/') || videoExtension.test(name)) return 'video'
  if (declaredType === 'Word document' || wordExtension.test(name) || documentMimeTypes.slice(1).includes(mimeType)) return 'word'
  if (declaredType === 'Photos' || mimeType.startsWith('image/') || imageExtension.test(name)) return 'image'
  if (mimeType === 'application/pdf' || pdfExtension.test(name)) return 'pdf'
  return 'other'
}

export function suggestedDocumentType(file) {
  const kind = uploadFileKind(file)
  if (kind === 'video') return 'Video'
  if (kind === 'word') return 'Word document'
  if (kind === 'image') return 'Photos'
  return ''
}

export function uploadContentType(file) {
  if (file?.type && !genericMimeTypes.has(file.type)) return file.type
  const extension = file?.name?.match(/\.([^.]+)$/)?.[1]?.toLowerCase()
  return mimeByExtension[extension] || 'application/octet-stream'
}

export function validateUploadFile(file, kind = 'documents') {
  if (!file?.size) throw new Error('Choose a file to upload.')
  const type = file.type || ''
  const photoUpload = kind === 'photos'
  const extensionAllowed = photoUpload ? imageExtension.test(file.name) : supportedExtension.test(file.name)
  const mimeAllowed = photoUpload ? imageMimeTypes.includes(type) : supportedMimeTypes.has(type)
  if (!mimeAllowed && !(extensionAllowed && genericMimeTypes.has(type))) {
    throw new Error(photoUpload
      ? 'Use JPG, PNG, WebP, HEIC or HEIF files.'
      : 'Use PDF, JPG, PNG, WebP, HEIC, HEIF, DOC, DOCX, MP4, MOV, WebM, M4V or 3GP files.')
  }
  const video = uploadFileKind(file) === 'video'
  const limit = video ? VIDEO_FILE_LIMIT : STANDARD_FILE_LIMIT
  if (file.size > limit) throw new Error(video ? 'Videos must be 50 MB or smaller.' : 'Files must be 25 MB or smaller.')
  return { video, limit }
}

export function applySelectedFileDefaults(input) {
  const file = input?.files?.[0]
  const form = input?.form
  if (!file || !form) return
  const nameField = form.elements.namedItem('name')
  const typeField = form.elements.namedItem('type')
  if (nameField && !nameField.value.trim()) nameField.value = file.name.replace(/\.[^.]+$/, '')
  const suggestedType = suggestedDocumentType(file)
  if (typeField && suggestedType) typeField.value = suggestedType
}
