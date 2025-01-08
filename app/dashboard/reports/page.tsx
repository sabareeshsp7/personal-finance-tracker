import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { ReportsClient } from './reports-client'

export default async function ReportsPage() {
  const session = await getSession()
  if (!session?.id) {
    redirect('/login')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Financial Reports</h1>
        <p className="text-muted-foreground">
          Generate and analyze your expense reports
        </p>
      </div>
      <ReportsClient userId={String(session.id)} />
    </div>
  )
}

