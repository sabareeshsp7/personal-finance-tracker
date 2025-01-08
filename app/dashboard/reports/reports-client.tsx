'use client'

import { useState } from 'react'
import { DateRange } from 'react-day-picker'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileDown } from 'lucide-react'
import { toast } from 'sonner'
import { DateRangePicker } from './date-range-picker'
import { ExpenseSummaryCards } from './expense-summary-cards'
import { ExpenseChart } from './expense-chart'
import { getExpenseSummary } from './actions'
import { generatePDF } from './pdf-generator'

export function ReportsClient({ userId }: { userId: string }) {
  const [date, setDate] = useState<DateRange | undefined>()
  const [loading, setLoading] = useState(false)

  async function handleExport() {
    if (!date?.from || !date?.to) return
    
    setLoading(true)
    try {
      // Get expense data from server
      const data = await getExpenseSummary(
        userId,
        date.from.toISOString(),
        date.to.toISOString()
      )

      // Generate PDF on the client side
      const doc = generatePDF({
        expenses: data.expenses,
        summary: data.summary,
        dateRange: {
          start: date.from.toLocaleDateString(),
          end: date.to.toLocaleDateString(),
        },
      })

      // Save the PDF
      doc.save(`expense-report-${date.from.toISOString().split('T')[0]}.pdf`)
      toast.success('Report downloaded successfully')
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to generate report. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <DateRangePicker date={date} onDateChange={setDate} />
            <Button
              onClick={handleExport}
              disabled={!date?.from || !date?.to || loading}
            >
              <FileDown className="mr-2 h-4 w-4" />
              {loading ? 'Generating...' : 'Export PDF'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {date?.from && date?.to && (
        <>
          <ExpenseSummaryCards
            userId={userId}
            startDate={date.from}
            endDate={date.to}
          />
          <ExpenseChart
            userId={userId}
            startDate={date.from}
            endDate={date.to}
          />
        </>
      )}
    </div>
  )
}

