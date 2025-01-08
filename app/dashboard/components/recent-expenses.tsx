'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'

interface RecentExpense {
  id: string
  date: string
  description: string
  amount: number
  category: string
}

interface RecentExpensesProps {
  expenses: RecentExpense[]
}

export function RecentExpenses({ expenses }: RecentExpensesProps) {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Recent Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {expenses.map((expense) => (
            <div
              key={expense.id}
              className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
            >
              <div>
                <p className="font-medium">{expense.description}</p>
                <p className="text-sm text-muted-foreground">
                  {expense.date} • {expense.category}
                </p>
              </div>
              <p className="font-medium">{formatCurrency(expense.amount)}</p>
            </div>
          ))}
          {expenses.length === 0 && (
            <p className="text-center text-muted-foreground">
              No recent expenses
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

