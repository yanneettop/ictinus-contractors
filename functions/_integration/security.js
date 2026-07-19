const encoder = new TextEncoder()

export function constantTimeEqual(leftValue, rightValue) {
  const left = encoder.encode(String(leftValue || ''))
  const right = encoder.encode(String(rightValue || ''))
  const length = Math.max(left.length, right.length, 1)
  let difference = left.length ^ right.length

  for (let index = 0; index < length; index += 1) {
    difference |= (left[index % Math.max(left.length, 1)] || 0) ^ (right[index % Math.max(right.length, 1)] || 0)
  }

  return difference === 0
}

export function authenticateIntegration(request, env) {
  const configuredKey = env.ICTINUS_INTEGRATION_API_KEY
  if (!configuredKey) return false

  const authorization = request.headers.get('authorization') || ''
  const match = authorization.match(/^Bearer\s+(.+)$/i)
  return Boolean(match && constantTimeEqual(match[1], configuredKey))
}

