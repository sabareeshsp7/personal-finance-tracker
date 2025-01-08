// Remove 'use client' since this is a server component
import { db } from '@/lib/db'
import { formatCurrency } from '@/lib/utils'
import {
  Card,
  CardContent,
  // CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface ExpenseSummaryProps {
  userId: string
  startDate: Date
  endDate: Date
}

export async function ExpenseSummary({
  userId,
  startDate,
  endDate,
}: ExpenseSummaryProps) {
  const expenses = await db.expense.findMany({
    where: {
      userId,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
  })

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const averageExpense = totalExpenses / expenses.length || 0
  const highestExpense = Math.max(...expenses.map((e) => e.amount), 0)

  const categories = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount
    return acc
  }, {} as Record<string, number>)

  const topCategory = Object.entries(categories).sort((a, b) => b[1] - a[1])[0]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalExpenses)}</div>
          <p className="text-xs text-muted-foreground">
            For the selected period
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Expense</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(averageExpense)}</div>
          <p className="text-xs text-muted-foreground">Per transaction</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Highest Expense</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(highestExpense)}</div>
          <p className="text-xs text-muted-foreground">Single transaction</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Top Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {topCategory ? topCategory[0] : 'N/A'}
          </div>
          <p className="text-xs text-muted-foreground">
            {topCategory
              ? `${formatCurrency(topCategory[1])} total spent`
              : 'No expenses'}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

