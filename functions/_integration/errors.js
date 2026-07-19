export class IntegrationError extends Error {
  constructor(code, message, status = 400, details) {
    super(message)
    this.name = 'IntegrationError'
    this.code = code
    this.status = status
    this.details = details
  }
}

export const notFound = (entity, id) => new IntegrationError(
  'NOT_FOUND',
  `${entity} was not found.`,
  404,
  { entity, id },
)

export const confirmationRequired = (fields) => new IntegrationError(
  'CONFIRMATION_REQUIRED',
  'This sensitive change requires confirmed: true.',
  409,
  { fields },
)

