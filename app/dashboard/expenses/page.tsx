import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { ExpenseList } from './expense-list'
import { AddExpenseButton } from './add-expense-button'

export default async function ExpensesPage() {
  const session = await getSession()
  if (!session?.id) {
    redirect('/login')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Expenses</h1>
        <AddExpenseButton />
      </div>
      <ExpenseList userId={session.id as string} />
    </div>
  )
}

