'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

interface RecentTransaction {
  id: string
  date: string
  description: string
  amount: number
  category: string
}

interface RecentTransactionsProps {
  expenses: RecentTransaction[]
  className?: string
}

export function RecentTransactions({ expenses, className }: RecentTransactionsProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {expenses.map((expense) => (
            <div key={expense.id} className="flex items-center">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  {expense.description}
                </p>
                <p className="text-sm text-muted-foreground">
                  {expense.date}
                </p>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <Badge variant="secondary">
                  {expense.category}
                </Badge>
                <span className="font-medium">
                  {formatCurrency(expense.amount)}
                </span>
              </div>
            </div>
          ))}
          {expenses.length === 0 && (
            <p className="text-center text-sm text-muted-foreground">
              No recent transactions
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

