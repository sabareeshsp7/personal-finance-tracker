'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
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
import { AlertTriangle, Edit2 } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { updateCategoryBudget } from '../actions'
import { useRouter } from 'next/navigation'
import type { BudgetCategory } from '@/types/dashboard'

interface BudgetOverviewProps {
  totalSpent: number
  monthlyBudget: number
  budgetCategories: BudgetCategory[]
  className?: string
}

export function BudgetOverview({
  totalSpent,
  monthlyBudget,
  budgetCategories,
  className,
}: BudgetOverviewProps) {
  const router = useRouter()
  const [editingCategory, setEditingCategory] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const totalProgress = (totalSpent / monthlyBudget) * 100
  const isOverBudget = totalSpent > monthlyBudget

  async function handleUpdateCategoryBudget(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    try {
      await updateCategoryBudget(new FormData(event.currentTarget))
      setEditingCategory(null)
      router.refresh()
    } catch (error) {
      console.error('Failed to update category budget:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Budget Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="space-y-1">
              <p className="text-sm font-medium">Total Budget</p>
              <p className="text-2xl font-bold">
                {formatCurrency(totalSpent)} / {formatCurrency(monthlyBudget)}
              </p>
            </div>
            <span className={`text-sm font-medium ${isOverBudget ? 'text-red-500' : 'text-green-500'}`}>
              {((totalSpent / monthlyBudget) * 100).toFixed(1)}%
            </span>
          </div>
          <Progress
            value={Math.min(totalProgress, 100)}
            className={isOverBudget ? 'bg-red-100' : undefined}
            // indicatorClassName={isOverBudget ? 'bg-red-500' : undefined}
          />
          {isOverBudget && (
            <Alert variant="destructive" className="mt-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                You&apos;re over budget by {formatCurrency(totalSpent - monthlyBudget)}
              </AlertDescription>
            </Alert>
          )}
        </div>

        <div className="space-y-4">
          {budgetCategories.map((category) => {
            const progress = (category.spent / category.budget) * 100
            const isOverBudget = category.spent > category.budget

            return (
              <div key={category.category} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{category.category}</p>
                      <Dialog
                        open={editingCategory === category.category}
                        onOpenChange={(open) => setEditingCategory(open ? category.category : null)}
                      >
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-4 w-4">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Update {category.category} Budget</DialogTitle>
                          </DialogHeader>
                          <form onSubmit={handleUpdateCategoryBudget} className="space-y-4">
                            <input type="hidden" name="category" value={category.category} />
                            <div className="space-y-2">
                              <Label htmlFor={`budget-${category.category}`}>Budget Amount</Label>
                              <Input
                                id={`budget-${category.category}`}
                                name="budget"
                                type="number"
                                defaultValue={category.budget}
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
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatCurrency(category.spent)} of {formatCurrency(category.budget)}
                    </p>
                  </div>
                  <span className={`text-sm font-medium ${
                    isOverBudget ? 'text-red-500' : 'text-green-500'
                  }`}>
                    {progress.toFixed(1)}%
                  </span>
                </div>
                <Progress
                  value={Math.min(progress, 100)}
                  className={isOverBudget ? 'bg-red-100' : undefined}
                //   indicatorClassName={isOverBudget ? 'bg-red-500' : undefined}
                />
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

