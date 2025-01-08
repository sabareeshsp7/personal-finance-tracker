'use server'

import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function addExpense(formData: FormData) {
  try {
    const session = await getSession()
    if (!session?.id || typeof session.id !== 'string') {
      return { error: 'Not authenticated' }
    }

    const amount = parseFloat(formData.get('amount') as string)
    const description = formData.get('description') as string
    const category = formData.get('category') as string
    const date = new Date(formData.get('date') as string)

    await db.expense.create({
      data: {
        amount,
        description,
        category,
        date,
        userId: session.id,
      },
    })

    revalidatePath('/dashboard/expenses')
    return { success: true }
  } catch {
    return { error: 'Something went wrong' }
  }
}

export async function updateExpense(id: string, formData: FormData) {
  try {
    const session = await getSession()
    if (!session?.id) {
      return { error: 'Not authenticated' }
    }

    const expense = await db.expense.findUnique({
      where: { id },
    })

    if (!expense || expense.userId !== session.id) {
      return { error: 'Expense not found' }
    }

    const amount = parseFloat(formData.get('amount') as string)
    const description = formData.get('description') as string
    const category = formData.get('category') as string
    const date = new Date(formData.get('date') as string)

    await db.expense.update({
      where: { id },
      data: {
        amount,
        description,
        category,
        date,
      },
    })

    revalidatePath('/dashboard/expenses')
    return { success: true }
  } catch {
    return { error: 'Something went wrong' }
  }
}

export async function deleteExpense(id: string) {
  try {
    const session = await getSession()
    if (!session?.id) {
      return { error: 'Not authenticated' }
    }

    const expense = await db.expense.findUnique({
      where: { id },
    })

    if (!expense || expense.userId !== session.id) {
      return { error: 'Expense not found' }
    }

    await db.expense.delete({
      where: { id },
    })

    revalidatePath('/dashboard/expenses')
    return { success: true }
  } catch {
    return { error: 'Something went wrong' }
  }
}

