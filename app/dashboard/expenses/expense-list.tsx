import { db } from '@/lib/db'
import { formatDate } from '@/lib/utils'
import { DeleteExpenseButton } from './delete-expense-button'
import { EditExpenseButton } from './edit-expense-button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export async function ExpenseList({ userId }: { userId: string }) {
  try {
    const expenses = await db.expense.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    })

    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell>{formatDate(expense.date)}</TableCell>
                <TableCell>{expense.description}</TableCell>
                <TableCell>{expense.category}</TableCell>
                <TableCell className="text-right">
                  ${expense.amount.toFixed(2)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <EditExpenseButton expense={expense} />
                    <DeleteExpenseButton expenseId={expense.id} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {expenses.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No expenses found. Add one to get started!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    )
  } catch (error) {
    console.error('Database Error:', error)
    return (
      <div className="rounded-md border p-4">
        <p className="text-center text-red-500">
          Error loading expenses. Please try again later.
        </p>
      </div>
    )
  }
}

