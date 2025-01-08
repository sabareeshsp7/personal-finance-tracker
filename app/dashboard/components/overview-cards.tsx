'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { formatCurrency } from '@/lib/utils'
import { ArrowDownIcon, ArrowUpIcon, DollarSign, Edit2 } from 'lucide-react'
import { updateMonthlyBudget } from '../actions'
import { useRouter } from 'next/navigation'
import type { DashboardData } from '@/types/dashboard'

interface OverviewCardsProps {
  data: DashboardData
}

export function OverviewCards({ data }: OverviewCardsProps) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Calculate monthly change, handling the infinity case
  const monthlyChange = data.spendingTrends.length >= 2 
    ? data.spendingTrends[data.spendingTrends.length - 2].amount === 0 
      ? data.spendingTrends[data.spendingTrends.length - 1].amount > 0 
        ? 100 
        : 0
      : ((data.spendingTrends[data.spendingTrends.length - 1].amount - 
          data.spendingTrends[data.spendingTrends.length - 2].amount) /
          data.spendingTrends[data.spendingTrends.length - 2].amount) * 100
    : 0

  async function handleUpdateBudget(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    try {
      await updateMonthlyBudget(new FormData(event.currentTarget))
      setIsEditing(false)
      router.refresh()
    } catch (error) {
      console.error('Failed to update budget:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(data.totalSpent)}</div>
          <p className="text-xs text-muted-foreground">
            This month
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Budget</CardTitle>
          <Dialog open={isEditing} onOpenChange={setIsEditing}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-4 w-4">
                <Edit2 className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update Monthly Budget</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleUpdateBudget} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="monthlyBudget">Budget Amount</Label>
                  <Input
                    id="monthlyBudget"
                    name="monthlyBudget"
                    type="number"
                    defaultValue={data.monthlyBudget}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Updating...' : 'Update Budget'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(data.monthlyBudget)}</div>
          <div className="flex items-center pt-1">
            <span className="text-xs text-muted-foreground">
              {formatCurrency(data.monthlyBudget - data.totalSpent)} remaining
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Change</CardTitle>
          {monthlyChange > 0 ? (
            <ArrowUpIcon className="h-4 w-4 text-red-500" />
          ) : (
            <ArrowDownIcon className="h-4 w-4 text-green-500" />
          )}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {monthlyChange > 0 ? '+' : ''}{monthlyChange.toFixed(1)}%
          </div>
          <p className="text-xs text-muted-foreground">
            From last month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Top Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {data.categorySpending[0]?.category || 'N/A'}
          </div>
          <p className="text-xs text-muted-foreground">
            {data.categorySpending[0]
              ? `${formatCurrency(data.categorySpending[0].amount)} (${data.categorySpending[0].percentage.toFixed(0)}%)`
              : 'No spending data'}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

