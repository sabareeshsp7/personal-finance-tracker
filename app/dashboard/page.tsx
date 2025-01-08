import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getDashboardData } from './actions'
import { DashboardHeader } from './components/dashboard-header'
import { DashboardShell } from './components/dashboard-shell'
import { OverviewCards } from './components/overview-cards'
import { BudgetOverview } from './components/budget-overview'
import { SpendingChart } from './components/spending-chart'
import { CategoryBreakdown } from './components/category-breakdown'
import { RecentTransactions } from './components/recent-transactions'

export default async function DashboardPage() {
  const session = await getSession()
  if (!session?.id) {
    redirect('/login')
  }

  const dashboardData = typeof session?.id === 'string' ? await getDashboardData(session.id) : null

  if (!dashboardData) {
    return null
  }

  return (
    <DashboardShell>
      <DashboardHeader 
        heading="Dashboard" 
        description="Overview of your financial activity"
      />
      <div className="grid gap-6">
        <OverviewCards data={dashboardData} />
        
        <div className="grid gap-6 md:grid-cols-2">
          <BudgetOverview
            totalSpent={dashboardData.totalSpent}
            monthlyBudget={dashboardData.monthlyBudget}
            budgetCategories={dashboardData.budgetCategories}
          />
          <CategoryBreakdown data={dashboardData.categorySpending} />
        </div>

        <div className="grid gap-6 md:grid-cols-7">
          <SpendingChart 
            className="md:col-span-4" 
            data={dashboardData.spendingTrends} 
          />
          <RecentTransactions 
            className="md:col-span-3" 
            expenses={dashboardData.recentExpenses}
          />
        </div>
      </div>
    </DashboardShell>
  )
}

