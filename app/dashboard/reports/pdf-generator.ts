import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { ExpenseData, ExpenseSummary } from './actions'

interface GeneratePDFProps {
  expenses: ExpenseData[]
  summary: ExpenseSummary
  dateRange: {
    start: string
    end: string
  }
}

export function generatePDF({ expenses, summary, dateRange }: GeneratePDFProps) {
  const doc = new jsPDF()
  let yPos = 20 // Starting Y position
  
  // Add title
  doc.setFontSize(20)
  doc.text('Expense Report', doc.internal.pageSize.width / 2, yPos, { align: 'center' })
  yPos += 10

  // Add date range
  doc.setFontSize(12)
  doc.text(
    `Period: ${dateRange.start} - ${dateRange.end}`,
    doc.internal.pageSize.width / 2,
    yPos + 10,
    { align: 'center' }
  )
  yPos += 25

  // Add summary section
  doc.setFontSize(14)
  doc.text('Summary', 14, yPos)
  yPos += 5
  
  const summaryData = [
    ['Total Expenses:', `$${summary.totalExpenses.toFixed(2)}`],
    ['Average Expense:', `$${summary.averageExpense.toFixed(2)}`],
    ['Highest Expense:', `$${summary.highestExpense.toFixed(2)}`],
    summary.topCategory 
      ? ['Top Category:', `${summary.topCategory.name} ($${summary.topCategory.amount.toFixed(2)})`]
      : ['Top Category:', 'N/A'],
  ]

  autoTable(doc, {
    startY: yPos,
    head: [],
    body: summaryData,
    theme: 'plain',
    styles: { fontSize: 12 },
    columnStyles: {
      0: { cellWidth: 40 },
      1: { cellWidth: 60 },
    },
    didDrawPage: (data) => {
      if (data.cursor) {
        yPos = data.cursor.y + 20
      }
    },
  })

  // Add expenses table
  doc.setFontSize(14)
  doc.text('Expense Details', 14, yPos)
  yPos += 5

  const tableData = expenses.map(expense => [
    expense.date,
    expense.description,
    expense.category,
    `$${expense.amount.toFixed(2)}`,
  ])

  autoTable(doc, {
    startY: yPos,
    head: [['Date', 'Description', 'Category', 'Amount']],
    body: tableData,
    theme: 'striped',
    styles: { fontSize: 10 },
    headStyles: { fillColor: [66, 66, 66] },
    margin: { top: 10 },
  })

  return doc
}

