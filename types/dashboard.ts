export interface BudgetCategory {
    category: string
    budget: number
    spent: number
  }
  
  export interface SpendingTrend {
    date: string
    amount: number
  }
  
  export interface CategorySpending {
    category: string
    amount: number
    percentage: number
  }
  
  export interface DashboardData {
    totalSpent: number
    monthlyBudget: number
    budgetCategories: BudgetCategory[]
    recentExpenses: {
      id: string
      date: string
      description: string
      amount: number
      category: string
    }[]
    spendingTrends: SpendingTrend[]
    categorySpending: CategorySpending[]
  }
  
  