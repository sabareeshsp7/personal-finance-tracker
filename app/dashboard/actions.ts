'use server'

import { db } from '@/lib/db'
import { startOfMonth, endOfMonth, format, subMonths } from 'date-fns'
import type { DashboardData } from '@/types/dashboard'
import { cookies } from 'next/headers'
import { decrypt } from '@/lib/auth'

const BUDGET_COOKIE_NAME = 'user_budgets'

interface UserBudgets {
  monthlyBudget: number
  categoryBudgets: Record<string, number>
}

// Function to get user budgets
async function getUserBudgets(userId: string): Promise<UserBudgets> {
  const cookieStore = await cookies()
  const budgetsCookie = (await cookieStore).get(BUDGET_COOKIE_NAME)
  
  if (budgetsCookie) {
    try {
      const budgets = JSON.parse(budgetsCookie.value)
      if (budgets[userId]) {
        return budgets[userId]
      }
    } catch (error) {
      console.error('Error parsing budgets cookie:', error)
    }
  }

  // Default budgets
  return {
    monthlyBudget: 2000,
    categoryBudgets: {
      'Food': 500,
      'Transportation': 300,
      'Housing': 800,
      'Utilities': 200,
      'Entertainment': 200,
      'Healthcare': 200,
      'Shopping': 300,
      'Other': 200,
    }
  }
}

// Function to update user budgets
async function updateUserBudgets(userId: string, newBudgets: UserBudgets) {
  const cookieStore = await cookies()
  const budgetsCookie = (await cookieStore).get(BUDGET_COOKIE_NAME)
  
  let allBudgets = {}
  if (budgetsCookie) {
    try {
      allBudgets = JSON.parse(budgetsCookie.value)
    } catch (error) {
      console.error('Error parsing budgets cookie:', error)
    }
  }

  allBudgets = {
    ...allBudgets,
    [userId]: newBudgets
  }

  await cookieStore.set({
    name: BUDGET_COOKIE_NAME,
    value: JSON.stringify(allBudgets),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  })
}

export async function getDashboardData(userId: string): Promise<DashboardData> {
  const now = new Date()
  const monthStart = startOfMonth(now)
  const monthEnd = endOfMonth(now)

  const expenses = await db.expense.findMany({
    where: {
      userId,
      date: {
        gte: monthStart,
        lte: monthEnd,
      },
    },
    orderBy: {
      date: 'desc',
    },
  })

  const { monthlyBudget, categoryBudgets } = await getUserBudgets(userId)

  // Calculate total spent
  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0)

  // Calculate spending by category
  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount
    return acc
  }, {} as Record<string, number>)

  // Calculate budget categories
  const budgetCategories = Object.entries(categoryBudgets).map(([category, budget]) => ({
    category,
    budget,
    spent: categoryTotals[category] || 0,
  }))

  // Get spending trends (last 6 months)
  const spendingTrends: { date: string; amount: number }[] = []
  for (let i = 5; i >= 0; i--) {
    const date = subMonths(now, i)
    const monthStart = startOfMonth(date)
    const monthEnd = endOfMonth(date)
    
    const monthExpenses = await db.expense.findMany({
      where: {
        userId,
        date: {
          gte: monthStart,
          lte: monthEnd,
        },
      },
    })
    
    spendingTrends.push({
      date: format(date, 'MMM yyyy'),
      amount: monthExpenses.reduce((sum, expense) => sum + expense.amount, 0),
    })
  }

  // Calculate category spending percentages
  const totalSpending = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0)
  const categorySpending = Object.entries(categoryTotals).map(([category, amount]) => ({
    category,
    amount,
    percentage: totalSpending > 0 ? (amount / totalSpending) * 100 : 0,
  }))

  // Get recent expenses
  const recentExpenses = expenses.slice(0, 5).map(expense => ({
    id: expense.id,
    date: format(expense.date, 'MMM dd, yyyy'),
    description: expense.description,
    amount: expense.amount,
    category: expense.category,
  }))

  return {
    totalSpent,
    monthlyBudget,
    budgetCategories,
    recentExpenses,
    spendingTrends,
    categorySpending,
  }
}

export async function updateMonthlyBudget(formData: FormData) {
  const cookieStore = await cookies()
  const session = await decrypt(cookieStore.get('session')?.value ?? '')
  if (!session || !session.id) {
    throw new Error('Not authenticated')
  }

  const monthlyBudget = Number(formData.get('monthlyBudget'))
  if (isNaN(monthlyBudget) || monthlyBudget <= 0) {
    throw new Error('Invalid budget amount')
  }

  if (typeof session.id !== 'string') {
    throw new Error('Invalid session id')
  }
  const currentBudgets = await getUserBudgets(String(session.id))
  await updateUserBudgets(String(session.id), {
    ...currentBudgets,
    monthlyBudget,
  })

  return { success: true }
}

export async function updateCategoryBudget(formData: FormData) {
  const cookieStore = await cookies()
  const session = await decrypt(cookieStore.get('session')?.value ?? '')
  if (!session?.id) {
    throw new Error('Not authenticated')
  }

  const category = formData.get('category') as string
  const budget = Number(formData.get('budget'))
  
  if (!category || isNaN(budget) || budget <= 0) {
    throw new Error('Invalid category or budget amount')
  }

  const currentBudgets = await getUserBudgets(String(session.id))
  await updateUserBudgets(String(session.id), {
    ...currentBudgets,
    categoryBudgets: {
      ...currentBudgets.categoryBudgets,
      [category]: budget,
    }
  })

  return { success: true }
}

