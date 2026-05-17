const MAX_FILES = 8
const MAX_FILE_SIZE = 5 * 1024 * 1024
const MAX_TOTAL_ATTACHMENT_SIZE = 25 * 1024 * 1024
const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'])
const REQUIRED_FIELDS = ['name', 'phone', 'email', 'area', 'workType', 'description']
const DEFAULT_ALLOWED_ORIGINS = [
  'https://ictinuscontractors.co.uk',
  'https://www.ictinuscontractors.co.uk',
  'https://ictinus-contractors.pages.dev',
]

function getAllowedOrigins(env) {
  const configuredOrigins = String(env.ALLOWED_ORIGIN || '')
    .split(',')
    .map((allowedOrigin) => allowedOrigin.trim())
    .filter(Boolean)

  return [...new Set([...DEFAULT_ALLOWED_ORIGINS, ...configuredOrigins])]
}

function isOriginAllowed(origin, env) {
  if (!env.ALLOWED_ORIGIN) return true
  return getAllowedOrigins(env).includes(origin)
}

function responseHeaders(request, env) {
  const headers = {
    'content-type': 'application/json; charset=utf-8',
    vary: 'Origin',
  }
  const origin = request?.headers.get('Origin')

  if (origin && isOriginAllowed(origin, env)) {
    headers['access-control-allow-origin'] = origin
    headers['access-control-allow-methods'] = 'POST, OPTIONS'
    headers['access-control-allow-headers'] = 'content-type'
  }

  return headers
}

function json(data, status = 200, request, env = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: responseHeaders(request, env),
  })
}

function error(message, status = 400, request, env) {
  return json({ ok: false, message }, status, request, env)
}

function cleanText(value, maxLength = 2000) {
  return String(value || '').trim().slice(0, maxLength)
}

function escapeHtml(value) {
  return cleanText(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function isHeicName(name) {
  return /\.(heic|heif)$/i.test(name || '')
}

function isFileLike(value) {
  return value && typeof value === 'object' && typeof value.arrayBuffer === 'function' && typeof value.name === 'string'
}

function isAllowedPhoto(file) {
  if (ALLOWED_MIME_TYPES.has(file.type)) return true
  return !file.type && isHeicName(file.name)
}

function sanitizeFilename(name) {
  const cleaned = String(name || 'photo')
    .normalize('NFKD')
    .replace(/[^\w.\-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 120)

  return cleaned || 'photo'
}

async function verifyTurnstile(token, request, env) {
  if (!env.TURNSTILE_SECRET_KEY) {
    return { ok: false, status: 500, message: 'Spam protection is not configured yet.' }
  }

  if (!token) {
    return { ok: false, status: 400, message: 'Please complete the spam check and try again.' }
  }

  const body = new FormData()
  body.append('secret', env.TURNSTILE_SECRET_KEY)
  body.append('response', token)

  const remoteIp = request.headers.get('CF-Connecting-IP')
  if (remoteIp) body.append('remoteip', remoteIp)

  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body,
  })

  if (!response.ok) {
    return { ok: false, status: 502, message: 'Spam check could not be verified. Please try again.' }
  }

  const data = await response.json()
  if (!data.success) {
    return { ok: false, status: 400, message: 'Spam check failed. Please refresh the page and try again.' }
  }

  return { ok: true }
}

function validateOrigin(request, env) {
  if (!env.ALLOWED_ORIGIN) return true
  const origin = request.headers.get('Origin')
  return isOriginAllowed(origin, env)
}

function collectFields(formData) {
  return {
    name: cleanText(formData.get('name'), 160),
    phone: cleanText(formData.get('phone'), 80),
    email: cleanText(formData.get('email'), 180),
    area: cleanText(formData.get('area'), 180),
    workType: cleanText(formData.get('workType'), 180),
    propertyType: cleanText(formData.get('propertyType'), 180),
    preferredStart: cleanText(formData.get('preferredStart'), 180),
    contactMethod: cleanText(formData.get('contactMethod'), 180),
    bestTime: cleanText(formData.get('bestTime'), 180),
    description: cleanText(formData.get('description'), 4000),
  }
}

function validateFields(fields) {
  for (const field of REQUIRED_FIELDS) {
    if (!fields[field]) return 'Please complete all required fields and try again.'
  }

  if (!isValidEmail(fields.email)) {
    return 'Please enter a valid email address.'
  }

  return ''
}

function collectPhotos(formData) {
  return formData.getAll('photos').filter((value) => isFileLike(value) && value.size > 0)
}

function validatePhotos(photos) {
  if (photos.length > MAX_FILES) {
    return `Please upload no more than ${MAX_FILES} photos.`
  }

  const totalSize = photos.reduce((sum, photo) => sum + photo.size, 0)
  if (totalSize > MAX_TOTAL_ATTACHMENT_SIZE) {
    return 'Please upload fewer or smaller photos so they can be attached to the email.'
  }

  for (const photo of photos) {
    if (photo.size > MAX_FILE_SIZE) {
      return 'Each photo must be 5MB or smaller.'
    }

    if (!isAllowedPhoto(photo)) {
      return 'Please upload JPG, PNG, WebP, HEIC or HEIF photos only.'
    }
  }

  return ''
}

function uniqueAttachmentFilename(photo, usedNames) {
  const filename = sanitizeFilename(photo.name)
  const seen = usedNames.get(filename) || 0
  usedNames.set(filename, seen + 1)

  return seen === 0 ? filename : filename.replace(/(\.[^.]+)?$/, `-${seen + 1}$1`)
}

function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer)
  const chunkSize = 0x8000
  let binary = ''

  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize))
  }

  return btoa(binary)
}

async function buildAttachments(photos) {
  const usedNames = new Map()

  return Promise.all(photos.map(async (photo) => {
    const content = arrayBufferToBase64(await photo.arrayBuffer())

    return {
      filename: uniqueAttachmentFilename(photo, usedNames),
      content,
      content_type: photo.type || (isHeicName(photo.name) ? 'image/heic' : 'application/octet-stream'),
    }
  }))
}

function fieldRow(label, value) {
  return `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;font-weight:700;color:#1C1714;">${escapeHtml(label)}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;color:#3f3731;">${escapeHtml(value || 'Not specified')}</td>
    </tr>
  `
}

function buildEmailHtml(fields, submissionId, photos) {
  const photoSummary = photos.length
    ? `<p style="margin:0;">${escapeHtml(String(photos.length))} photo${photos.length === 1 ? '' : 's'} attached to this email.</p>`
    : '<p style="margin:0;">No photos uploaded.</p>'

  return `
    <div style="font-family:Arial,sans-serif;line-height:1.5;color:#1C1714;">
      <h1 style="font-size:22px;margin:0 0 16px;">New Quote Request - Ictinus Contractors</h1>
      <p style="margin:0 0 18px;"><strong>Submission ID:</strong> ${escapeHtml(submissionId)}</p>

      <table style="border-collapse:collapse;width:100%;max-width:720px;border:1px solid #eee;">
        ${fieldRow('Name', fields.name)}
        ${fieldRow('Phone', fields.phone)}
        ${fieldRow('Email', fields.email)}
        ${fieldRow('Property postcode or area', fields.area)}
        ${fieldRow('Type of work', fields.workType)}
        ${fieldRow('Property type', fields.propertyType)}
        ${fieldRow('Preferred start time', fields.preferredStart)}
        ${fieldRow('Preferred contact method', fields.contactMethod)}
        ${fieldRow('Best time to contact', fields.bestTime)}
      </table>

      <h2 style="font-size:18px;margin:22px 0 8px;">Project description</h2>
      <p style="white-space:pre-wrap;margin:0 0 20px;">${escapeHtml(fields.description)}</p>

      <h2 style="font-size:18px;margin:22px 0 8px;">Uploaded photos</h2>
      ${photoSummary}
    </div>
  `
}

async function sendEmail(fields, submissionId, photos, env) {
  if (!env.RESEND_API_KEY || !env.QUOTE_TO_EMAIL || !env.QUOTE_FROM_EMAIL) {
    throw new Error('Resend configuration missing')
  }

  const attachments = await buildAttachments(photos)

  const emailPayload = {
    from: env.QUOTE_FROM_EMAIL,
    to: [env.QUOTE_TO_EMAIL],
    subject: 'New Quote Request - Ictinus Contractors',
    html: buildEmailHtml(fields, submissionId, photos),
    reply_to: fields.email,
  }

  if (attachments.length) {
    emailPayload.attachments = attachments
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify(emailPayload),
  })

  if (!response.ok) {
    throw new Error('Resend request failed')
  }
}

export function onRequestOptions({ request, env }) {
  return new Response(null, {
    status: validateOrigin(request, env) ? 204 : 403,
    headers: responseHeaders(request, env),
  })
}

export async function onRequestPost({ request, env }) {
  if (!validateOrigin(request, env)) {
    return error('This quote form can only be submitted from the Ictinus Contractors website.', 403, request, env)
  }

  const contentType = request.headers.get('content-type') || ''
  if (!contentType.includes('multipart/form-data')) {
    return error('Please submit the quote form again.', 415, request, env)
  }

  let formData
  try {
    formData = await request.formData()
  } catch {
    return error('We could not read your quote request. Please try again.', 400, request, env)
  }

  const turnstileResult = await verifyTurnstile(cleanText(formData.get('cf-turnstile-response'), 3000), request, env)
  if (!turnstileResult.ok) {
    return error(turnstileResult.message, turnstileResult.status, request, env)
  }

  const fields = collectFields(formData)
  const fieldError = validateFields(fields)
  if (fieldError) return error(fieldError, 400, request, env)

  const photos = collectPhotos(formData)
  const photoError = validatePhotos(photos)
  if (photoError) return error(photoError, 400, request, env)

  const submissionId = crypto.randomUUID()

  try {
    await sendEmail(fields, submissionId, photos, env)

    return json({ ok: true, message: 'Quote request sent successfully.' }, 200, request, env)
  } catch {
    return error('We could not send your quote request right now. Please email us directly or call 07586 480417.', 502, request, env)
  }
}
