'use server'

import { db } from '@/lib/db'
import { comparePasswords, encrypt } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function login(formData: FormData) {
  try {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const user = await db.user.findUnique({
      where: { email },
    })

    if (!user) {
      return { error: 'Invalid credentials' }
    }

    const isValid = await comparePasswords(password, user.password)
    if (!isValid) {
      return { error: 'Invalid credentials' }
    }

    // Create session
    const session = await encrypt({ id: user.id, email: user.email })
    const cookieStore = await cookies()
    cookieStore.set('session', session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    })

    return { success: true }
  } catch {
    return { error: 'Something went wrong' }
  }
}

