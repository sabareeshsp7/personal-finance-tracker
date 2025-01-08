import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'

const secretKey = 'your-secret-key'
const key = new TextEncoder().encode(secretKey)

export async function encrypt(payload: Record<string, unknown>) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(key)
}

export async function decrypt(token: string) {
  try {
    const { payload } = await jwtVerify(token, key)
    return payload
  } catch {
    return null
  }
}

export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10)
}

export async function comparePasswords(password: string, hashedPassword: string) {
  return await bcrypt.compare(password, hashedPassword)
}

export async function getSession() {
  const token = (await cookies()).get('session')?.value
  if (!token) return null
  return await decrypt(token)
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete('session')
}

