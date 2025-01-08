'use server'

import { db } from '@/lib/db'

export type ExpenseSummary = {
  totalExpenses: number
  averageExpense: number
  highestExpense: number
  topCategory: { name: string; amount: number } | null
  expensesByCategory: { category: string; amount: number }[]
}

export type ExpenseData = {
  id: string
  amount: number
  description: string
  category: string
  date: string
}

// Change function name from getExpenseData to getExpenseSummary
export async function getExpenseSummary(
  userId: string, 
  startDateStr: string, 
  endDateStr: string
): Promise<{ expenses: ExpenseData[], summary: ExpenseSummary }> {
  const startDate = new Date(startDateStr)
  const endDate = new Date(endDateStr)

  const expenses = await db.expense.findMany({
    where: {
      userId,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: {
      date: 'desc',
    },
  })

  // Convert dates to strings to avoid serialization issues
  const expenseData = expenses.map(expense => ({
    id: expense.id,
    amount: expense.amount,
    description: expense.description,
    category: expense.category,
    date: expense.date.toISOString().split('T')[0],
  }))

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const averageExpense = expenses.length > 0 ? totalExpenses / expenses.length : 0
  const highestExpense = Math.max(...expenses.map(e => e.amount), 0)

  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount
    return acc
  }, {} as Record<string, number>)

  const expensesByCategory = Object.entries(categoryTotals).map(([category, amount]) => ({
    category,
    amount,
  }))

  const topCategory = expensesByCategory.length > 0
    ? {
        name: expensesByCategory.sort((a, b) => b.amount - a.amount)[0].category,
        amount: expensesByCategory.sort((a, b) => b.amount - a.amount)[0].amount,
      }
    : null

  return {
    expenses: expenseData,
    summary: {
      totalExpenses,
      averageExpense,
      highestExpense,
      topCategory,
      expensesByCategory,
    }
  }
}

