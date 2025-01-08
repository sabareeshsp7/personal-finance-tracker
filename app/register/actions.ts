'use server'

import { db } from '@/lib/db'
import { encrypt, hashPassword } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function register(formData: FormData) {
  try {
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const name = formData.get('name') as string

    // Check if user exists
    const existingUser = await db.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return { error: 'User already exists' }
    }

    // Create new user
    const hashedPassword = await hashPassword(password)
    const user = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    })

    // Create session
    const session = await encrypt({ id: user.id, email: user.email })
    
    // Fix: Update cookie setting with proper options
    const cookieStore = await cookies()
    await cookieStore.set({
      name: 'session',
      value: session,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      // Add maxAge for session expiration (24 hours)
      maxAge: 60 * 60 * 24,
    })

    return { success: true }
  } catch (error) {
    console.error(error)
    return { error: 'Something went wrong' }
  }
}

