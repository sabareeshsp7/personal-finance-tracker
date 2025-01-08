import React from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { LogoutButton } from './logout-button'
import { db } from '@/lib/db'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  if (!session?.id) {
    redirect('/login')
  }

  const user = session?.id ? await db.user.findUnique({
    where: { id: session.id as string },
  }) : null

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-6">
              <h1 className="text-xl font-semibold">Finance Tracker</h1>
              <nav className="flex gap-4">
                <Link
                  href="/dashboard"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Overview
                </Link>
                <Link
                  href="/dashboard/expenses"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Expenses
                </Link>
                <Link
                  href="/dashboard/reports"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Reports
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <p>Welcome, {user.name}</p>
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  )
}

