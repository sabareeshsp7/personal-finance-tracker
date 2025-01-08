'use client'

import { useState } from 'react'
import { DateRange } from 'react-day-picker'
import { Card, CardContent } from '@/components/ui/card'
import { DateRangePicker } from './date-range-picker'
import { ExpenseChart } from './expense-chart'
import { ExpenseSummary } from './expense-summary'
import { generateReport } from './actions'
import { Button } from '@/components/ui/button'
import { FileDown } from 'lucide-react'

export function ReportGenerator({ userId }: { userId: string }) {
  const [date, setDate] = useState<DateRange | undefined>()
  const [loading, setLoading] = useState(false)

  async function handleExport() {
    if (!date?.from || !date?.to) return
    
    setLoading(true)
    try {
      const response = await generateReport({
        userId,
        startDate: date.from,
        endDate: date.to,
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `expense-report-${date.from.toISOString().split('T')[0]}.pdf`
        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(url)
      } else {
        throw new Error('Failed to generate PDF')
      }
    } catch (error) {
      console.error('Error downloading PDF:', error)
      alert('Failed to generate PDF report')
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
          <ExpenseSummary
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

