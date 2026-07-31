const encoder = new TextEncoder()
const decoder = new TextDecoder()

const bytesToBase64 = (bytes) => btoa(String.fromCharCode(...bytes))
const base64ToBytes = (value) => Uint8Array.from(atob(value), (character) => character.charCodeAt(0))

async function encryptionKey(secret) {
  if (!secret) throw new Error('GOOGLE_TOKEN_ENCRYPTION_KEY is not configured.')
  const raw = base64ToBytes(secret)
  if (raw.byteLength !== 32) throw new Error('GOOGLE_TOKEN_ENCRYPTION_KEY must be a base64-encoded 32-byte key.')
  return crypto.subtle.importKey('raw', raw, 'AES-GCM', false, ['encrypt', 'decrypt'])
}

export async function encryptToken(value, secret) {
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, await encryptionKey(secret), encoder.encode(value))
  return `v1.${bytesToBase64(iv)}.${bytesToBase64(new Uint8Array(encrypted))}`
}

export async function decryptToken(value, secret) {
  const [version, iv, encrypted] = String(value || '').split('.')
  if (version !== 'v1' || !iv || !encrypted) throw new Error('Stored Google credential is invalid.')
  const plaintext = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: base64ToBytes(iv) }, await encryptionKey(secret), base64ToBytes(encrypted))
  return decoder.decode(plaintext)
}

export async function hashOAuthState(value) {
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(value))
  return bytesToBase64(new Uint8Array(digest))
}

export function randomOAuthState() {
  return bytesToBase64(crypto.getRandomValues(new Uint8Array(32))).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '')
}
