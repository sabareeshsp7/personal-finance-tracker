'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { logout } from './actions'

export function LogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    await logout()
    router.push('/login')
  }

  return (
    <Button variant="outline" onClick={handleLogout}>
      Logout
    </Button>
  )
}

