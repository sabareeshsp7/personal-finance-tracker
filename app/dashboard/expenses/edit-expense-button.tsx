'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { PencilIcon } from 'lucide-react'
import { ExpenseForm } from './expense-form'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import type { Expense } from '@prisma/client'

export function EditExpenseButton({ expense }: { expense: Expense }) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <PencilIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Expense</DialogTitle>
        </DialogHeader>
        <ExpenseForm expense={expense} closeDialog={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}

