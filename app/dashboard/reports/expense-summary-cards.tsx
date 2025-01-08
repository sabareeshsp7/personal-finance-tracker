'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import { getExpenseSummary } from './actions'
import type { ExpenseSummary } from './actions'

interface ExpenseSummaryCardsProps {
  userId: string
  startDate: Date
  endDate: Date
}

export function ExpenseSummaryCards({
  userId,
  startDate,
  endDate,
}: ExpenseSummaryCardsProps) {
  const [summary, setSummary] = useState<ExpenseSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadSummary() {
      try {
        setLoading(true)
        setError(null)
        const data = await getExpenseSummary(
          userId,
          startDate.toISOString(),
          endDate.toISOString()
        )
        setSummary(data.summary)
      } catch (err) {
        setError('Failed to load expense summary')
        console.error('Error loading summary:', err)
      } finally {
        setLoading(false)
      }
    }
    loadSummary()
  }, [userId, startDate, endDate])

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Loading...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-24 animate-pulse bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-destructive">{error}</p>
        </CardContent>
      </Card>
    )
  }

  if (!summary) return null

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(summary.totalExpenses)}
          </div>
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
          <div className="text-2xl font-bold">
            {formatCurrency(summary.averageExpense)}
          </div>
          <p className="text-xs text-muted-foreground">Per transaction</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Highest Expense</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(summary.highestExpense)}
          </div>
          <p className="text-xs text-muted-foreground">Single transaction</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Top Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {summary.topCategory ? summary.topCategory.name : 'N/A'}
          </div>
          <p className="text-xs text-muted-foreground">
            {summary.topCategory
              ? `${formatCurrency(summary.topCategory.amount)} total spent`
              : 'No expenses'}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

