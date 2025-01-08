import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer'
import type { ExpenseSummary } from './actions'

// Define styles for PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 15,
    color: '#666',
  },
  summary: {
    marginBottom: 30,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  table: {
    marginTop: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingBottom: 5,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#999',
    paddingVertical: 5,
  },
  col1: { width: '20%' },
  col2: { width: '35%' },
  col3: { width: '25%' },
  col4: { width: '20%', textAlign: 'right' },
})

interface ReportData {
  expenses: Array<{
    id: string
    amount: string
    description: string
    category: string
    date: string
  }>
  summary: ExpenseSummary
  dateRange: {
    start: string
    end: string
  }
}

export function createExpenseReport(data: ReportData) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Expense Report</Text>
        
        <Text style={styles.subtitle}>
          Period: {data.dateRange.start} - {data.dateRange.end}
        </Text>

        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text>Total Expenses:</Text>
            <Text>${data.summary.totalExpenses.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text>Average Expense:</Text>
            <Text>${data.summary.averageExpense.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text>Highest Expense:</Text>
            <Text>${data.summary.highestExpense.toFixed(2)}</Text>
          </View>
          {data.summary.topCategory && (
            <View style={styles.summaryRow}>
              <Text>Top Category:</Text>
              <Text>
                {data.summary.topCategory.name} (${data.summary.topCategory.amount.toFixed(2)})
              </Text>
            </View>
          )}
        </View>

        <View style={styles.table}>
          <Text style={styles.subtitle}>Expense Details</Text>
          
          <View style={styles.tableHeader}>
            <Text style={styles.col1}>Date</Text>
            <Text style={styles.col2}>Description</Text>
            <Text style={styles.col3}>Category</Text>
            <Text style={styles.col4}>Amount</Text>
          </View>

          {data.expenses.map((expense) => (
            <View key={expense.id} style={styles.tableRow}>
              <Text style={styles.col1}>{expense.date}</Text>
              <Text style={styles.col2}>{expense.description}</Text>
              <Text style={styles.col3}>{expense.category}</Text>
              <Text style={styles.col4}>{expense.amount}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  )
}

